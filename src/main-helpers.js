var $ = require('jquery');
var filter = require('./util/filter');

var powerupCounts = {
	gripCount: { label: 'Grip', id: 'grip' },
	speedCount: { label: 'Speed', id: 'speed' },
	bombCount: { label: 'Rolling Bomb', id: 'bomb' },
	tagproCount: { label: 'Tagpro', id: 'tagpro' }
}

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

var statistics = $.extend(true, {}, summables, powerupCounts, {
	powerups: { label: 'Powerups' }
});

function selectedStatistics() {
	var stats = this.get('statistics');

	var key;
	var map = {};

	for (key in stats) {
		if (stats[key].selected) {
			map[key] = stats[key];
		}
	}

	return map
}

function injectGlobalCss(css) {
	var style = document.createElement('style');
	style.type = "text/css";
	style.innerHTML = css;
	document.head.appendChild(style);	
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

function getPlayersByTeam(players, team) {
	var players = this.get('players');

	return filter(players, function(item) {
		return item.team === team;
	});
}

function addPowerupCounts(ractive) {
	var keys = Object.keys(powerupCounts).map(function(item) { return powerupCounts[item].id });

	var keypaths = keys.map(function(item) {
		return 'players.*.' + item;
	}).join(' ');

	ractive.observe(keypaths, function(val, old, keypath) {
		if (val && !old) {
			ractive.set(keypath + 'Count', (ractive.get(keypath + 'Count') || 0) + 1);
		}
	});
}

module.exports = {
	statistics: statistics,
	selectedStatistics: selectedStatistics,
	getTeamStats: getTeamStats,
	getPlayersByTeam: getPlayersByTeam,
	addPowerupCounts: addPowerupCounts,
	injectGlobalCss: injectGlobalCss
};