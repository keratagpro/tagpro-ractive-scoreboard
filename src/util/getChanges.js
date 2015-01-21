module.exports = function getChanges(prev, now) {
	var changes = {}, prop, pc;
	
	for (prop in now) {
		if (!prev || prev[prop] !== now[prop]) {
			if (typeof now[prop] === 'object') {
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