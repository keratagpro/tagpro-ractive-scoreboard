var path = require('path');

var tmp = 'tmp/build';
var bundleName = 'bundle.js';
var userscriptName = 'tagpro-scoreboard.user.js';

module.exports = {
	browserify: {
		src: './tmp/build/index.js',
		dest: tmp,
		outputName: bundleName
	},
	html: {
		src: 'src/**/*.html',
		dest: tmp
	},
	scss: {
		src: 'src/**/*.scss',
		dest: tmp
	},
	scripts: {
		src: ['src/**/*.js'],
		dest: tmp
	},
	dist: {
		src: path.join('.', tmp, bundleName),
		header: './src/userscript-header.txt',
		outputName: userscriptName,
		dest: './build/'
	},
	sprites: {
		src: 'src/images/*.png',
		dest: 'src'
	},
	example: {
		src: 'example/**',
		dest: 'build'
	},
	ghPages: {
		src: 'build'
	}
};