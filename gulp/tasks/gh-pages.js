var gulp = require('gulp');
var ghPages = require('gh-pages');
var path = require('path');
var handleErrors = require('../util/handleErrors');

gulp.task('gh-pages', ['build'], function() {
	ghPages.publish(path.join(__dirname, '../../build'), handleErrors);
});