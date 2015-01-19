var tagpro = require('tagpro');

module.exports = {
	showOptions: false,
	showScoreboard: false,
	showScore: true,
	showTeams: true,
	showPlayers: true,
	showFlair: true,
	showPowerups: true,
	showAuth: true,
	showStatistics: true,
	selectedStatisticsKeys: ['s-hold', 'score', 'powerups'],
	backgroundColor: '#000',
	maxHeight: '50%',
	teamNames: {
		red: tagpro.teamNames.redTeamName,
		blue: tagpro.teamNames.blueTeamName
	},
	previousScores: {
		red: null,
		blue: null
	}
};