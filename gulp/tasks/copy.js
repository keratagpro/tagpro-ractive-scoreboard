var gulp = require('gulp');
var config = require('../config').example;

gulp.task('copy', function() {
	return gulp.src(config.src)
		.pipe(gulp.dest(config.dest));
});
