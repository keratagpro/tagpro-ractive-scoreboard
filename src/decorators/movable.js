var Ractive = require('ractive');
var $ = require('jquery');
require('jquery-ui/draggable');
require('jquery-ui/resizable');

var movable = function(elem, options) {
	var opts = options || {};

	opts.handleClass = options.handle || 'drag-handle';
	opts.callback = options.callback;

	return {
		teardown: function() {
			
		}
	};
};

module.exports = movable;