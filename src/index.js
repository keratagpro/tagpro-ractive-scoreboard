var w = window;
w.tagpro = tagpro || require('tagpro'); // HACK: Stuff to make browserify-shim work.
w.$ = $ || require('jquery');

tagpro.ready(function() {
	$(document.body).append('<div id="kera-scoreboard-container"></div>');

	window.keraScoreboard = require('./main');

	console.log('Kera TagPro Scoreboard initialized.');
})