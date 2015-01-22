var fs = require('fs');
var Ractive = require('ractive');

var getChanges = require('../util/getChanges');
var storage = require('../util/storage');
var defaultOptions = require('../scoreboard-options');

function storeOptions() {
	var options = this.get('options');

	var changed = getChanges(defaultOptions, options) || null;

	if (changed && changed.showOptions) {
		delete changed.showOptions; // Don't store the Options window setting
	}

	console.log('Saved Settings: ', changed);
	storage.setJson('options', changed);
}

function resetOptions() {
	storage.removeItem('options');
	this.fire('resetOptions');
}

var OptionsComponent = Ractive.extend({
	noCssTransform: true,
	css: require('./options_component.tmp.css'),
	template: require('./options_component.html'),
	components: {
		'Textbox': require('./textbox_component'),
		'Checkbox': require('./checkbox_component')
	},
	storeOptions: storeOptions,
	resetOptions: resetOptions
});

module.exports = OptionsComponent;