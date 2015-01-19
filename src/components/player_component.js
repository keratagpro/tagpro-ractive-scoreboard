var fs = require('fs');
var Ractive = require('ractive');

var PlayerComponent = Ractive.extend({
	noCssTransform: true,
	css: fs.readFileSync(__dirname + '/player_component.css', 'utf8'),
	template: require('./player_component.ract')
});

module.exports = PlayerComponent;