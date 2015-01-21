var fs = require('fs');

var defaultOptions = require('./scoreboard-options');
var filter = require('./util/object/filter');
var storage = require('./util/storage');
require('./util/ractive-transitions-fly');

var helpers = require('./scoreboard-helpers');
var forceRactiveMagicMode = helpers.forceRactiveMagicMode;
var getPlayersByTeam = helpers.getPlayersByTeam;
var getTeamStats = helpers.getTeamStats;
var injectGlobalCss = helpers.injectGlobalCss;
var selectedStatistics = helpers.selectedStatistics;

// Ractive.defaults.noCssTransform = true; // TODO: Doesn't seem to work?
//Ractive.decorators.movable = require('./decorators/movable');

var scoreboard = Ractive.extend({
	debug: true,
	template: require('./scoreboard.ract'),
	data: require('./scoreboard-data'),
	computed: {
		redPlayers: function() {
			return this.getPlayersByTeam(1);
		},
		bluePlayers: function() {
			return this.getPlayersByTeam(2);
		},
		redTeamStats: function() {
			var players = this.get('redPlayers');
			return getTeamStats.call(this, players);
		},
		blueTeamStats: function() {
			return getTeamStats.call(this, this.get('bluePlayers'));
		},
		selectedStatistics: selectedStatistics
	},
	components: {
		'Options': require('./components/options_component'),
		'Scoreboard': require('./components/scoreboard_component')
	},
	getPlayersByTeam: function(team) {
		return filter(this.get('tagpro.players'), function(player) {
			return player.team === team;
		});
	},
	loadOptions: function() {
		this.set('options', $.extend(true, {}, defaultOptions, storage.getJson('options')));
	},
	onrender: function() {
		this.loadOptions();

		window.addEventListener('mousemove', this.get('mouseMoveHandler').bind(this));

		helpers.observePowerupCounts.call(this);

		//forceRactiveMagicMode(this);

		injectGlobalCss(fs.readFileSync(__dirname + '/scoreboard.css', 'utf8'));
	}
});

module.exports = scoreboard;