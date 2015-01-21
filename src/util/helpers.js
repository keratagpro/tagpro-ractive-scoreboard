// var playerDefaults = (function() {
// 	var def = {
// 		dead: false,
// 		auth: false,
// 		flag: null,
// 		flair: null,
// 		team: null,
// 		name: 'Some Ball'
// 	};

// 	Object.keys(summables).forEach(function(key) {
// 		def[key] = 0;
// 	});

// 	Object.keys(powerupCounts).forEach(function(key) {
// 		def[key] = 0;
// 		def[powerupCounts[key].id] = false;
// 	});

// 	def.powerups = 0;

// 	return def;
// })();

// function addInitialValuesToPlayers(players) {
// 	var playerKeys = Object.keys(tagpro.players);
// 	var keys = Object.keys(playerDefaults);

// 	playerKeys.forEach(function(key) {
// 		var player = players[key];

// 		keys.forEach(function(key) {
// 			player[key] = player[key] || playerDefaults[key];
// 		});
// 	});
// }

var stats = require('./stats');

function getSprite(sprite) {
	var width = 40;
	var height = 40;
	var tile = tagpro.tiles[sprite];
	var position = (-tile.x * width) + 'px ' + (-tile.y * height) + 'px';
	return position;
}

function observePowerupCounts() {
	var keys = Object.keys(stats.powerupCounts).map(function(item) { return stats.powerupCounts[item].id; });

	var keypaths = keys.map(function(item) {
		return 'tagpro.players.*.' + item;
	}).join(' ');

	this.observe(keypaths, function(val, old, keypath) {
		if (val && !old) {
			this.set(keypath + 'Count', (this.get(keypath + 'Count') || 0) + 1);
		}
	});
}

function getPlayerStat(players, stat) {
	var val = 0;

	for (var key in players) {
		var player = players[key];
		val += player[stat] || 0;
	}

	return val;
}

function getTeamStats2(players) {
	var val = 0;

	var stat = 's-hold';
	var map = {};
	for (var key in players) {
		var player = players[key];
		val += player[stat] || 0;
	}
	map[stat] = val;

	return map;
}

function getTeamStats(players) {
	var all = Object.keys(stats.summables);
	var powerups = Object.keys(stats.powerupCounts);
	Array.prototype.push.apply(all, powerups);

	var map = {};

	all.forEach(function(stat) {
		var playerIds = Object.keys(players);
		map[stat] = playerIds.reduce(function(sum, id) {
			if (!players[id]) {
				return sum;
			}

			console.log(this);
			return sum + (players[id][stat] || 0);
		}, 0);
	}.bind(this));

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
	getSprite: getSprite,
	observePowerupCounts: observePowerupCounts,
	getTeamStats: getTeamStats,
	injectGlobalCss: injectGlobalCss,
	selectedStatistics: selectedStatistics
};