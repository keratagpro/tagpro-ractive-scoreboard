var summables = ['s-tags', 's-pops', 's-grabs', 's-returns', 's-captures', 's-drops', 's-support', 's-hold', 's-prevent', 'score', 'points', 'degree'];
var powerups = {
	grip: { label: 'Grip' },
	speed: { label: 'Speed' },
	bomb: { label: 'Rolling Bomb' },
	tagpro: { label: 'Tagpro' }
}

module.exports = function(ractive) {
	var keys = Object.keys(powerups);
	var keypath = keys.map(function(item) {
		return 'players.*.' + item;
	}).join(' ');

	ractive.observe(keypath, function(val, old, keypath) {
		if (val && !old) {
			ractive.set(keypath + 'Count', (ractive.get(keypath + 'Count') || 0) + 1);
		}
	});
};