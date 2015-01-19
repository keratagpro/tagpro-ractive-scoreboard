var fs = require('fs');
var Ractive = require('ractive');

var OptionsComponent = Ractive.extend({
	noCssTransform: true,
	css: fs.readFileSync(__dirname + '/options_component.css', 'utf8'),
	template: require('./options_component.ract'),
	components: {
		'Textbox': require('./textbox_component'),
		'Checkbox': require('./checkbox_component')
	}
});

module.exports = OptionsComponent;