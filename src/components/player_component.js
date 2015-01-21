var fs = require('fs');
var Ractive = require('ractive');

var helpers = require('../util/helpers');

var PlayerComponent = Ractive.extend({
	isolated: true,
	noCssTransform: true,
	css: fs.readFileSync(__dirname + '/player_component.css', 'utf8'),
	template: require('./player_component.ract'),
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