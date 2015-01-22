var Ractive = require('ractive');

var TextboxComponent = Ractive.extend({
	isolated: true,
	template: require('./textbox_component.html'),
	data: {
		class: 'pure-u-sm-1-2'
	}
});

module.exports = TextboxComponent;