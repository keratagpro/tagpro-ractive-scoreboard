var gulp = require('gulp');
var cached = require('gulp-cached');
var config = require('../config').scripts;

gulp.task('scripts', function() {
	return gulp.src(config.src)
		.pipe(cached('js'))
		.pipe(gulp.dest(config.dest));
});
