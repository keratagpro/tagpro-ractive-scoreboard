var Ractive = require('ractive');

var CheckboxComponent = Ractive.extend({
	isolated: true,
	template: require('./checkbox_component.html'),
	data: {
		trueClass: 'selected',
		falseClass: '',
		size: 'small'
	}
});

module.exports = CheckboxComponent;