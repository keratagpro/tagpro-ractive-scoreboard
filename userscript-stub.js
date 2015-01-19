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