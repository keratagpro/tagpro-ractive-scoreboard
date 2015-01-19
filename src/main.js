var fs = require('fs');
var Ractive = require('ractive');

var defaultOptions = require('./main-options');
var getChanges = require('./util/getChanges');
var storage = require('./util/storage');
require('./util/ractive-transitions-fly');

var helpers = require('./main-helpers');
var getPlayersByTeam = helpers.getPlayersByTeam;
var getTeamStats = helpers.getTeamStats;
var addPowerupCounts = helpers.addPowerupCounts;
var selectedStatistics = helpers.selectedStatistics;

// Ractive.defaults.noCssTransform = true; // TODO: Doesn't seem to work?
Ractive.decorators.movable = require('./decorators/movable');

var ractive = new Ractive({
	debug: true,
	el: '#output',
	template: require('./main.ract'),
	magic: true,
	data: require('./main-data'),
	computed: {
		redPlayers: function() {
			return getPlayersByTeam.call(this, this.get('players'), 1);
		},
		bluePlayers: function() {
			return getPlayersByTeam.call(this, this.get('players'), 2);
		},
		redTeamStats: function() {
			return getTeamStats.call(this, this.get('redPlayers'));
		},
		blueTeamStats: function() {
			return getTeamStats.call(this, this.get('bluePlayers'));
		},
		selectedStatistics: selectedStatistics
	},
	reloadOptions: function() {
		this.set('options', $.extend(true, {}, defaultOptions, storage.getJson('options')));

		// Reset Statistics
		this.set('statistics.*.selected', false);
		var selected = this.get('options.selectedStatisticsKeys');
		selected.forEach(function(key) {
			this.set('statistics.' + key + '.selected', true);
		}.bind(this));
	},
	components: {
		'Options': require('./components/options_component'),
		'Scoreboard': require('./components/scoreboard_component')
	},
	oninit: function() {
		this.reloadOptions();

		window.addEventListener('mousemove', this.get('mouseMoveHandler').bind(this));
	}
});

ractive.on('Options.saveOptions', function() {
	var changed = getChanges(defaultOptions, this.get('options')) || null;

	if (changed && changed.showOptions) {
		delete changed.showOptions; // Don't store the Options window setting
	}

	console.log('Saved Settings: ', changed);
	storage.setJson('options', changed);
});

ractive.on('Options.resetOptions', function() {
	storage.setItem('options', null);
	this.reloadOptions();
});

addPowerupCounts(ractive);

window.ractive = ractive;

var style = document.createElement('style');
style.type = "text/css";
style.innerHTML = fs.readFileSync(__dirname + '/main.css', 'utf8');
document.head.appendChild(style);