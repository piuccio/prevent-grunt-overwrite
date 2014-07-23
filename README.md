Prevent grunt plugins from overwriting existing files.

# Why

When you have a large project or a complex build you might want to make sure that you don't write the same file twice.

# How to use

In your `Gruntfile.js`

```js
var prevent = require("./index.js");

module.exports = function(grunt) {
	grunt.initConfig({
		// Whatever config here
	});

	prevent(grunt);

	grunt.registerTask("default", ["one", "two", "..."]);
};
```

If any of your grunt plugins is trying to overwrite a file, the task will fail.

You can let the task continue using `grunt --force`. This will log an error when your tasks try to overwrite a file, but will not change the file content.

Using `--force` affects all tasks. If you only want to prevent your tasks from failing you can use

```js
var prevent = require("./index.js");

module.exports = function(grunt) {
	prevent(grunt).nofail();
};
```

# Internal details

This plugin is very simple, you can check the code. It overrides the `grunt.file.write` method to check whether the file already exists.

It only works with other plugins that use `grunt.file.write`, any call to a write method of node `fs` module will not be detected.


# History

* 0.1.0 Create the project
