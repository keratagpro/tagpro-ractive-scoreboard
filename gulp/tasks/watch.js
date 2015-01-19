var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
	gulp.watch(config.html.src, ['ractive']);
	gulp.watch(config.scss.src, ['scss']);
	gulp.watch(config.js.src, ['scripts']);
	gulp.watch(config.example.src, ['copy']);
	gulp.watch(config.sprites.src, ['sprites']);
});
