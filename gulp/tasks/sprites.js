var gulp = require('gulp');
var sprite = require('css-sprite').stream;
var config = require('../config').sprites;

gulp.task('sprites', function () {
	return gulp.src(config.src)
		.pipe(sprite({
			base64: true,
			style: '_sprites.tmp.scss',
			processor: 'css'
		}))
		.pipe(gulp.dest(config.dest));
});