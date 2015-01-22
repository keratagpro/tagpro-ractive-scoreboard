var defaultOptions = require('./scoreboard-options');
var filter = require('./util/object/filter');
var storage = require('./util/storage');
require('./util/ractive-transitions-fly');

var helpers = require('./util/helpers');

// Ractive.defaults.noCssTransform = true; // TODO: Doesn't seem to work?
Ractive.decorators.movable = require('./decorators/movable');

var scoreboard = Ractive.extend({
	debug: true,
	template: require('./scoreboard.html'),
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
			return helpers.getTeamStats.call(this, players);
		},
		blueTeamStats: function() {
			return helpers.getTeamStats.call(this, this.get('bluePlayers'));
		},
		selectedStatsMap: function() {
			return filter(this.get('statsMap'), function(stat) {
				return stat.selected;
			});
		},
		'options.selectedStats': {
			get: function() {
				return Object.keys(this.get('selectedStatsMap'));
			},
			set: function(keys) {
				keys.forEach(function(stat) {
					this.set('statsMap.' + stat + '.selected', true);
				}.bind(this));
			}
		}
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

		this.on('Options.resetOptions', this.loadOptions);

		helpers.observePowerupCounts.call(this);
		
		helpers.injectGlobalCss(require('./scoreboard.tmp.css'));

		window.addEventListener('mousemove', this.get('mouseMoveHandler').bind(this));
	}
});

module.exports = scoreboard;