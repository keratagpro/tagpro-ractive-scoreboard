var tmp = '.tmp';

module.exports = {
	browserify: {
		src: './.tmp/main.js',
		dest: 'build',
		outputName: 'bundle.js'
	},
	html: {
		src: 'src/**/*.html',
		dest: tmp
	},
	scss: {
		src: 'src/**/*.scss',
		dest: tmp
	},
	js: {
		src: 'src/**/*.js',
		dest: tmp
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
		src: 'build/**'
	}
};