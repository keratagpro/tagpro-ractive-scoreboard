var $ = require('jquery');
var tagpro = require('tagpro');
var filter = require('./util/filter');

var powerupCounts = {
	gripCount: { label: 'Grip', id: 'grip' },
	speedCount: { label: 'Speed', id: 'speed' },
	bombCount: { label: 'Rolling Bomb', id: 'bomb' },
	tagproCount: { label: 'Tagpro', id: 'tagpro' }
};

var summables = {
	's-tags': { label: 'Tags' },
	's-pops': { label: 'Pops' },
	's-grabs': { label: 'Grabs' },
	's-returns': { label: 'Returns' },
	's-captures': { label: 'Captures' },
	's-drops': { label: 'Drops' },
	's-support': { label: 'Support' },
	's-hold': { label: 'Hold', time: true },
	's-prevent': { label: 'Prevent', time: true },
	'score': { label: 'Score' },
	'points': { label: 'Points' },
	'degree': { label: 'Degree' }
};

var playerDefaults = (function() {
	var def = {
		dead: false,
		auth: false,
		flag: null,
		flair: null,
		team: null,
		name: 'Some Ball'
	};

	Object.keys(summables).forEach(function(key) {
		def[key] = 0;
	});

	Object.keys(powerupCounts).forEach(function(key) {
		def[key] = 0;
		def[powerupCounts[key].id] = false;
	});

	def.powerups = 0;

	return def;
})();

var statistics = $.extend(true, {}, summables, powerupCounts, {
	powerups: { label: 'Powerups' }
});

function addInitialValuesToPlayers(players) {
	var playerKeys = Object.keys(tagpro.players);
	var keys = Object.keys(playerDefaults);

	playerKeys.forEach(function(key) {
		var player = players[key];

		keys.forEach(function(key) {
			player[key] = player[key] || playerDefaults[key];
		});
	});
}

function addPowerupCounts(ractive) {
	var keys = Object.keys(powerupCounts).map(function(item) { return powerupCounts[item].id; });

	var keypaths = keys.map(function(item) {
		return 'players.*.' + item;
	}).join(' ');

	ractive.observe(keypaths, function(val, old, keypath) {
		if (val && !old) {
			ractive.set(keypath + 'Count', (ractive.get(keypath + 'Count') || 0) + 1);
		}
	});
}

function forceRactiveMagicMode(ractive) {
	var playerIds = Object.keys(ractive.get('players'));
	var keys = Object.keys(playerDefaults);

	playerIds.forEach(function(player) {
		keys.forEach(function(key) {
			ractive.get('players.' + player + '.' + key);
		});
	});
}

function getPlayersByTeam(players, team) {
	return filter(players, function(item) {
		return item.team === team;
	});
}

function getTeamStats(players) {
	var stats = Object.keys(summables);
	var powerups = Object.keys(powerupCounts);
	Array.prototype.push.apply(stats, powerups);

	var map = {};

	stats.forEach(function(stat) {
		map[stat] = Object.keys(players).reduce(function(sum, key) {
			if (!players[key]) {
				return sum;
			}

			return sum + (players[key][stat] || 0);
		}, 0);
	});

	map.powerups = powerups.reduce(function(sum, key) {
		return sum + map[key];
	}, 0);

	return map;
}

function injectGlobalCss(css) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.head.appendChild(style);	
}

function selectedStatistics() {
	var stats = this.get('statistics');

	var key;
	var map = {};

	for (key in stats) {
		if (stats[key].selected) {
			map[key] = stats[key];
		}
	}

	return map;
}

module.exports = {
	addInitialValuesToPlayers: addInitialValuesToPlayers,
	addPowerupCounts: addPowerupCounts,
	forceRactiveMagicMode: forceRactiveMagicMode,
	getPlayersByTeam: getPlayersByTeam,
	getTeamStats: getTeamStats,
	injectGlobalCss: injectGlobalCss,
	selectedStatistics: selectedStatistics,
	statistics: statistics
};