var prevent = require("./index.js");
var assert = require("./tasks/assert.js");

module.exports = function(grunt) {
	grunt.initConfig({
		clean: ["tmp"],
		copy: {
			// Copy some files in the tmp folder,
			// these should not be overridden
			prepare: {
				files: [{
					expand: true,
					cwd: "test/fixture",
					src: ["*"],
					dest: "tmp"
				}]
			},
			over: {
				files: [{
					expand: true,
					cwd: "test/source",
					src: ["*"],
					dest: "tmp"
				}]
			}
		},
		uglify: {
			over: {
				files: [{
					expand: true,
					cwd: "test/js",
					src: ["*"],
					dest: "tmp"
				}]
			}
		},
		shell: {
			options: {
				stdout: false
			},
			defaults: {
				command: "grunt prevent:defaults --no-color",
				options: {
					callback: assert("fail")
				}
			},
			force: {
				command: "grunt prevent:defaults --no-color --force",
				options: {
					callback: assert("force")
				}
			},
			nofail: {
				command: "grunt prevent:nofail --no-color",
				options: {
					// Nofail works just like the force
					callback: assert("force")
				}
			}
		}
	});

	require("load-grunt-tasks")(grunt);
	grunt.registerTask("test", ["shell"]);

	grunt.registerTask("prevent", function (action) {
		// This is the juicy part
		if (action === "defaults") {
			prevent(grunt);
		} else if (action === "nofail") {
			prevent(grunt).nofail();
		}

		grunt.task.run(["clean", "copy:prepare", "copy:over", "uglify"]);
	});
};
