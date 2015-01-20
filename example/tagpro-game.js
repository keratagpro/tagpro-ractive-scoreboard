window.tagpro = {
	ready: function(done) { done(); },
	socket: { on: function() { } },
	players: {
		1: {
			name: 'Some Ball 1',
			team: 1,
			auth: true,
			flair: {
				x: 1,
				y: 1
			},
			flag: 1,
			grip: true,
			bomb: true,
			tagpro: true,
			's-hold': 78
		},
		2: {
			name: 'Some Ball 2',
			team: 2,
			dead: true,
			flair: {
				x: 0,
				y: 0
			},
			flag: 2
		},
		3: {
			name: 'Some Ball 3',
			team: 1
		},
		4: {
			name: 'Some Ball 4',
			team: 2
		}
	},
	tiles: {
		redball: { x: 14, y: 0 },
		blueball: { x: 15, y: 0 },
		yellowflag: { x: 13, y: 1 },
		redflag: { x: 14, y: 1 },
		blueflag: { x: 15, y: 1 },
		grip: { x: 12, y: 4 },
		bomb: { x: 12, y: 5 },
		tagpro: { x: 12, y: 6 }
	},
	ui: {
		update: function() { }
	},
	teamNames: {
		redTeamName: 'Red',
		blueTeamName: 'Blue'
	},
	score: {
		r: 0,
		b: 0
	}
};
