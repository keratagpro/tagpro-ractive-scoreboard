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
	selectedStats: {
		's-hold': { label: 'Hold', time: true },
		'score': { label: 'Score' },
		'powerups': { label: 'Powerups' }
	},
	teamNames: {
		red: tagpro.teamNames.redTeamName,
		blue: tagpro.teamNames.blueTeamName
	},
	previousScores: {
		red: null,
		blue: null
	}
};