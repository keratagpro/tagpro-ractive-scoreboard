(function ( global, factory ) {
	'use strict';

	// Common JS (i.e. browserify) environment
	if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( require( 'ractive' ) );
	}

	// AMD?
	else if ( typeof define === 'function' && define.amd ) {
		define([ 'ractive' ], factory );
	}

	// browser global
	else if ( global.Ractive ) {
		factory( global.Ractive );
	}

	else {
		throw new Error( 'Could not find Ractive! It must be loaded before the ractive-transitions-slide plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

	'use strict';

	var slide, props, collapsed, defaults;

	defaults = {
		duration: 300,
		easing: 'easeInOut'
	};

	props = [
		'height',
		'borderTopWidth',
		'borderBottomWidth',
		'paddingTop',
		'paddingBottom',
		'marginTop',
		'marginBottom'
	];

	collapsed = {
		height: 0,
		borderTopWidth: 0,
		borderBottomWidth: 0,
		paddingTop: 0,
		paddingBottom: 0,
		marginTop: 0,
		marginBottom: 0
	};

	slide = function ( t, params ) {
		var targetStyle;

		params = t.processParams( params, defaults );

		if ( t.isIntro ) {
			targetStyle = t.getStyle( props );
			t.setStyle( collapsed );
		} else {
			// make style explicit, so we're not transitioning to 'auto'
			t.setStyle( t.getStyle( props ) );
			targetStyle = collapsed;
		}

		t.setStyle( 'overflowY', 'hidden' );

		t.animateStyle( targetStyle, params ).then( t.complete );
	};

	Ractive.transitions.slide = slide;

}));