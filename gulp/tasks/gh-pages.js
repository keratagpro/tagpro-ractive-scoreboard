var gulp = require('gulp');
var ghpages = require('gh-pages');
var gitConfig = require('git-config');
var config = require('../config').ghPages;

gulp.task('gh-pages', ['dist'], function() {
	ghpages.publish(config.src, {
		user: gitConfig.sync('.git/config').user
	});
});