var Ractive = require('ractive');
var $ = require('jquery');

var movable = function(elem, options) {
	var opts = $.extend({
		move: true,
		moveHandle: '.move-handle',
		resize: true,
		resizeHandle: '.resize-handle'
	}, options);

	var $elem = $(elem);

	if (opts.resize) {
		$elem.on('mousedown', opts.resizeHandle, function(ev) {
			ev.preventDefault();

			var startPos = { left: ev.pageX, top: ev.pageY };
			var startWidth = $elem.width();
			var startHeight = $elem.height();

			function mouseDragged(ev) {
				var current = {
					x: ev.clientX - startPos.left,
					y: ev.clientY - startPos.top
				};

				$elem.width(startWidth - current.x);
				$elem.height(startHeight - current.y);
			}

			$(document).on('mouseup', function() {
				$(document).off('mousemove', mouseDragged);
			});

			$(document).on('mousemove', mouseDragged);
		});
	}

	if (opts.move) {
		$elem.on('mousedown', opts.moveHandle, function(ev) {
			ev.preventDefault();

			var startPos = { left: ev.pageX, top: ev.pageY };
			var startRight = parseInt($elem.css('right')) || 0;
			var startBottom = parseInt($elem.css('bottom')) || 0;

			function mouseDragged(ev) {
				var current = {
					x: ev.clientX - startPos.left,
					y: ev.clientY - startPos.top
				};

				$elem.css({
					right: startRight - current.x,
					bottom: startBottom - current.y
				});
			}

			$(document).on('mouseup', function() {
				$(document).off('mousemove', mouseDragged);
			});

			$(document).on('mousemove', mouseDragged);
		});
	}
	
	return {
		teardown: function() {
			if (opts.resize) {

			}

			if (opts.move) {
				
			}
		}
	};
};

module.exports = movable;