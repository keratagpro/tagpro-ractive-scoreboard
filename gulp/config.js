var path = require('path');

var tempPath = 'tmp/src';
var buildPath = 'build';
var bundleName = 'bundle.js';
var userscriptName = 'tagpro-scoreboard.user.js';
var userscriptMetaName = 'tagpro-scoreboard.meta.js';
var entryPath = './' + tempPath + '/index.js';

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
	dist: {
		src: path.join(buildPath, bundleName),
		header: './src/userscript-header.txt',
		outputName: userscriptName,
		metaName: userscriptMetaName,
		dest: buildPath
	},
	ghPages: {
		src: buildPath
	}
};