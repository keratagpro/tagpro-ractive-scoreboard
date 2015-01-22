var path = require('path');

var buildPath = 'build';
var bundleName = 'tagpro-ractive-scoreboard.user.js';
var metaName = 'tagpro-ractive-scoreboard.meta.js';
var entryPath = './src/index.js';
var headerPath = './src/header.js';

module.exports = {
	browserify: {
		src: entryPath,
		dest: buildPath,
		header: headerPath,
		outputName: bundleName
	},
	browserSync: {
		src: [buildPath + '/**'],
		baseDir: buildPath
	},
	example: {
		src: 'example/**',
		dest: buildPath
	},
	publish: {
		src: buildPath
	},
	scss: {
		src: 'src/**/*.scss',
		dest: 'src'
	},
	sprites: {
		src: 'src/images/*.png',
		dest: 'src'
	}
};