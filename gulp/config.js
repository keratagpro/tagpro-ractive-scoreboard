var path = require('path');

var tempPath = 'tmp/src';
var buildPath = 'build';
var bundleName = 'tagpro-ractive-scoreboard.js';
var userscriptName = 'tagpro-ractive-scoreboard.user.js';
var userscriptMetaName = 'tagpro-ractive-scoreboard.meta.js';
var entryPath = './' + tempPath + '/index.js';
var headerPath = './src/scoreboard.header.js';

module.exports = {
	html: {
		src: 'src/**/*.html',
		dest: tempPath
	},
	scss: {
		src: 'src/**/*.scss',
		dest: tempPath
	},
	scripts: {
		src: ['src/**/*.js'],
		dest: tempPath
	},
	sprites: {
		src: 'src/images/*.png',
		dest: 'src'
	},
	example: {
		src: 'example/**',
		dest: buildPath
	},
	browserify: {
		src: entryPath,
		dest: buildPath,
		outputName: bundleName
	},
	browserSync: {
		src: [buildPath + '/**'],
		baseDir: buildPath
	},
	production: {
		src: path.join(buildPath, bundleName),
		header: headerPath,
		dest: buildPath,
		outputName: userscriptName,
		outputMetaName: userscriptMetaName
	},
	ghPages: {
		src: buildPath
	}
};