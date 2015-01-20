var Ractive = require('ractive');

var TextboxComponent = Ractive.extend({
	isolated: true,
	template: require('./textbox_component.ract')
});

module.exports = TextboxComponent;