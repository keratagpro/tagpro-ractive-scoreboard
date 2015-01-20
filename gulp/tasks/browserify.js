var browserify = require('browserify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var util = require('gulp-util');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var config = require('../config').browserify;

gulp.task('browserify', ['ractive', 'scss', 'scripts'], function() {
	var args = {};
	if (global.isWatching) {
		args = watchify.args; // cache, packageCache, fullPaths
		args.debug = true;
	}

	var bundler = browserify(config.src, args);

	if (global.isWatching) {
		bundler = watchify(bundler);
	}

	function rebundle() {
		return bundler
			.bundle()
			.on('error', handleErrors)
			.pipe(source(config.outputName))
			.pipe(gulp.dest(config.dest));
	}

	if (global.isWatching) {
		bundler
			.on('log', util.log.bind(util, config.outputName + ':'))
			.on('update', rebundle);
	}

	return rebundle();
});
