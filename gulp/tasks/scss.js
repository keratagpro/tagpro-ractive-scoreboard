var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cached = require('gulp-cached');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var reload = require('browser-sync').reload;
var config = require('../config').scss;

gulp.task('scss', ['sprites'], function() {
	return gulp.src(config.src)
		.pipe(cached('scss'))
		.pipe(sass())
		.on('error', function(err) {
			console.error(err);
			this.emit('end');
		})
		.pipe(autoprefixer())
		.pipe(minify())
		.pipe(gulp.dest(config.dest))
		.pipe(reload({ stream: true }));
});
