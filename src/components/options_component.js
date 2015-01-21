var fs = require('fs');
var Ractive = require('ractive');

var getChanges = require('../util/getChanges');
var storage = require('../util/storage');
var defaultOptions = require('../scoreboard-options');

function loadOptions() {
	this.set('options', $.extend(true, {}, defaultOptions, storage.getJson('options')));
}

function saveOptions() {
	var stats = this.get('statsMap');

	var selectedStats = [], key;

	for (key in stats) {
		if (stats[key].selected) {
			selectedStats.push(key);
		}
	}

	var options = this.get('options');
	var changed = getChanges(defaultOptions, options) || null;

	if (defaultOptions.selectedStatisticsKeys.join(',') !== selectedStats.join(',')) {
		changed.selectedStatisticsKeys = selectedStats;
	}

	if (changed && changed.showOptions) {
		delete changed.showOptions; // Don't store the Options window setting
	}

	console.log('Saved Settings: ', changed);
	storage.setJson('options', changed);
}

function resetOptions() {
	storage.setItem('options', null);
	this.loadOptions();
}

var OptionsComponent = Ractive.extend({
	noCssTransform: true,
	css: fs.readFileSync(__dirname + '/options_component.css', 'utf8'),
	template: require('./options_component.ract'),
	components: {
		'Textbox': require('./textbox_component'),
		'Checkbox': require('./checkbox_component')
	},
	loadOptions: loadOptions,
	saveOptions: saveOptions,
	resetOptions: resetOptions
});

module.exports = OptionsComponent;