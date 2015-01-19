var filter = require('./util/filter');

var powerups = {
	grip: { label: 'Grip' },
	speed: { label: 'Speed' },
	bomb: { label: 'Rolling Bomb' },
	tagpro: { label: 'Tagpro' }
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

function getTeamStats(players) {
	var stats = Object.keys(summables);
	var powerupCounts = Object.keys(powerups).map(function(item) { return item + 'Count'; });
	Array.prototype.push.apply(stats, powerupCounts);

	var map = {};

	stats.forEach(function(stat) {
		map[stat] = Object.keys(players).reduce(function(sum, key) {
			if (!players[key]) {
				return sum;
			}

			return sum + (players[key][stat] || 0);
		}, 0);
	});

	map.powerups = powerupCounts.reduce(function(sum, key) {
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
	var keys = Object.keys(powerups);

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
	getTeamStats: getTeamStats,
	getPlayersByTeam: getPlayersByTeam,
	addPowerupCounts: addPowerupCounts
};