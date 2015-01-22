/* jshint ignore:start */
function getItem(name) {
	return GM_getValue(name);
}

function setItem(name, value) {
	GM_setValue(name, value);
}

function removeItem(name) {
	GM_deleteValue(name);
}

function getJson(name) {
	return JSON.parse(getItem(name) || null);
}

function setJson(name, value) {
	setItem(name, JSON.stringify(value));
}

module.exports = {
	getItem: getItem,
	setItem: setItem,
	getJson: getJson,
	setJson: setJson
};
/* jshint ignore:end */