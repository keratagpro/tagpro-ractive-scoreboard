/* jshint ignore:start */
if (!window.GM_setValue) {
	window.GM_setValue = function(name, value) {
		return localStorage.setItem('kera-scoreboard-' + name, value);
	};
}

if (!window.GM_getValue) {
	window.GM_getValue = function(name) {
		return localStorage.getItem('kera-scoreboard-' + name);
	};
}

if (!window.GM_deleteValue) {
	window.GM_deleteValue = function(name) {
		return localStorage.deleteItem('kera-scoreboard-' + name);
	}
}
/* jshint ignore:end */