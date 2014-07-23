var assert = require("assert");
var UglifyJS = require("uglify-js");
var fs = require("fs");

module.exports = function (what) {
	if (what === "fail") {
		return function (err, stdout, stderr, callback) {
			// Because we throw an error immediately I expect the file to be
			// the same as the fixtures.
			// And of course there should be an error logged
			fileEqual("tmp/one", "test/fixture/one");
			fileEqual("tmp/code.js", "test/fixture/code.js");
			assert.ok(!fs.existsSync("tmp/lib.js"), "Lib.js should not be created");
			assert.ok(/Trying to override file: tmp\/one/.test(stdout));
			assert.ok(!!err, "Should throw an error");

			callback();
		};
	} else if (what === "force") {
		return function (err, stdout, stderr, callback) {
			// When forcing, the task should continue but files are not
			// overridden, just logging an error is enough
			fileEqual("tmp/one", "test/fixture/one");
			fileEqual("tmp/two", "test/source/two");
			fileEqual("tmp/code.js", "test/fixture/code.js");
			jsEqual("tmp/lib.js", "test/js/lib.js");
			assert.ok(/Trying to override file: tmp\/one/.test(stdout));
			assert.ok(!err, "Should not throw an error");

			callback();
		};
	} else {
		throw new Error("Not sure what to assert");
	}

	function fileEqual (one, two) {
		assert.equal(fs.readFileSync(one).toString(), fs.readFileSync(two).toString());
	}

	function jsEqual (one, two) {
		var actual = fs.readFileSync(one).toString();
		var expected = UglifyJS.minify(two).code;
		assert.equal(actual, expected);
	}
};
