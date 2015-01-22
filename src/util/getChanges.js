module.exports = function getChanges(prev, now) {
	var changes = {}, prop, pc;
	
	for (prop in now) {
		if (!prev || prev[prop] !== now[prop]) {
			if (Array.isArray(prev[prop]) && Array.isArray(now[prop])) {
				if (prev[prop].join(',') !== now[prop].join(',')) {
					changes[prop] = now[prop];
				}
			}
			else if (typeof now[prop] === 'object') {
				var c = getChanges(prev[prop], now[prop]);
				if(c) {
					changes[prop] = c;
				}
			} else {
				changes[prop] = now[prop];
			}
		}
	}

	for (prop in changes) {
		return changes;
	}

	return false; // false when unchanged
};