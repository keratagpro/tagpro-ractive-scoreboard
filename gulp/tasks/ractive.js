var gulp = require('gulp');
var cached = require('gulp-cached');
var ractive = require('gulp-ractive');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var config = require('../config').html;

gulp.task('ractive', function() {
	return gulp.src(config.src)
		.pipe(cached('js'))
		.pipe(ractive())
		.pipe(replace(/^{/, 'module.exports = {'))
		.pipe(rename({ extname: '.ract' }))
		.pipe(gulp.dest(config.dest));
});
