var Ractive = require('ractive');

var helpers = require('../util/helpers');

var PlayerComponent = Ractive.extend({
	isolated: true,
	noCssTransform: true,
	css: require('./player_component.tmp.css'),
	template: require('./player_component.html'),
	data: {
		getSprite: helpers.getSprite,
		getFlag: function(flag) {
			return helpers.getSprite(flag === 1 ? 'redflag' : flag === 2 ? 'blueflag' : 'yellowflag');
		},
		getFlair: function(flair) {
			var x = flair ? flair.x : 10;
			var y = flair ? flair.y : 10;
			var width = 16;
			var height = 16;
			var position = (-x * width) + 'px ' + (-y * height) + 'px';
			return position;
		}
	}
});

module.exports = PlayerComponent;