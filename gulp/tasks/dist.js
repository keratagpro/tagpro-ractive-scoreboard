var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');

gulp.task('dist', ['build'], function() {
	gulp.src('./build/bundle.js')
		.pipe(uglify())
		.pipe(addsrc.prepend('./src/userscript-header.txt'))
		.pipe(concat('tagpro-scoreboard.user.js'))
		.pipe(gulp.dest('./dist/'));
});