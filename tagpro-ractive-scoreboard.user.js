// ==UserScript==
// @name          TagPro Scoreboard
// @description   Player/Team/Powerup/Score overview for TagPro, mainly for streamers.
// @version       0.3.0
// @author        Kera
// @grant         GM_getValue
// @grant         GM_setValue
// @require       https://cdn.ractivejs.org/latest/ractive.min.js
// @require       https://keratagpro.github.io/tagpro-ractive/tagpro-ractive.user.js
// @namespace     https://github.com/keratagpro
// @icon          http://keratagpro.github.io/tagpro-ractive-scoreboard/images/score.png
// @downloadUrl   https://keratagpro.github.io/tagpro-ractive-scoreboard/tagpro-ractive-scoreboard.user.js
// @updateUrl     https://keratagpro.github.io/tagpro-ractive-scoreboard/tagpro-ractive-scoreboard.meta.js
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
tagpro.ready(function() {
	tagproRactive.addComponent(require('./scoreboard'), 'Scoreboard');

	console.log('TagPro Scoreboard initialized.');
});
},{"./scoreboard":19}],2:[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"label","a":{"class":["checkbox ",{"t":2,"r":"class"}," ",{"t":2,"x":{"r":["value",".trueClass",".falseClass"],"s":"_0?_1:_2"}}]},"f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"value"}]}}," ",{"t":7,"e":"span","f":[{"t":2,"r":"label"}]}]}]}
},{}],3:[function(require,module,exports){
(function (global){
var Ractive = (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null);

var CheckboxComponent = Ractive.extend({
	isolated: true,
	template: require('./checkbox_component.html'),
	data: {
		trueClass: 'selected',
		falseClass: '',
		size: 'small'
	}
});

module.exports = CheckboxComponent;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./checkbox_component.html":2}],4:[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard-options"},"t0":{"n":"fly","a":[{"x":0,"y":-500,"opacity":1}]},"f":[{"t":7,"e":"a","a":{"href":"#","class":"close","title":"Close Options"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showOptions\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-small icon-close"}}]}," ",{"t":7,"e":"h3","a":{"class":"drag-handle"},"f":[{"t":7,"e":"span","a":{"class":"icon icon-score-green"}}," TagPro Scoreboard Options (",{"t":7,"e":"a","a":{"href":"https://github.com/keratagpro/tagpro-scoreboard","target":"_blank"},"f":["github"]},")"]}," ",{"t":7,"e":"div","a":{"class":"options-content"},"f":[{"t":7,"e":"form","a":{"class":"pure-form"},"f":[{"t":7,"e":"Checkbox","a":{"class":"pure-checkbox","label":"Show Scoreboard","value":[{"t":2,"r":"options.showScoreboard"}]}}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Team info"]}," ",{"t":7,"e":"Checkbox","a":{"label":"Score","value":[{"t":2,"r":"options.showScore"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Team names","value":[{"t":2,"r":"options.showTeams"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Players","value":[{"t":2,"r":"options.showPlayers"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Statistics","value":[{"t":2,"r":"options.showStatistics"}]}}]}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Player info"]}," ",{"t":7,"e":"Checkbox","a":{"label":"Powerups","value":[{"t":2,"r":"options.showPowerups"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Authentication","value":[{"t":2,"r":"options.showAuth"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Flair","value":[{"t":2,"r":"options.showFlair"}]}}]}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Statistics"]}," ",{"t":4,"r":"statsMap","i":"key","f":[{"t":7,"e":"Checkbox","a":{"label":[{"t":2,"r":".label"}],"value":[{"t":2,"r":".selected"}]}}]}]}," ",{"t":7,"e":"fieldset","a":{"class":"pure-form-stacked"},"f":[{"t":7,"e":"legend","f":["Other"]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"id":"name-red","label":"Red Team Name","value":[{"t":2,"r":"options.teamNames.red"}]}}," ",{"t":7,"e":"Textbox","a":{"id":"name-blue","label":"Blue Team Name","value":[{"t":2,"r":"options.teamNames.blue"}]}}]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"id":"score-red","label":"Red Team Score","value":[{"t":2,"r":"options.previousScores.red"}]}}," ",{"t":7,"e":"Textbox","a":{"id":"score-blue","label":"Blue Team Score","value":[{"t":2,"r":"options.previousScores.blue"}]}}]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"label":"Scoreboard Background Color","value":[{"t":2,"r":"options.backgroundColor"}]}}," ",{"t":7,"e":"Textbox","a":{"label":"Scoreboard Base Font Size","value":[{"t":2,"r":"options.fontSize"}]}}]}]}," ",{"t":7,"e":"a","a":{"href":"#"},"v":{"click":{"m":"storeOptions","a":{"r":[],"s":"[]"}}},"f":["Save Locally"]}," ",{"t":7,"e":"a","a":{"href":"#"},"v":{"click":{"m":"resetOptions","a":{"r":[],"s":"[]"}}},"f":["Reset"]}]}]}]}]}
},{}],5:[function(require,module,exports){
(function (global){

var Ractive = (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null);

var getChanges = require('../util/getChanges');
var storage = require('../util/storage');
var defaultOptions = require('../scoreboard-options');

function storeOptions() {
	var options = this.get('options');

	var changed = getChanges(defaultOptions, options) || null;

	if (changed && changed.showOptions) {
		delete changed.showOptions; // Don't store the Options window setting
	}

	console.log('Saved Settings: ', changed);
	storage.setJson('options', changed);
}

function resetOptions() {
	storage.removeItem('options');
	this.fire('resetOptions');
}

var OptionsComponent = Ractive.extend({
	noCssTransform: true,
	css: require('./options_component.tmp.css'),
	template: require('./options_component.html'),
	components: {
		'Textbox': require('./textbox_component'),
		'Checkbox': require('./checkbox_component')
	},
	storeOptions: storeOptions,
	resetOptions: resetOptions
});

module.exports = OptionsComponent;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../scoreboard-options":17,"../util/getChanges":21,"../util/storage":26,"./checkbox_component":3,"./options_component.html":4,"./options_component.tmp.css":6,"./textbox_component":14}],6:[function(require,module,exports){
module.exports = "#kera-scoreboard-options{border:3px solid #333;border-radius:3px;max-width:600px;max-height:90%;overflow:auto;color:#333;background-color:#eee;font-size:14px;margin:0 auto;position:absolute;left:0;right:0;z-index:10/*!\nPure v0.5.0\nCopyright 2014 Yahoo! Inc. All rights reserved.\nLicensed under the BSD License.\nhttps://github.com/yui/pure/blob/master/LICENSE.md\n*/}@media screen and (min-width:35.5em){#kera-scoreboard-options .pure-u-sm-1,#kera-scoreboard-options .pure-u-sm-1-1,#kera-scoreboard-options .pure-u-sm-1-12,#kera-scoreboard-options .pure-u-sm-1-2,#kera-scoreboard-options .pure-u-sm-1-24,#kera-scoreboard-options .pure-u-sm-1-3,#kera-scoreboard-options .pure-u-sm-1-4,#kera-scoreboard-options .pure-u-sm-1-5,#kera-scoreboard-options .pure-u-sm-1-6,#kera-scoreboard-options .pure-u-sm-1-8,#kera-scoreboard-options .pure-u-sm-10-24,#kera-scoreboard-options .pure-u-sm-11-12,#kera-scoreboard-options .pure-u-sm-11-24,#kera-scoreboard-options .pure-u-sm-12-24,#kera-scoreboard-options .pure-u-sm-13-24,#kera-scoreboard-options .pure-u-sm-14-24,#kera-scoreboard-options .pure-u-sm-15-24,#kera-scoreboard-options .pure-u-sm-16-24,#kera-scoreboard-options .pure-u-sm-17-24,#kera-scoreboard-options .pure-u-sm-18-24,#kera-scoreboard-options .pure-u-sm-19-24,#kera-scoreboard-options .pure-u-sm-2-24,#kera-scoreboard-options .pure-u-sm-2-3,#kera-scoreboard-options .pure-u-sm-2-5,#kera-scoreboard-options .pure-u-sm-20-24,#kera-scoreboard-options .pure-u-sm-21-24,#kera-scoreboard-options .pure-u-sm-22-24,#kera-scoreboard-options .pure-u-sm-23-24,#kera-scoreboard-options .pure-u-sm-24-24,#kera-scoreboard-options .pure-u-sm-3-24,#kera-scoreboard-options .pure-u-sm-3-4,#kera-scoreboard-options .pure-u-sm-3-5,#kera-scoreboard-options .pure-u-sm-3-8,#kera-scoreboard-options .pure-u-sm-4-24,#kera-scoreboard-options .pure-u-sm-4-5,#kera-scoreboard-options .pure-u-sm-5-12,#kera-scoreboard-options .pure-u-sm-5-24,#kera-scoreboard-options .pure-u-sm-5-5,#kera-scoreboard-options .pure-u-sm-5-6,#kera-scoreboard-options .pure-u-sm-5-8,#kera-scoreboard-options .pure-u-sm-6-24,#kera-scoreboard-options .pure-u-sm-7-12,#kera-scoreboard-options .pure-u-sm-7-24,#kera-scoreboard-options .pure-u-sm-7-8,#kera-scoreboard-options .pure-u-sm-8-24,#kera-scoreboard-options .pure-u-sm-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-sm-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-sm-1-12,#kera-scoreboard-options .pure-u-sm-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-sm-1-8,#kera-scoreboard-options .pure-u-sm-3-24{width:12.5%}#kera-scoreboard-options .pure-u-sm-1-6,#kera-scoreboard-options .pure-u-sm-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-sm-1-5{width:20%}#kera-scoreboard-options .pure-u-sm-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-sm-1-4,#kera-scoreboard-options .pure-u-sm-6-24{width:25%}#kera-scoreboard-options .pure-u-sm-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-sm-1-3,#kera-scoreboard-options .pure-u-sm-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-sm-3-8,#kera-scoreboard-options .pure-u-sm-9-24{width:37.5%}#kera-scoreboard-options .pure-u-sm-2-5{width:40%}#kera-scoreboard-options .pure-u-sm-10-24,#kera-scoreboard-options .pure-u-sm-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-sm-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-sm-1-2,#kera-scoreboard-options .pure-u-sm-12-24{width:50%}#kera-scoreboard-options .pure-u-sm-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-sm-14-24,#kera-scoreboard-options .pure-u-sm-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-sm-3-5{width:60%}#kera-scoreboard-options .pure-u-sm-15-24,#kera-scoreboard-options .pure-u-sm-5-8{width:62.5%}#kera-scoreboard-options .pure-u-sm-16-24,#kera-scoreboard-options .pure-u-sm-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-sm-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-sm-18-24,#kera-scoreboard-options .pure-u-sm-3-4{width:75%}#kera-scoreboard-options .pure-u-sm-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-sm-4-5{width:80%}#kera-scoreboard-options .pure-u-sm-20-24,#kera-scoreboard-options .pure-u-sm-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-sm-21-24,#kera-scoreboard-options .pure-u-sm-7-8{width:87.5%}#kera-scoreboard-options .pure-u-sm-11-12,#kera-scoreboard-options .pure-u-sm-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-sm-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-sm-1,#kera-scoreboard-options .pure-u-sm-1-1,#kera-scoreboard-options .pure-u-sm-24-24,#kera-scoreboard-options .pure-u-sm-5-5{width:100%}}@media screen and (min-width:48em){#kera-scoreboard-options .pure-u-md-1,#kera-scoreboard-options .pure-u-md-1-1,#kera-scoreboard-options .pure-u-md-1-12,#kera-scoreboard-options .pure-u-md-1-2,#kera-scoreboard-options .pure-u-md-1-24,#kera-scoreboard-options .pure-u-md-1-3,#kera-scoreboard-options .pure-u-md-1-4,#kera-scoreboard-options .pure-u-md-1-5,#kera-scoreboard-options .pure-u-md-1-6,#kera-scoreboard-options .pure-u-md-1-8,#kera-scoreboard-options .pure-u-md-10-24,#kera-scoreboard-options .pure-u-md-11-12,#kera-scoreboard-options .pure-u-md-11-24,#kera-scoreboard-options .pure-u-md-12-24,#kera-scoreboard-options .pure-u-md-13-24,#kera-scoreboard-options .pure-u-md-14-24,#kera-scoreboard-options .pure-u-md-15-24,#kera-scoreboard-options .pure-u-md-16-24,#kera-scoreboard-options .pure-u-md-17-24,#kera-scoreboard-options .pure-u-md-18-24,#kera-scoreboard-options .pure-u-md-19-24,#kera-scoreboard-options .pure-u-md-2-24,#kera-scoreboard-options .pure-u-md-2-3,#kera-scoreboard-options .pure-u-md-2-5,#kera-scoreboard-options .pure-u-md-20-24,#kera-scoreboard-options .pure-u-md-21-24,#kera-scoreboard-options .pure-u-md-22-24,#kera-scoreboard-options .pure-u-md-23-24,#kera-scoreboard-options .pure-u-md-24-24,#kera-scoreboard-options .pure-u-md-3-24,#kera-scoreboard-options .pure-u-md-3-4,#kera-scoreboard-options .pure-u-md-3-5,#kera-scoreboard-options .pure-u-md-3-8,#kera-scoreboard-options .pure-u-md-4-24,#kera-scoreboard-options .pure-u-md-4-5,#kera-scoreboard-options .pure-u-md-5-12,#kera-scoreboard-options .pure-u-md-5-24,#kera-scoreboard-options .pure-u-md-5-5,#kera-scoreboard-options .pure-u-md-5-6,#kera-scoreboard-options .pure-u-md-5-8,#kera-scoreboard-options .pure-u-md-6-24,#kera-scoreboard-options .pure-u-md-7-12,#kera-scoreboard-options .pure-u-md-7-24,#kera-scoreboard-options .pure-u-md-7-8,#kera-scoreboard-options .pure-u-md-8-24,#kera-scoreboard-options .pure-u-md-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-md-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-md-1-12,#kera-scoreboard-options .pure-u-md-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-md-1-8,#kera-scoreboard-options .pure-u-md-3-24{width:12.5%}#kera-scoreboard-options .pure-u-md-1-6,#kera-scoreboard-options .pure-u-md-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-md-1-5{width:20%}#kera-scoreboard-options .pure-u-md-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-md-1-4,#kera-scoreboard-options .pure-u-md-6-24{width:25%}#kera-scoreboard-options .pure-u-md-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-md-1-3,#kera-scoreboard-options .pure-u-md-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-md-3-8,#kera-scoreboard-options .pure-u-md-9-24{width:37.5%}#kera-scoreboard-options .pure-u-md-2-5{width:40%}#kera-scoreboard-options .pure-u-md-10-24,#kera-scoreboard-options .pure-u-md-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-md-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-md-1-2,#kera-scoreboard-options .pure-u-md-12-24{width:50%}#kera-scoreboard-options .pure-u-md-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-md-14-24,#kera-scoreboard-options .pure-u-md-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-md-3-5{width:60%}#kera-scoreboard-options .pure-u-md-15-24,#kera-scoreboard-options .pure-u-md-5-8{width:62.5%}#kera-scoreboard-options .pure-u-md-16-24,#kera-scoreboard-options .pure-u-md-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-md-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-md-18-24,#kera-scoreboard-options .pure-u-md-3-4{width:75%}#kera-scoreboard-options .pure-u-md-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-md-4-5{width:80%}#kera-scoreboard-options .pure-u-md-20-24,#kera-scoreboard-options .pure-u-md-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-md-21-24,#kera-scoreboard-options .pure-u-md-7-8{width:87.5%}#kera-scoreboard-options .pure-u-md-11-12,#kera-scoreboard-options .pure-u-md-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-md-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-md-1,#kera-scoreboard-options .pure-u-md-1-1,#kera-scoreboard-options .pure-u-md-24-24,#kera-scoreboard-options .pure-u-md-5-5{width:100%}}@media screen and (min-width:64em){#kera-scoreboard-options .pure-u-lg-1,#kera-scoreboard-options .pure-u-lg-1-1,#kera-scoreboard-options .pure-u-lg-1-12,#kera-scoreboard-options .pure-u-lg-1-2,#kera-scoreboard-options .pure-u-lg-1-24,#kera-scoreboard-options .pure-u-lg-1-3,#kera-scoreboard-options .pure-u-lg-1-4,#kera-scoreboard-options .pure-u-lg-1-5,#kera-scoreboard-options .pure-u-lg-1-6,#kera-scoreboard-options .pure-u-lg-1-8,#kera-scoreboard-options .pure-u-lg-10-24,#kera-scoreboard-options .pure-u-lg-11-12,#kera-scoreboard-options .pure-u-lg-11-24,#kera-scoreboard-options .pure-u-lg-12-24,#kera-scoreboard-options .pure-u-lg-13-24,#kera-scoreboard-options .pure-u-lg-14-24,#kera-scoreboard-options .pure-u-lg-15-24,#kera-scoreboard-options .pure-u-lg-16-24,#kera-scoreboard-options .pure-u-lg-17-24,#kera-scoreboard-options .pure-u-lg-18-24,#kera-scoreboard-options .pure-u-lg-19-24,#kera-scoreboard-options .pure-u-lg-2-24,#kera-scoreboard-options .pure-u-lg-2-3,#kera-scoreboard-options .pure-u-lg-2-5,#kera-scoreboard-options .pure-u-lg-20-24,#kera-scoreboard-options .pure-u-lg-21-24,#kera-scoreboard-options .pure-u-lg-22-24,#kera-scoreboard-options .pure-u-lg-23-24,#kera-scoreboard-options .pure-u-lg-24-24,#kera-scoreboard-options .pure-u-lg-3-24,#kera-scoreboard-options .pure-u-lg-3-4,#kera-scoreboard-options .pure-u-lg-3-5,#kera-scoreboard-options .pure-u-lg-3-8,#kera-scoreboard-options .pure-u-lg-4-24,#kera-scoreboard-options .pure-u-lg-4-5,#kera-scoreboard-options .pure-u-lg-5-12,#kera-scoreboard-options .pure-u-lg-5-24,#kera-scoreboard-options .pure-u-lg-5-5,#kera-scoreboard-options .pure-u-lg-5-6,#kera-scoreboard-options .pure-u-lg-5-8,#kera-scoreboard-options .pure-u-lg-6-24,#kera-scoreboard-options .pure-u-lg-7-12,#kera-scoreboard-options .pure-u-lg-7-24,#kera-scoreboard-options .pure-u-lg-7-8,#kera-scoreboard-options .pure-u-lg-8-24,#kera-scoreboard-options .pure-u-lg-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-lg-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-lg-1-12,#kera-scoreboard-options .pure-u-lg-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-lg-1-8,#kera-scoreboard-options .pure-u-lg-3-24{width:12.5%}#kera-scoreboard-options .pure-u-lg-1-6,#kera-scoreboard-options .pure-u-lg-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-lg-1-5{width:20%}#kera-scoreboard-options .pure-u-lg-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-lg-1-4,#kera-scoreboard-options .pure-u-lg-6-24{width:25%}#kera-scoreboard-options .pure-u-lg-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-lg-1-3,#kera-scoreboard-options .pure-u-lg-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-lg-3-8,#kera-scoreboard-options .pure-u-lg-9-24{width:37.5%}#kera-scoreboard-options .pure-u-lg-2-5{width:40%}#kera-scoreboard-options .pure-u-lg-10-24,#kera-scoreboard-options .pure-u-lg-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-lg-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-lg-1-2,#kera-scoreboard-options .pure-u-lg-12-24{width:50%}#kera-scoreboard-options .pure-u-lg-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-lg-14-24,#kera-scoreboard-options .pure-u-lg-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-lg-3-5{width:60%}#kera-scoreboard-options .pure-u-lg-15-24,#kera-scoreboard-options .pure-u-lg-5-8{width:62.5%}#kera-scoreboard-options .pure-u-lg-16-24,#kera-scoreboard-options .pure-u-lg-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-lg-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-lg-18-24,#kera-scoreboard-options .pure-u-lg-3-4{width:75%}#kera-scoreboard-options .pure-u-lg-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-lg-4-5{width:80%}#kera-scoreboard-options .pure-u-lg-20-24,#kera-scoreboard-options .pure-u-lg-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-lg-21-24,#kera-scoreboard-options .pure-u-lg-7-8{width:87.5%}#kera-scoreboard-options .pure-u-lg-11-12,#kera-scoreboard-options .pure-u-lg-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-lg-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-lg-1,#kera-scoreboard-options .pure-u-lg-1-1,#kera-scoreboard-options .pure-u-lg-24-24,#kera-scoreboard-options .pure-u-lg-5-5{width:100%}}@media screen and (min-width:80em){#kera-scoreboard-options .pure-u-xl-1,#kera-scoreboard-options .pure-u-xl-1-1,#kera-scoreboard-options .pure-u-xl-1-12,#kera-scoreboard-options .pure-u-xl-1-2,#kera-scoreboard-options .pure-u-xl-1-24,#kera-scoreboard-options .pure-u-xl-1-3,#kera-scoreboard-options .pure-u-xl-1-4,#kera-scoreboard-options .pure-u-xl-1-5,#kera-scoreboard-options .pure-u-xl-1-6,#kera-scoreboard-options .pure-u-xl-1-8,#kera-scoreboard-options .pure-u-xl-10-24,#kera-scoreboard-options .pure-u-xl-11-12,#kera-scoreboard-options .pure-u-xl-11-24,#kera-scoreboard-options .pure-u-xl-12-24,#kera-scoreboard-options .pure-u-xl-13-24,#kera-scoreboard-options .pure-u-xl-14-24,#kera-scoreboard-options .pure-u-xl-15-24,#kera-scoreboard-options .pure-u-xl-16-24,#kera-scoreboard-options .pure-u-xl-17-24,#kera-scoreboard-options .pure-u-xl-18-24,#kera-scoreboard-options .pure-u-xl-19-24,#kera-scoreboard-options .pure-u-xl-2-24,#kera-scoreboard-options .pure-u-xl-2-3,#kera-scoreboard-options .pure-u-xl-2-5,#kera-scoreboard-options .pure-u-xl-20-24,#kera-scoreboard-options .pure-u-xl-21-24,#kera-scoreboard-options .pure-u-xl-22-24,#kera-scoreboard-options .pure-u-xl-23-24,#kera-scoreboard-options .pure-u-xl-24-24,#kera-scoreboard-options .pure-u-xl-3-24,#kera-scoreboard-options .pure-u-xl-3-4,#kera-scoreboard-options .pure-u-xl-3-5,#kera-scoreboard-options .pure-u-xl-3-8,#kera-scoreboard-options .pure-u-xl-4-24,#kera-scoreboard-options .pure-u-xl-4-5,#kera-scoreboard-options .pure-u-xl-5-12,#kera-scoreboard-options .pure-u-xl-5-24,#kera-scoreboard-options .pure-u-xl-5-5,#kera-scoreboard-options .pure-u-xl-5-6,#kera-scoreboard-options .pure-u-xl-5-8,#kera-scoreboard-options .pure-u-xl-6-24,#kera-scoreboard-options .pure-u-xl-7-12,#kera-scoreboard-options .pure-u-xl-7-24,#kera-scoreboard-options .pure-u-xl-7-8,#kera-scoreboard-options .pure-u-xl-8-24,#kera-scoreboard-options .pure-u-xl-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-xl-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-xl-1-12,#kera-scoreboard-options .pure-u-xl-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-xl-1-8,#kera-scoreboard-options .pure-u-xl-3-24{width:12.5%}#kera-scoreboard-options .pure-u-xl-1-6,#kera-scoreboard-options .pure-u-xl-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-xl-1-5{width:20%}#kera-scoreboard-options .pure-u-xl-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-xl-1-4,#kera-scoreboard-options .pure-u-xl-6-24{width:25%}#kera-scoreboard-options .pure-u-xl-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-xl-1-3,#kera-scoreboard-options .pure-u-xl-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-xl-3-8,#kera-scoreboard-options .pure-u-xl-9-24{width:37.5%}#kera-scoreboard-options .pure-u-xl-2-5{width:40%}#kera-scoreboard-options .pure-u-xl-10-24,#kera-scoreboard-options .pure-u-xl-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-xl-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-xl-1-2,#kera-scoreboard-options .pure-u-xl-12-24{width:50%}#kera-scoreboard-options .pure-u-xl-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-xl-14-24,#kera-scoreboard-options .pure-u-xl-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-xl-3-5{width:60%}#kera-scoreboard-options .pure-u-xl-15-24,#kera-scoreboard-options .pure-u-xl-5-8{width:62.5%}#kera-scoreboard-options .pure-u-xl-16-24,#kera-scoreboard-options .pure-u-xl-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-xl-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-xl-18-24,#kera-scoreboard-options .pure-u-xl-3-4{width:75%}#kera-scoreboard-options .pure-u-xl-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-xl-4-5{width:80%}#kera-scoreboard-options .pure-u-xl-20-24,#kera-scoreboard-options .pure-u-xl-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-xl-21-24,#kera-scoreboard-options .pure-u-xl-7-8{width:87.5%}#kera-scoreboard-options .pure-u-xl-11-12,#kera-scoreboard-options .pure-u-xl-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-xl-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-xl-1,#kera-scoreboard-options .pure-u-xl-1-1,#kera-scoreboard-options .pure-u-xl-24-24,#kera-scoreboard-options .pure-u-xl-5-5{width:100%}}#kera-scoreboard-options .pure-form input:not([type]),#kera-scoreboard-options .pure-form input[type=text],#kera-scoreboard-options .pure-form input[type=number],#kera-scoreboard-options .pure-form input[type=search],#kera-scoreboard-options .pure-form input[type=tel],#kera-scoreboard-options .pure-form input[type=color],#kera-scoreboard-options .pure-form input[type=password],#kera-scoreboard-options .pure-form input[type=email],#kera-scoreboard-options .pure-form input[type=url],#kera-scoreboard-options .pure-form input[type=date],#kera-scoreboard-options .pure-form input[type=month],#kera-scoreboard-options .pure-form input[type=time],#kera-scoreboard-options .pure-form input[type=datetime],#kera-scoreboard-options .pure-form input[type=datetime-local],#kera-scoreboard-options .pure-form input[type=week],#kera-scoreboard-options .pure-form select,#kera-scoreboard-options .pure-form textarea{padding:.5em .6em;display:inline-block;border:1px solid #ccc;box-shadow:inset 0 1px 3px #ddd;border-radius:4px;box-sizing:border-box}#kera-scoreboard-options .pure-form input[type=color]{padding:.2em .5em}#kera-scoreboard-options .pure-form input:not([type]):focus,#kera-scoreboard-options .pure-form input[type=text]:focus,#kera-scoreboard-options .pure-form input[type=number]:focus,#kera-scoreboard-options .pure-form input[type=search]:focus,#kera-scoreboard-options .pure-form input[type=tel]:focus,#kera-scoreboard-options .pure-form input[type=color]:focus,#kera-scoreboard-options .pure-form input[type=password]:focus,#kera-scoreboard-options .pure-form input[type=email]:focus,#kera-scoreboard-options .pure-form input[type=url]:focus,#kera-scoreboard-options .pure-form input[type=date]:focus,#kera-scoreboard-options .pure-form input[type=month]:focus,#kera-scoreboard-options .pure-form input[type=time]:focus,#kera-scoreboard-options .pure-form input[type=datetime]:focus,#kera-scoreboard-options .pure-form input[type=datetime-local]:focus,#kera-scoreboard-options .pure-form input[type=week]:focus,#kera-scoreboard-options .pure-form select:focus,#kera-scoreboard-options .pure-form textarea:focus{outline:0;border-color:#129FEA}#kera-scoreboard-options .pure-form input[type=file]:focus,#kera-scoreboard-options .pure-form input[type=radio]:focus,#kera-scoreboard-options .pure-form input[type=checkbox]:focus{outline:#129FEA auto 1px}#kera-scoreboard-options .pure-form .pure-checkbox,#kera-scoreboard-options .pure-form .pure-radio{margin:.5em 0;display:block}#kera-scoreboard-options .pure-form input:not([type])[disabled],#kera-scoreboard-options .pure-form input[type=text][disabled],#kera-scoreboard-options .pure-form input[type=number][disabled],#kera-scoreboard-options .pure-form input[type=search][disabled],#kera-scoreboard-options .pure-form input[type=tel][disabled],#kera-scoreboard-options .pure-form input[type=color][disabled],#kera-scoreboard-options .pure-form input[type=password][disabled],#kera-scoreboard-options .pure-form input[type=email][disabled],#kera-scoreboard-options .pure-form input[type=url][disabled],#kera-scoreboard-options .pure-form input[type=date][disabled],#kera-scoreboard-options .pure-form input[type=month][disabled],#kera-scoreboard-options .pure-form input[type=time][disabled],#kera-scoreboard-options .pure-form input[type=datetime][disabled],#kera-scoreboard-options .pure-form input[type=datetime-local][disabled],#kera-scoreboard-options .pure-form input[type=week][disabled],#kera-scoreboard-options .pure-form select[disabled],#kera-scoreboard-options .pure-form textarea[disabled]{cursor:not-allowed;background-color:#eaeded;color:#cad2d3}#kera-scoreboard-options .pure-form input[readonly],#kera-scoreboard-options .pure-form select[readonly],#kera-scoreboard-options .pure-form textarea[readonly]{background:#eee;color:#777;border-color:#ccc}#kera-scoreboard-options .pure-form input:focus:invalid,#kera-scoreboard-options .pure-form select:focus:invalid,#kera-scoreboard-options .pure-form textarea:focus:invalid{color:#b94a48;border-color:#ee5f5b}#kera-scoreboard-options .pure-form input:focus:invalid:focus,#kera-scoreboard-options .pure-form select:focus:invalid:focus,#kera-scoreboard-options .pure-form textarea:focus:invalid:focus{border-color:#e9322d}#kera-scoreboard-options .pure-form input[type=file]:focus:invalid:focus,#kera-scoreboard-options .pure-form input[type=radio]:focus:invalid:focus,#kera-scoreboard-options .pure-form input[type=checkbox]:focus:invalid:focus{outline-color:#e9322d}#kera-scoreboard-options .pure-form select{border:1px solid #ccc;background-color:#fff}#kera-scoreboard-options .pure-form select[multiple]{height:auto}#kera-scoreboard-options .pure-form label{margin:.5em 0 .2em}#kera-scoreboard-options .pure-form fieldset{margin:0;padding:.35em 0 .75em;border:0}#kera-scoreboard-options .pure-form legend{display:block;width:100%;padding:.3em 0;margin-bottom:.3em;color:#333;border-bottom:1px solid #e5e5e5}#kera-scoreboard-options .pure-form-stacked input:not([type]),#kera-scoreboard-options .pure-form-stacked input[type=text],#kera-scoreboard-options .pure-form-stacked input[type=number],#kera-scoreboard-options .pure-form-stacked input[type=search],#kera-scoreboard-options .pure-form-stacked input[type=tel],#kera-scoreboard-options .pure-form-stacked input[type=color],#kera-scoreboard-options .pure-form-stacked input[type=password],#kera-scoreboard-options .pure-form-stacked input[type=email],#kera-scoreboard-options .pure-form-stacked input[type=url],#kera-scoreboard-options .pure-form-stacked input[type=date],#kera-scoreboard-options .pure-form-stacked input[type=month],#kera-scoreboard-options .pure-form-stacked input[type=time],#kera-scoreboard-options .pure-form-stacked input[type=datetime],#kera-scoreboard-options .pure-form-stacked input[type=datetime-local],#kera-scoreboard-options .pure-form-stacked input[type=week],#kera-scoreboard-options .pure-form-stacked label,#kera-scoreboard-options .pure-form-stacked select,#kera-scoreboard-options .pure-form-stacked textarea{display:block;margin:.25em 0}#kera-scoreboard-options .pure-form-aligned .pure-help-inline,#kera-scoreboard-options .pure-form-aligned input,#kera-scoreboard-options .pure-form-aligned select,#kera-scoreboard-options .pure-form-aligned textarea,#kera-scoreboard-options .pure-form-message-inline{display:inline-block;vertical-align:middle}#kera-scoreboard-options .pure-form-aligned textarea{vertical-align:top}#kera-scoreboard-options .pure-form-aligned .pure-control-group{margin-bottom:.5em}#kera-scoreboard-options .pure-form-aligned .pure-control-group label{text-align:right;display:inline-block;vertical-align:middle;width:10em;margin:0 1em 0 0}#kera-scoreboard-options .pure-form-aligned .pure-controls{margin:1.5em 0 0 10em}#kera-scoreboard-options .pure-form .pure-input-rounded,#kera-scoreboard-options .pure-form input.pure-input-rounded{border-radius:2em;padding:.5em 1em}#kera-scoreboard-options .pure-form .pure-group fieldset{margin-bottom:10px}#kera-scoreboard-options .pure-form .pure-group input{display:block;padding:10px;margin:0;border-radius:0;position:relative;top:-1px}#kera-scoreboard-options .pure-form .pure-group input:focus{z-index:2}#kera-scoreboard-options .pure-form .pure-group input:first-child{top:1px;border-radius:4px 4px 0 0}#kera-scoreboard-options .pure-form .pure-group input:last-child{top:-2px;border-radius:0 0 4px 4px}#kera-scoreboard-options .pure-form .pure-group button{margin:.35em 0}#kera-scoreboard-options .pure-form .pure-input-1{width:100%}#kera-scoreboard-options .pure-form .pure-input-2-3{width:66%}#kera-scoreboard-options .pure-form .pure-input-1-2{width:50%}#kera-scoreboard-options .pure-form .pure-input-1-3{width:33%}#kera-scoreboard-options .pure-form .pure-input-1-4{width:25%}#kera-scoreboard-options .pure-form .pure-help-inline,#kera-scoreboard-options .pure-form-message-inline{display:inline-block;padding-left:.3em;color:#666;vertical-align:middle;font-size:.875em}#kera-scoreboard-options .pure-form-message{display:block;color:#666;font-size:.875em}@media only screen and (max-width:480px){#kera-scoreboard-options .pure-form button[type=submit]{margin:.7em 0 0}#kera-scoreboard-options .pure-form input:not([type]),#kera-scoreboard-options .pure-form input[type=text],#kera-scoreboard-options .pure-form input[type=number],#kera-scoreboard-options .pure-form input[type=search],#kera-scoreboard-options .pure-form input[type=tel],#kera-scoreboard-options .pure-form input[type=color],#kera-scoreboard-options .pure-form input[type=password],#kera-scoreboard-options .pure-form input[type=email],#kera-scoreboard-options .pure-form input[type=url],#kera-scoreboard-options .pure-form input[type=date],#kera-scoreboard-options .pure-form input[type=month],#kera-scoreboard-options .pure-form input[type=time],#kera-scoreboard-options .pure-form input[type=datetime],#kera-scoreboard-options .pure-form input[type=datetime-local],#kera-scoreboard-options .pure-form input[type=week],#kera-scoreboard-options .pure-form label{margin-bottom:.3em;display:block}#kera-scoreboard-options .pure-group input:not([type]),#kera-scoreboard-options .pure-group input[type=text],#kera-scoreboard-options .pure-group input[type=number],#kera-scoreboard-options .pure-group input[type=search],#kera-scoreboard-options .pure-group input[type=tel],#kera-scoreboard-options .pure-group input[type=color],#kera-scoreboard-options .pure-group input[type=password],#kera-scoreboard-options .pure-group input[type=email],#kera-scoreboard-options .pure-group input[type=url],#kera-scoreboard-options .pure-group input[type=date],#kera-scoreboard-options .pure-group input[type=month],#kera-scoreboard-options .pure-group input[type=time],#kera-scoreboard-options .pure-group input[type=datetime],#kera-scoreboard-options .pure-group input[type=datetime-local],#kera-scoreboard-options .pure-group input[type=week]{margin-bottom:0}#kera-scoreboard-options .pure-form-aligned .pure-control-group label{margin-bottom:.3em;text-align:left;display:block;width:100%}#kera-scoreboard-options .pure-form-aligned .pure-controls{margin:1.5em 0 0}#kera-scoreboard-options .pure-form .pure-help-inline,#kera-scoreboard-options .pure-form-message,#kera-scoreboard-options .pure-form-message-inline{display:block;font-size:.75em;padding:.2em 0 .8em}}#kera-scoreboard-options .pure-g{letter-spacing:-.31em;word-spacing:-.43em;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;font-family:FreeSans,Arimo,\"Droid Sans\",Helvetica,Arial,sans-serif}#kera-scoreboard-options .pure-g [class*=pure-u]{font-family:sans-serif}#kera-scoreboard-options .pure-g [class*=pure-u] input[type=text]{width:90%}#kera-scoreboard-options h3{font-size:18px;margin:0;padding:4px 8px;border-bottom:1px solid #333;text-align:left}#kera-scoreboard-options h3 .icon{margin-right:5px}#kera-scoreboard-options h3 a{display:inline!important;font-size:inherit!important;color:green;text-decoration:none}#kera-scoreboard-options h3 a:hover{text-decoration:underline}#kera-scoreboard-options h4{font-size:16px;margin:0 0 5px;padding:15px 0 3px;border-bottom:1px solid #ccc}#kera-scoreboard-options .icon{vertical-align:middle}#kera-scoreboard-options .options-content{padding:10px}#kera-scoreboard-options .options-content a{background-color:#e7e7e7;border-radius:3px;display:inline-block;padding:10px;text-decoration:none;color:#333;-webkit-transition:background-color .3s;transition:background-color .3s}#kera-scoreboard-options .options-content a:hover{background-color:#b9b9b9}#kera-scoreboard-options .hide{display:none!important;visibility:hidden}#kera-scoreboard-options .close{text-decoration:none;padding:10px;position:absolute;right:0;top:0}#kera-scoreboard-options label.checkbox{display:inline-block}"
},{}],7:[function(require,module,exports){
module.exports={"v":1,"t":[{"t":4,"n":53,"r":"data","f":[{"t":7,"e":"span","a":{"class":"icons"},"f":[{"t":4,"n":50,"r":"flag","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getFlag","flag"],"s":"_0(_1)"}},";"]}}]}," ",{"t":4,"n":50,"r":"options.showPowerups","f":[{"t":4,"n":50,"r":".grip","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"grip\")"}},";"]}}]}," ",{"t":4,"n":50,"r":".bomb","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"bomb\")"}},";"]}}]}," ",{"t":4,"n":50,"r":".tagpro","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"tagpro\")"}},";"]}}]}]}]}," ",{"t":4,"n":50,"r":"options.showFlair","f":[{"t":7,"e":"span","a":{"class":"flair sprite-flair","style":["background-position: ",{"t":2,"x":{"r":["getFlair","flair"],"s":"_0(_1)"}}]}}]}," ",{"t":7,"e":"span","a":{"class":["name ",{"t":2,"x":{"r":["dead"],"s":"_0?\"dead\":\"\""}}," ",{"t":2,"x":{"r":["options.showAuth","auth"],"s":"_0&&_1?\"auth\":\"\""}}],"title":[{"t":2,"r":"degree"}]},"f":[{"t":2,"r":"name"}]}," ",{"t":4,"n":50,"r":"options.showDegree","f":[{"t":7,"e":"span","a":{"class":"degree"},"f":["(",{"t":2,"r":"degree"},"°)"]}]}]}]}
},{}],8:[function(require,module,exports){
(function (global){
var Ractive = (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null);

var helpers = require('../util/helpers');

var PlayerComponent = Ractive.extend({
	isolated: true,
	noCssTransform: true,
	css: require('./player_component.tmp.css'),
	template: require('./player_component.html'),
	data: {
		getSprite: helpers.getSprite,
		getFlag: function(flag) {
			return helpers.getSprite(flag === 1 ? 'redflag' : flag === 2 ? 'blueflag' : 'yellowflag');
		},
		getFlair: function(flair) {
			var x = flair ? flair.x : 10;
			var y = flair ? flair.y : 10;
			var width = 16;
			var height = 16;
			var position = (-x * width) + 'px ' + (-y * height) + 'px';
			return position;
		}
	}
});

module.exports = PlayerComponent;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../util/helpers":22,"./player_component.html":7,"./player_component.tmp.css":9}],9:[function(require,module,exports){
module.exports = "#kera-scoreboard .player-row .icons{position:absolute;font-size:0}#kera-scoreboard .player-row .dead{color:red!important}#kera-scoreboard .player-row .auth{color:#bfff00}#kera-scoreboard .player-row .name{padding:0 3px}#kera-scoreboard .player-row .red .icons{left:3px}#kera-scoreboard .player-row .red .flair{float:right;margin-left:4px}#kera-scoreboard .player-row .blue .icons{right:3px}#kera-scoreboard .player-row .blue .flair{float:left;margin-right:4px}"
},{}],10:[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard","style":["background-color: ",{"t":2,"r":"options.backgroundColor"},"; font-size: ",{"t":2,"r":"options.fontSize"},";"]},"t0":{"n":"fly","a":[{"x":0,"y":500}]},"o":"movable","f":[{"t":7,"e":"div","a":{"class":"tools tools-left"},"f":[{"t":7,"e":"span","a":{"class":"resize-handle icon icon-resize-white"}}," ",{"t":7,"e":"span","a":{"class":"move-handle icon icon-move-white"}}]}," ",{"t":7,"e":"div","a":{"class":"tools tools-right"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"settings","title":"Settings"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showOptions\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-gear-white"}}]}," ",{"t":7,"e":"a","a":{"href":"#","class":"close","title":"Close Scoreboard"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showScoreboard\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-close-white"}}]}]}," ",{"t":4,"n":50,"x":{"r":["options.showScore","options.showTeams"],"s":"_0||_1"},"f":[{"t":4,"n":50,"x":{"r":["options.previousScores.red","options.previousScores.blue"],"s":"_0||_1"},"f":[{"t":7,"e":"div","a":{"class":"score-previous"},"f":[{"t":2,"x":{"r":["options.previousScores.red","score.r"],"s":"(parseInt(_0)||0)+_1"}}," - ",{"t":2,"x":{"r":["options.previousScores.blue","score.b"],"s":"(parseInt(_0)||0)+_1"}}]}]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"thead","f":[{"t":4,"n":50,"r":"options.showScore","f":[{"t":7,"e":"tr","a":{"class":"score-row"},"f":[{"t":7,"e":"th","a":{"class":"red"},"f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-large","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"redball\")"}},";"]}}," ",{"t":7,"e":"span","a":{"class":"score"},"f":[{"t":2,"x":{"r":["score.r"],"s":"_0||0"}}]}]}," ",{"t":7,"e":"th","a":{"class":"separator"},"f":["-"]}," ",{"t":7,"e":"th","a":{"class":"blue"},"f":[{"t":7,"e":"span","a":{"class":"score"},"f":[{"t":2,"x":{"r":["score.b"],"s":"_0||0"}}]}," ",{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-large","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"blueball\")"}},";"]}}]}]}]}," ",{"t":4,"n":50,"r":"options.showTeams","f":[{"t":7,"e":"tr","a":{"class":"team-name-row"},"f":[{"t":7,"e":"td","a":{"class":"team red"},"f":[{"t":2,"r":"options.teamNames.red"}]}," ",{"t":7,"e":"td","a":{"class":"separator"},"f":["vs"]}," ",{"t":7,"e":"td","a":{"class":"team blue"},"f":[{"t":2,"r":"options.teamNames.blue"}]}]}]}]}]}]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tbody","f":[{"t":4,"n":50,"r":"options.showPlayers","f":[{"t":7,"e":"tr","a":{"class":"player-row"},"f":[{"t":7,"e":"td","a":{"class":"player red"},"f":[{"t":4,"r":"redPlayers","i":"id","f":[{"t":7,"e":"p","f":[{"t":7,"e":"Player","a":{"data":[{"t":2,"r":"."}],"options":[{"t":2,"r":"options"}]}}]}]}]}," ",{"t":7,"e":"td","a":{"class":"separator"}}," ",{"t":7,"e":"td","a":{"class":"player blue"},"f":[{"t":4,"r":"bluePlayers","i":"id","f":[{"t":7,"e":"p","f":[{"t":7,"e":"Player","a":{"data":[{"t":2,"r":"."}],"options":[{"t":2,"r":"options"}]}}]}]}]}]}]}]}]}," ",{"t":4,"n":50,"x":{"r":["options.showStatistics","selectedStatsMap"],"s":"_0&&_1"},"f":[{"t":7,"e":"h3","f":["Team Statistics"]}," ",{"t":7,"e":"table","a":{"class":"team-statistics"},"f":[{"t":7,"e":"tbody","f":[{"t":4,"r":"selectedStatsMap","i":"key","f":[{"t":7,"e":"tr","a":{"class":[{"t":2,"r":"key"}]},"f":[{"t":7,"e":"td","a":{"class":"label"},"f":[{"t":2,"r":"label"}]}," ",{"t":7,"e":"td","a":{"class":"red"},"f":[{"t":2,"x":{"r":["time","formatTime","key","redTeamStats"],"s":"_0?_1(_3[_2]):_3[_2]"}}]}," ",{"t":7,"e":"td","a":{"class":"blue"},"f":[{"t":2,"x":{"r":["time","formatTime","key","blueTeamStats"],"s":"_0?_1(_3[_2]):_3[_2]"}}]}]}]}]}]}]}]}]}
},{}],11:[function(require,module,exports){
(function (global){
var Ractive = (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./player_component":8,"./scoreboard_component.html":10,"./scoreboard_component.tmp.css":12}],12:[function(require,module,exports){
module.exports = "#kera-scoreboard{position:absolute;right:0;bottom:0;z-index:2;overflow-y:auto;width:400px;border-radius:5px;border:3px solid #ccc;color:#fff}#kera-scoreboard h3{margin:10px 5px 0;font-weight:400;font-size:100%;text-align:center}#kera-scoreboard .tools{position:absolute;top:0;font-size:0;border-bottom:3px solid #ccc;border-radius:0 0 5px 5px;opacity:0;-webkit-transition:opacity 1s;transition:opacity 1s}#kera-scoreboard .tools a{padding:5px;color:#fff;text-decoration:none;display:inline-block}#kera-scoreboard .tools.tools-left{left:0;border-right:3px solid #ccc}#kera-scoreboard .tools.tools-left .resize-handle{cursor:nw-resize}#kera-scoreboard .tools.tools-left .move-handle{cursor:move}#kera-scoreboard .tools.tools-right{border-left:3px solid #ccc;right:0}#kera-scoreboard .tools .icon{vertical-align:bottom}#kera-scoreboard:hover .tools{opacity:1}#kera-scoreboard .sprite-tiles{background-image:url(images/tiles.png);display:inline-block;width:40px;height:40px;zoom:.5}#kera-scoreboard .sprite-flair{background-image:url(images/flair.png);display:inline-block;width:16px;height:16px;vertical-align:middle}#kera-scoreboard .sprite-large{zoom:1}#kera-scoreboard .score-previous{position:absolute;top:15px;right:15px;font-size:120%;color:#888}#kera-scoreboard .team-statistics{font-size:90%;padding:5px}#kera-scoreboard .team-statistics td{padding:5px;border-top:1px solid #ccc}#kera-scoreboard .team-statistics .label{width:30%;white-space:nowrap}#kera-scoreboard .team-statistics .red{text-align:right;width:20%}#kera-scoreboard .team-statistics .blue{width:50%}#kera-scoreboard table{margin-bottom:0;border-spacing:0;width:100%}#kera-scoreboard table th{font-weight:400;text-align:left;padding:3px}#kera-scoreboard table tr{padding:3px 2px}#kera-scoreboard table thead td.separator,#kera-scoreboard table thead th.separator{padding:5px;text-align:center}#kera-scoreboard table thead td.blue,#kera-scoreboard table thead td.red,#kera-scoreboard table thead th.blue,#kera-scoreboard table thead th.red{width:50%}#kera-scoreboard table .score-row{font-size:250%;line-height:1}#kera-scoreboard table .score-row .sprite-tiles{vertical-align:bottom}#kera-scoreboard table .score-row th{padding:3px;border-bottom:1px solid #ccc}#kera-scoreboard table .team-name-row td{border-bottom:1px solid #ccc}#kera-scoreboard table .player-row p{margin:5px 0}#kera-scoreboard table .player-row .red,#kera-scoreboard table .score-row .red,#kera-scoreboard table .team-name-row .red{text-align:right;width:50%}"
},{}],13:[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"class":[{"t":2,"r":"class"}]},"f":[{"t":7,"e":"label","a":{"class":"text","for":["kera-checkbox-",{"t":2,"r":"id"}]},"f":[{"t":2,"r":"label"}]}," ",{"t":7,"e":"input","a":{"id":["kera-checkbox-",{"t":2,"r":"id"}],"type":"text","value":[{"t":2,"r":"value"}]}}]}]}
},{}],14:[function(require,module,exports){
(function (global){
var Ractive = (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null);

var TextboxComponent = Ractive.extend({
	isolated: true,
	template: require('./textbox_component.html'),
	data: {
		class: 'pure-u-sm-1-2'
	}
});

module.exports = TextboxComponent;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./textbox_component.html":13}],15:[function(require,module,exports){
(function (global){
var Ractive = (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null);
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
var helpers = require('./util/helpers');
var storage = require('./util/storage');

var opts = require('./scoreboard-options');
var stats = require('./util/stats');

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

},{"./scoreboard-options":17,"./util/helpers":22,"./util/stats":25,"./util/storage":26}],17:[function(require,module,exports){
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
	fontSize: '16px',
	teamNames: {
		red: teamNames.redTeamName,
		blue: teamNames.blueTeamName
	},
	previousScores: {
		red: null,
		blue: null
	}
};
},{}],18:[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard-container"},"f":[{"t":4,"n":50,"r":"options.showScoreboard","f":[{"t":7,"e":"Scoreboard"}]}," ",{"t":4,"n":50,"r":"options.showOptions","f":[{"t":7,"e":"Options"}]}," ",{"t":7,"e":"label","a":{"class":["options-toggle ",{"t":2,"x":{"r":["mouseMoved"],"s":"_0?\"\":\"hidden\""}}]},"f":[{"t":7,"e":"input","a":{"type":"checkbox","class":"hide","checked":[{"t":2,"r":"options.showScoreboard"}]}}," ",{"t":7,"e":"span","a":{"class":"icon icon-score-green"}}]}]}]}
},{}],19:[function(require,module,exports){
var defaultOptions = require('./scoreboard-options');
var filter = require('./util/object/filter');
var storage = require('./util/storage');
require('./util/ractive-transitions-fly');

var helpers = require('./util/helpers');

// Ractive.defaults.noCssTransform = true; // TODO: Doesn't seem to work?
Ractive.decorators.movable = require('./decorators/movable');

var scoreboard = Ractive.extend({
	debug: true,
	template: require('./scoreboard.html'),
	data: require('./scoreboard-data'),
	computed: {
		redPlayers: function() {
			return this.getPlayersByTeam(1);
		},
		bluePlayers: function() {
			return this.getPlayersByTeam(2);
		},
		redTeamStats: function() {
			var players = this.get('redPlayers');
			return helpers.getTeamStats.call(this, players);
		},
		blueTeamStats: function() {
			return helpers.getTeamStats.call(this, this.get('bluePlayers'));
		},
		selectedStatsMap: function() {
			return filter(this.get('statsMap'), function(stat) {
				return stat.selected;
			});
		},
		'options.selectedStats': {
			get: function() {
				return Object.keys(this.get('selectedStatsMap'));
			},
			set: function(keys) {
				keys.forEach(function(stat) {
					this.set('statsMap.' + stat + '.selected', true);
				}.bind(this));
			}
		}
	},
	components: {
		'Options': require('./components/options_component'),
		'Scoreboard': require('./components/scoreboard_component')
	},
	getPlayersByTeam: function(team) {
		return filter(this.get('tagpro.players'), function(player) {
			return player.team === team;
		});
	},
	loadOptions: function() {
		this.set('options', $.extend(true, {}, defaultOptions, storage.getJson('options')));
	},
	onrender: function() {
		this.loadOptions();

		this.on('Options.resetOptions', this.loadOptions);

		helpers.observePowerupCounts.call(this);
		
		helpers.injectGlobalCss(require('./scoreboard.tmp.css'));

		window.addEventListener('mousemove', this.get('mouseMoveHandler').bind(this));
	}
});

module.exports = scoreboard;
},{"./components/options_component":5,"./components/scoreboard_component":11,"./decorators/movable":15,"./scoreboard-data":16,"./scoreboard-options":17,"./scoreboard.html":18,"./scoreboard.tmp.css":20,"./util/helpers":22,"./util/object/filter":23,"./util/ractive-transitions-fly":24,"./util/storage":26}],20:[function(require,module,exports){
module.exports = "#kera-scoreboard-container .icon{background-image:url(data:image/png;base64,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)}#kera-scoreboard-container .icon-move{background-position:-5px -5px;width:32px;height:32px}#kera-scoreboard-container .icon-close-white{background-position:-5px -47px;width:32px;height:32px}#kera-scoreboard-container .icon-gear-white{background-position:-5px -89px;width:32px;height:32px}#kera-scoreboard-container .icon-gear{background-position:-5px -131px;width:32px;height:32px}#kera-scoreboard-container .icon-move-white{background-position:-5px -173px;width:32px;height:32px}#kera-scoreboard-container .icon-close{background-position:-5px -215px;width:32px;height:32px}#kera-scoreboard-container .icon-resize-white{background-position:-5px -257px;width:32px;height:32px}#kera-scoreboard-container .icon-resize{background-position:-5px -299px;width:32px;height:32px}#kera-scoreboard-container .icon-score-green{background-position:-5px -341px;width:32px;height:32px}#kera-scoreboard-container .icon-score-white{background-position:-5px -383px;width:32px;height:32px}#kera-scoreboard-container .icon-score{background-position:-5px -425px;width:32px;height:32px}#kera-scoreboard-container .icon{display:inline-block}#kera-scoreboard-container .icon-small{zoom:.5}#kera-scoreboard-container .options-toggle{padding:3px;cursor:pointer;position:absolute;right:0;bottom:0;z-index:3;opacity:1;-webkit-transition:opacity 1s;transition:opacity 1s}#kera-scoreboard-container .options-toggle.hidden{opacity:0;display:inherit!important}#kera-scoreboard-container .options-toggle .hide{display:none!important;visibility:hidden}#kera-scoreboard-container .options-toggle .icon{vertical-align:bottom}"
},{}],21:[function(require,module,exports){
module.exports = function getChanges(prev, now) {
	var changes = {}, prop, pc;
	
	for (prop in now) {
		if (!prev || prev[prop] !== now[prop]) {
			if (Array.isArray(prev[prop]) && Array.isArray(now[prop])) {
				if (prev[prop].join(',') !== now[prop].join(',')) {
					changes[prop] = now[prop];
				}
			}
			else if (typeof now[prop] === 'object') {
				var c = getChanges(prev[prop], now[prop]);
				if(c) {
					changes[prop] = c;
				}
			} else {
				changes[prop] = now[prop];
			}
		}
	}

	for (prop in changes) {
		return changes;
	}

	return false; // false when unchanged
};
},{}],22:[function(require,module,exports){
var stats = require('./stats');

function getSprite(sprite) {
	var width = 40;
	var height = 40;
	var tile = tagpro.tiles[sprite];
	var position = (-tile.x * width) + 'px ' + (-tile.y * height) + 'px';
	return position;
}

function observePowerupCounts() {
	var keys = Object.keys(stats.powerupCounts).map(function(item) { return stats.powerupCounts[item].id; });

	var keypaths = keys.map(function(item) {
		return 'tagpro.players.*.' + item;
	}).join(' ');

	this.observe(keypaths, function(val, old, keypath) {
		if (val && !old) {
			this.set(keypath + 'Count', (this.get(keypath + 'Count') || 0) + 1);
		}
	});
}

function getPlayerStat(players, stat) {
	var val = 0;

	for (var key in players) {
		var player = players[key];
		val += player[stat] || 0;
	}

	return val;
}

function getTeamStats(players) {
	var all = Object.keys(stats.summables);
	var powerups = Object.keys(stats.powerupCounts);
	Array.prototype.push.apply(all, powerups);

	var map = {};

	all.forEach(function(stat) {
		var playerIds = Object.keys(players);
		map[stat] = playerIds.reduce(function(sum, id) {
			if (!players[id]) {
				return sum;
			}

			var val = this.get('tagpro.players.' + id + '.' + stat);
			return sum + (val || 0);
		}.bind(this), 0);
	}.bind(this));

	map.powerupCount = powerups.reduce(function(sum, key) {
		return sum + map[key];
	}, 0);

	return map;
}

function injectGlobalCss(css) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.head.appendChild(style);	
}

module.exports = {
	getSprite: getSprite,
	observePowerupCounts: observePowerupCounts,
	getTeamStats: getTeamStats,
	injectGlobalCss: injectGlobalCss
};
},{"./stats":25}],23:[function(require,module,exports){
module.exports = function filter(obj, predicate) {
    var result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};
},{}],24:[function(require,module,exports){
/*

	ractive-transitions-fly
	=======================

	Version 0.1.3.

	This transition uses CSS transforms to 'fly' elements to their
	natural location on the page, fading in from transparent as they go.
	By default, they will fly in from left.

	==========================

	Troubleshooting: If you're using a module system in your app (AMD or
	something more nodey) then you may need to change the paths below,
	where it says `require( 'ractive' )` or `define([ 'ractive' ]...)`.

	==========================

	Usage: Include this file on your page below Ractive, e.g:

	    <script src='lib/ractive.js'></script>
	    <script src='lib/ractive-transitions-fly.js'></script>

	Or, if you're using a module loader, require this module:

	    // requiring the plugin will 'activate' it - no need to use
	    // the return value
	    require( 'ractive-transitions-fly' );

	You can adjust the following parameters: `x`, `y`, `duration`,
	`delay` and `easing`.

*/

(function ( global, factory ) {

	'use strict';

	// Common JS (i.e. browserify) environment
	if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( (typeof window !== "undefined" ? window.Ractive : typeof global !== "undefined" ? global.Ractive : null) );
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
		throw new Error( 'Could not find Ractive! It must be loaded before the ractive-transitions-fly plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

	'use strict';

	var fly, addPx, defaults;

	defaults = {
		duration: 400,
		easing: 'easeOut',
		opacity: 0,
		x: -500,
		y: 0
	};

	addPx = function ( num ) {
		if ( num === 0 || typeof num === 'string' ) {
			return num;
		}

		return num + 'px';
	};

	fly = function ( t, params ) {
		var x, y, offscreen, target;

		params = t.processParams( params, defaults );

		x = addPx( params.x );
		y = addPx( params.y );

		offscreen = {
			transform: 'translate(' + x + ',' + y + ')',
			opacity: 0
		};

		if ( t.isIntro ) {
			// animate to the current style
			target = t.getStyle([ 'opacity', 'transform' ]);

			// set offscreen style
			t.setStyle( offscreen );
		} else {
			target = offscreen;
		}

		t.animateStyle( target, params ).then( t.complete );
	};

	Ractive.transitions.fly = fly;

}));
},{}],25:[function(require,module,exports){
var summables = {
	's-tags': { label: 'Tags' },
	's-pops': { label: 'Pops' },
	's-grabs': { label: 'Grabs' },
	's-returns': { label: 'Returns' },
	's-captures': { label: 'Captures' },
	's-drops': { label: 'Drops' },
	's-support': { label: 'Support' },
	's-hold': { label: 'Hold', time: true },
	's-prevent': { label: 'Prevent', time: true },
	'score': { label: 'Score' },
	'points': { label: 'Points' },
	'degree': { label: 'Degree' }
};

var powerupCounts = {
	gripCount: { label: 'Grip', id: 'grip' },
	speedCount: { label: 'Speed', id: 'speed' },
	bombCount: { label: 'Rolling Bomb', id: 'bomb' },
	tagproCount: { label: 'Tagpro', id: 'tagpro' }
};

var all = $.extend(true, {}, summables, powerupCounts, {
	powerupCount: { label: 'Powerups' }
});

module.exports = {
	summables: summables,
	powerupCounts: powerupCounts,
	all: all
};
},{}],26:[function(require,module,exports){
/* jshint ignore:start */
function getItem(name) {
	return GM_getValue(name);
}

function setItem(name, value) {
	GM_setValue(name, value);
}

function removeItem(name) {
	GM_deleteValue(name);
}

function getJson(name) {
	return JSON.parse(getItem(name) || null);
}

function setJson(name, value) {
	setItem(name, JSON.stringify(value));
}

module.exports = {
	getItem: getItem,
	setItem: setItem,
	getJson: getJson,
	setJson: setJson
};
/* jshint ignore:end */
},{}]},{},[1]);
