var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var config = require('../config').ghPages;

gulp.task('gh-pages', function() {
	return gulp.src(config.src)
		.pipe(deploy({ cacheDir: '.tmpRepo', push: false }));
});