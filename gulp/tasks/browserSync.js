var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browserSync', ['build', 'copy'], function() {
	browserSync.init(['build/**'], {
		server: {
			baseDir: 'build'
		},
		open: false
	});
});
