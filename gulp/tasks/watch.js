var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['setWatch', 'build', 'browser'], function() {
	gulp.watch(config.scss.src, ['scss']);
	gulp.watch(config.example.src, ['example']);
	gulp.watch(config.sprites.src, ['sprites']);
});
