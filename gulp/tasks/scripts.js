var gulp = require('gulp');
var cached = require('gulp-cached');

gulp.task('scripts', function() {
	return gulp.src(['src/**/*.js'])
		.pipe(cached('js'))
		.pipe(gulp.dest('.tmp'));
});
