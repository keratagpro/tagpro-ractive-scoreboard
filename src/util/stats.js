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

var powerupCounts = {
	gripCount: { label: 'Grip', id: 'grip' },
	speedCount: { label: 'Speed', id: 'speed' },
	bombCount: { label: 'Rolling Bomb', id: 'bomb' },
	tagproCount: { label: 'Tagpro', id: 'tagpro' }
};

var all = $.extend(true, {}, summables, powerupCounts, {
	powerupCount: { label: 'Powerups' }
});

module.exports = {
	summables: summables,
	powerupCounts: powerupCounts,
	all: all
};