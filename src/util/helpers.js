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

			var val = this.get('tagpro.players.' + id + '.' + stat);
			return sum + (val || 0);
		}.bind(this), 0);
	}.bind(this));

	map.powerupCount = powerups.reduce(function(sum, key) {
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

module.exports = {
	getSprite: getSprite,
	observePowerupCounts: observePowerupCounts,
	getTeamStats: getTeamStats,
	injectGlobalCss: injectGlobalCss
};