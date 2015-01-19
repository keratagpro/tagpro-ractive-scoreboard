var Ractive = require('ractive');

var CheckboxComponent = Ractive.extend({
	isolated: true,
	template: require('./checkbox_component.ract'),
	data: {
		trueClass: 'selected',
		falseClass: '',
		size: 'small'
	}
});

module.exports = CheckboxComponent;