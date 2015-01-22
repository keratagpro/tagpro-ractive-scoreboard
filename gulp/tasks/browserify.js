var browserify = require('browserify');
var fs = require('fs');
var transform = require('vinyl-transform');
var watchify = require('watchify');

var gulp = require('gulp');
var addSrc = require('gulp-add-src');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var util = require('gulp-util');

var config = require('../config').browserify;
var handleErrors = require('../util/handle-errors');

gulp.task('browserify', ['scss'], function() {
	var options = {};

	if (global.isWatching) {
		options = watchify.args;
		options.debug = true;
	}

	function bundle() {
		return gulp.src(config.src)
			.pipe(bundler(options))
			.pipe(addSrc.prepend(config.header))
			.pipe(concat(config.outputName))
			.pipe(gulp.dest(config.dest));
	}

	var b = browserify(config.src, options);

	if (global.isWatching) {
		b = watchify(b);
		b.on('log', util.log.bind(util, config.outputName + ':'));
		b.on('update', bundle);
	}

	function bundler(options) {
		return transform(function(filename) {
			return b.bundle()
				.on('error', handleErrors);
		});
	}

	return bundle();
});
