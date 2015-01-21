var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');
var config = require('../config').production;

gulp.task('production', ['build'], function() {
	gulp.src(config.header)
		.pipe(rename(config.outputMetaName))
		.pipe(gulp.dest(config.dest));

	return gulp.src(config.src)
		.pipe(uglify())
		.pipe(addsrc.prepend(config.header))
		.pipe(concat(config.outputName))
		.pipe(gulp.dest(config.dest));
});