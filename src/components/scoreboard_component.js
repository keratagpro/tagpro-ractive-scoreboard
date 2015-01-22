var Ractive = require('ractive');

var ScoreboardComponent = Ractive.extend({
	noCssTransform: true,
	css: require('./scoreboard_component.tmp.css'),
	template: require('./scoreboard_component.html'),
	data: {
		formatTime: function(sec) {
			var hours = parseInt(sec / 3600, 10) % 24;
			var minutes = parseInt(sec / 60, 10) % 60;
			var seconds = sec % 60;

			var result = (minutes < 10 ? '0' + minutes : minutes) + ':' +
				(seconds  < 10 ? '0' + seconds : seconds);

			if (hours > 0) {
				result = (hours < 10 ? '0' + hours : hours) + ':' + result;
			}

			return result;
		}
	},
	components: {
		'Player': require('./player_component')
	}
});

module.exports = ScoreboardComponent;