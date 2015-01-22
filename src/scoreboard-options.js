var teamNames = tagpro.teamNames || {
	redTeamName: 'Red',
	blueTeamName: 'Blue'
};

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
	selectedStats: ['s-hold', 'score', 'powerupCount'],
	backgroundColor: '#000',
	maxHeight: '50%',
	teamNames: {
		red: teamNames.redTeamName,
		blue: teamNames.blueTeamName
	},
	previousScores: {
		red: null,
		blue: null
	}
};