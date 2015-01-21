// ==UserScript==
// @name          TagPro Ractive
// @description   A base object that listens to the global tagpro object using Ractive's magic mode.
// @version       0.1
// @author        Kera
// @namespace     https://github.com/keratagpro
// @downloadUrl   https://keratagpro.github.io/tagpro-ractive/tagpro-ractive.user.js
// @updateUrl     https://keratagpro.github.io/tagpro-ractive/tagpro-ractive.meta.js
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @require       http://cdn.ractivejs.org/latest/ractive.min.js
// ==/UserScript==

tagpro.ready(function() {
	if (window.tagproRactive) {
		return;
	}

	window.tagproRactive = new Ractive({
		append: true,
		el: document.body,
		template: {'v':1,'t':[{'t':4,'r':'partialsList','f':[{'t':8,'r':'.'}]}]}, // {{#partialsList}}{{>.}}{{/partialsList}},
		magic: true,
		data: {
			partialsList: [],
			tagpro: tagpro
		},
		addComponent: function(component, name) {
			name = name || 'partial-' + this.componentCount++;
			this.components[name] = component;
			this.partials[name] = {'v':1,'t':[{'t':7,'e':name}]}; // '<${name} />';
			this.push('partialsList', name);
		}
	});

	console.log('TagPro Ractive initialized.');
});
