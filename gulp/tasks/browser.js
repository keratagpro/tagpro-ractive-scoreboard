var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config').browserSync;

gulp.task('browser', function() {
	browserSync.init(config.src, {
		server: {
			baseDir: config.baseDir
		}
	});
});
