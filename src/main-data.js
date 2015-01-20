var $ = require('jquery');
var tagpro = require('tagpro');

var storage = require('./util/storage');

var mouseMoveTimeout;
var defaultOptions = require('./main-options');

var helpers = require('./main-helpers');

var score = tagpro.score || { r: 0, b: 0 };
tagpro.socket.on('score', function(s) {
	score.r = s.r;
	score.b = s.b;
});

helpers.addInitialValuesToPlayers(tagpro.players);

module.exports = {
	defaultOptions: defaultOptions,
	mouseMoved: false,
	players: tagpro.players,
	score: score,
	statistics: helpers.statistics,
	getSprite: function(sprite) {
		var width = 40;
		var height = 40;
		var tile = tagpro.tiles[sprite];
		var position = (-tile.x * width) + "px " + (-tile.y * height) + "px";
		return position;
	},
	getFlag: function(flag) {
		var sprite = this.get('getSprite');
		return sprite(flag == 1 ? 'redflag' : flag == 2 ? 'blueflag' : 'yellowflag');
	},
	getFlair: function(flair) {
		var x = flair ? flair.x : 10;
		var y = flair ? flair.y : 10;
		var width = 16;
		var height = 16;
		var position = (-x * width) + "px " + (-y * height) + "px";
		return position;
	},
	mouseMoveHandler: function(ev) {
		this.set('mouseMoved', true);

		if (mouseMoveTimeout) {
			clearTimeout(mouseMoveTimeout);
		}

		mouseMoveTimeout = setTimeout(function() {
			this.set('mouseMoved', false);
		}.bind(this), 1000);
	}
};
