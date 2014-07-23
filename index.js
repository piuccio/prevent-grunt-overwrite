module.exports = function (grunt) {
	// If we use --force we don't want the task to fail
	var shouldFail = !grunt.option("force");
	wrap();

	return {
		nofail: function () {
			shouldFail = false;
		}
	};

	function wrap() {
		var originalWrite = grunt.file.write;
		var previousWrite = {};
		grunt.file.write = function (filepath) {

			if (grunt.file.exists(filepath)) {
				var msg = "Trying to override file: " + filepath + "\n" +
					"The file was previously created by task " + getTaskOf(filepath);
				if (shouldFail) {
					grunt.verbose.error();
					throw grunt.util.error(msg);
				} else {
					grunt.log.error(msg);
					return;
				}
			}
			previousWrite[filepath] = {
				task: grunt.task.current || {}
			};

			return originalWrite.apply(grunt.file, arguments);
		};

		function getTaskOf (filepath) {
			var task = previousWrite[filepath].task;
			var name = task.name || "-unknown- sorry :(";
			if (task.target) {
				name += ":" + task.target;
			}
			return name;
		}
	}
};
