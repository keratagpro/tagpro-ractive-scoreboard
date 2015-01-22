var transformTools = require('browserify-transform-tools');

var options = {excludeExtensions: [".json"]};

module.exports = transformTools.makeStringTransform("browserify-add-header", options,
	function (content, opts, done) {
		var file = opts.file;
		if(!opts.config) {
			return done(new Error("Could not find browserify-add-header configuration."));
		}
		done(null, fs.readFileSync(opts.config.file) + content);
	});