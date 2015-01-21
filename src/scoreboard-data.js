var helpers = require('./util/helpers');
var storage = require('./util/storage');

var opts = require('./scoreboard-options');
var stats = require('./stats');

var mouseMoveTimeout;
module.exports = {
	options: opts,  // Filled from scoreboard.oninit
	defaultOptions: opts,
	statsMap: stats.all,
	getSprite: helpers.getSprite,
	mouseMoved: false,
	mouseMoveHandler: function(ev) {
		this.set('mouseMoved', true);

		if (mouseMoveTimeout) {
			clearTimeout(mouseMoveTimeout);
		}

		mouseMoveTimeout = setTimeout(function() {
			this.set('mouseMoved', false);
		}.bind(this), 1000);
	}
};
