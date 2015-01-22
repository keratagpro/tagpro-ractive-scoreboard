(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\checkbox_component.html":[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"label","a":{"class":["checkbox ",{"t":2,"r":"class"}," ",{"t":2,"x":{"r":["value",".trueClass",".falseClass"],"s":"_0?_1:_2"}}]},"f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"value"}]}}," ",{"t":7,"e":"span","f":[{"t":2,"r":"label"}]}]}]}
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\checkbox_component.js":[function(require,module,exports){
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
},{"./checkbox_component.html":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\checkbox_component.html"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\options_component.html":[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard-options"},"t0":{"n":"fly","a":[{"x":0,"y":-500,"opacity":1}]},"f":[{"t":7,"e":"a","a":{"href":"#","class":"close","title":"Close Options"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showOptions\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-small icon-close"}}]}," ",{"t":7,"e":"h3","a":{"class":"drag-handle"},"f":[{"t":7,"e":"span","a":{"class":"icon icon-score"}}," TagPro Scoreboard Options (",{"t":7,"e":"a","a":{"href":"https://github.com/keratagpro/tagpro-scoreboard","target":"_blank"},"f":["github"]},")"]}," ",{"t":7,"e":"div","a":{"class":"options-content"},"f":[{"t":7,"e":"form","a":{"class":"pure-form"},"f":[{"t":7,"e":"Checkbox","a":{"class":"pure-checkbox","label":"Show Scoreboard","value":[{"t":2,"r":"options.showScoreboard"}]}}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Team info"]}," ",{"t":7,"e":"Checkbox","a":{"label":"Score","value":[{"t":2,"r":"options.showScore"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Team names","value":[{"t":2,"r":"options.showTeams"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Players","value":[{"t":2,"r":"options.showPlayers"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Statistics","value":[{"t":2,"r":"options.showStatistics"}]}}]}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Player info"]}," ",{"t":7,"e":"Checkbox","a":{"label":"Powerups","value":[{"t":2,"r":"options.showPowerups"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Authentication","value":[{"t":2,"r":"options.showAuth"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Flair","value":[{"t":2,"r":"options.showFlair"}]}}]}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Statistics"]}," ",{"t":4,"r":"statsMap","i":"key","f":[{"t":7,"e":"Checkbox","a":{"label":[{"t":2,"r":".label"}],"value":[{"t":2,"r":".selected"}]}}]}]}," ",{"t":7,"e":"fieldset","a":{"class":"pure-form-stacked"},"f":[{"t":7,"e":"legend","f":["Other"]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"id":"name-red","label":"Red Team Name","value":[{"t":2,"r":"options.teamNames.red"}]}}," ",{"t":7,"e":"Textbox","a":{"id":"name-blue","label":"Blue Team Name","value":[{"t":2,"r":"options.teamNames.blue"}]}}]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"id":"score-red","label":"Red Team Score","value":[{"t":2,"r":"options.previousScores.red"}]}}," ",{"t":7,"e":"Textbox","a":{"id":"score-blue","label":"Blue Team Score","value":[{"t":2,"r":"options.previousScores.blue"}]}}]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"label":"Scoreboard Background Color","value":[{"t":2,"r":"options.backgroundColor"}]}}," ",{"t":7,"e":"Textbox","a":{"label":"Scoreboard Max Height","value":[{"t":2,"r":"options.maxHeight"}]}}]}]}," ",{"t":7,"e":"a","a":{"href":"#"},"v":{"click":{"m":"storeOptions","a":{"r":[],"s":"[]"}}},"f":["Save Locally"]}," ",{"t":7,"e":"a","a":{"href":"#"},"v":{"click":{"m":"resetOptions","a":{"r":[],"s":"[]"}}},"f":["Reset"]}]}]}]}]}
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\options_component.js":[function(require,module,exports){
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
},{"../scoreboard-options":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard-options.js","../util/getChanges":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\getChanges.js","../util/storage":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\storage.js","./checkbox_component":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\checkbox_component.js","./options_component.html":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\options_component.html","./options_component.tmp.css":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\options_component.tmp.css","./textbox_component":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\textbox_component.js"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\options_component.tmp.css":[function(require,module,exports){
module.exports = "#kera-scoreboard-options{border:3px solid #333;border-radius:3px;max-width:600px;max-height:90%;overflow:auto;color:#333;background-color:#eee;font-size:14px;margin:0 auto;position:absolute;left:0;right:0;z-index:10/*!\nPure v0.5.0\nCopyright 2014 Yahoo! Inc. All rights reserved.\nLicensed under the BSD License.\nhttps://github.com/yui/pure/blob/master/LICENSE.md\n*/}@media screen and (min-width:35.5em){#kera-scoreboard-options .pure-u-sm-1,#kera-scoreboard-options .pure-u-sm-1-1,#kera-scoreboard-options .pure-u-sm-1-12,#kera-scoreboard-options .pure-u-sm-1-2,#kera-scoreboard-options .pure-u-sm-1-24,#kera-scoreboard-options .pure-u-sm-1-3,#kera-scoreboard-options .pure-u-sm-1-4,#kera-scoreboard-options .pure-u-sm-1-5,#kera-scoreboard-options .pure-u-sm-1-6,#kera-scoreboard-options .pure-u-sm-1-8,#kera-scoreboard-options .pure-u-sm-10-24,#kera-scoreboard-options .pure-u-sm-11-12,#kera-scoreboard-options .pure-u-sm-11-24,#kera-scoreboard-options .pure-u-sm-12-24,#kera-scoreboard-options .pure-u-sm-13-24,#kera-scoreboard-options .pure-u-sm-14-24,#kera-scoreboard-options .pure-u-sm-15-24,#kera-scoreboard-options .pure-u-sm-16-24,#kera-scoreboard-options .pure-u-sm-17-24,#kera-scoreboard-options .pure-u-sm-18-24,#kera-scoreboard-options .pure-u-sm-19-24,#kera-scoreboard-options .pure-u-sm-2-24,#kera-scoreboard-options .pure-u-sm-2-3,#kera-scoreboard-options .pure-u-sm-2-5,#kera-scoreboard-options .pure-u-sm-20-24,#kera-scoreboard-options .pure-u-sm-21-24,#kera-scoreboard-options .pure-u-sm-22-24,#kera-scoreboard-options .pure-u-sm-23-24,#kera-scoreboard-options .pure-u-sm-24-24,#kera-scoreboard-options .pure-u-sm-3-24,#kera-scoreboard-options .pure-u-sm-3-4,#kera-scoreboard-options .pure-u-sm-3-5,#kera-scoreboard-options .pure-u-sm-3-8,#kera-scoreboard-options .pure-u-sm-4-24,#kera-scoreboard-options .pure-u-sm-4-5,#kera-scoreboard-options .pure-u-sm-5-12,#kera-scoreboard-options .pure-u-sm-5-24,#kera-scoreboard-options .pure-u-sm-5-5,#kera-scoreboard-options .pure-u-sm-5-6,#kera-scoreboard-options .pure-u-sm-5-8,#kera-scoreboard-options .pure-u-sm-6-24,#kera-scoreboard-options .pure-u-sm-7-12,#kera-scoreboard-options .pure-u-sm-7-24,#kera-scoreboard-options .pure-u-sm-7-8,#kera-scoreboard-options .pure-u-sm-8-24,#kera-scoreboard-options .pure-u-sm-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-sm-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-sm-1-12,#kera-scoreboard-options .pure-u-sm-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-sm-1-8,#kera-scoreboard-options .pure-u-sm-3-24{width:12.5%}#kera-scoreboard-options .pure-u-sm-1-6,#kera-scoreboard-options .pure-u-sm-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-sm-1-5{width:20%}#kera-scoreboard-options .pure-u-sm-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-sm-1-4,#kera-scoreboard-options .pure-u-sm-6-24{width:25%}#kera-scoreboard-options .pure-u-sm-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-sm-1-3,#kera-scoreboard-options .pure-u-sm-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-sm-3-8,#kera-scoreboard-options .pure-u-sm-9-24{width:37.5%}#kera-scoreboard-options .pure-u-sm-2-5{width:40%}#kera-scoreboard-options .pure-u-sm-10-24,#kera-scoreboard-options .pure-u-sm-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-sm-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-sm-1-2,#kera-scoreboard-options .pure-u-sm-12-24{width:50%}#kera-scoreboard-options .pure-u-sm-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-sm-14-24,#kera-scoreboard-options .pure-u-sm-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-sm-3-5{width:60%}#kera-scoreboard-options .pure-u-sm-15-24,#kera-scoreboard-options .pure-u-sm-5-8{width:62.5%}#kera-scoreboard-options .pure-u-sm-16-24,#kera-scoreboard-options .pure-u-sm-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-sm-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-sm-18-24,#kera-scoreboard-options .pure-u-sm-3-4{width:75%}#kera-scoreboard-options .pure-u-sm-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-sm-4-5{width:80%}#kera-scoreboard-options .pure-u-sm-20-24,#kera-scoreboard-options .pure-u-sm-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-sm-21-24,#kera-scoreboard-options .pure-u-sm-7-8{width:87.5%}#kera-scoreboard-options .pure-u-sm-11-12,#kera-scoreboard-options .pure-u-sm-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-sm-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-sm-1,#kera-scoreboard-options .pure-u-sm-1-1,#kera-scoreboard-options .pure-u-sm-24-24,#kera-scoreboard-options .pure-u-sm-5-5{width:100%}}@media screen and (min-width:48em){#kera-scoreboard-options .pure-u-md-1,#kera-scoreboard-options .pure-u-md-1-1,#kera-scoreboard-options .pure-u-md-1-12,#kera-scoreboard-options .pure-u-md-1-2,#kera-scoreboard-options .pure-u-md-1-24,#kera-scoreboard-options .pure-u-md-1-3,#kera-scoreboard-options .pure-u-md-1-4,#kera-scoreboard-options .pure-u-md-1-5,#kera-scoreboard-options .pure-u-md-1-6,#kera-scoreboard-options .pure-u-md-1-8,#kera-scoreboard-options .pure-u-md-10-24,#kera-scoreboard-options .pure-u-md-11-12,#kera-scoreboard-options .pure-u-md-11-24,#kera-scoreboard-options .pure-u-md-12-24,#kera-scoreboard-options .pure-u-md-13-24,#kera-scoreboard-options .pure-u-md-14-24,#kera-scoreboard-options .pure-u-md-15-24,#kera-scoreboard-options .pure-u-md-16-24,#kera-scoreboard-options .pure-u-md-17-24,#kera-scoreboard-options .pure-u-md-18-24,#kera-scoreboard-options .pure-u-md-19-24,#kera-scoreboard-options .pure-u-md-2-24,#kera-scoreboard-options .pure-u-md-2-3,#kera-scoreboard-options .pure-u-md-2-5,#kera-scoreboard-options .pure-u-md-20-24,#kera-scoreboard-options .pure-u-md-21-24,#kera-scoreboard-options .pure-u-md-22-24,#kera-scoreboard-options .pure-u-md-23-24,#kera-scoreboard-options .pure-u-md-24-24,#kera-scoreboard-options .pure-u-md-3-24,#kera-scoreboard-options .pure-u-md-3-4,#kera-scoreboard-options .pure-u-md-3-5,#kera-scoreboard-options .pure-u-md-3-8,#kera-scoreboard-options .pure-u-md-4-24,#kera-scoreboard-options .pure-u-md-4-5,#kera-scoreboard-options .pure-u-md-5-12,#kera-scoreboard-options .pure-u-md-5-24,#kera-scoreboard-options .pure-u-md-5-5,#kera-scoreboard-options .pure-u-md-5-6,#kera-scoreboard-options .pure-u-md-5-8,#kera-scoreboard-options .pure-u-md-6-24,#kera-scoreboard-options .pure-u-md-7-12,#kera-scoreboard-options .pure-u-md-7-24,#kera-scoreboard-options .pure-u-md-7-8,#kera-scoreboard-options .pure-u-md-8-24,#kera-scoreboard-options .pure-u-md-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-md-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-md-1-12,#kera-scoreboard-options .pure-u-md-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-md-1-8,#kera-scoreboard-options .pure-u-md-3-24{width:12.5%}#kera-scoreboard-options .pure-u-md-1-6,#kera-scoreboard-options .pure-u-md-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-md-1-5{width:20%}#kera-scoreboard-options .pure-u-md-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-md-1-4,#kera-scoreboard-options .pure-u-md-6-24{width:25%}#kera-scoreboard-options .pure-u-md-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-md-1-3,#kera-scoreboard-options .pure-u-md-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-md-3-8,#kera-scoreboard-options .pure-u-md-9-24{width:37.5%}#kera-scoreboard-options .pure-u-md-2-5{width:40%}#kera-scoreboard-options .pure-u-md-10-24,#kera-scoreboard-options .pure-u-md-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-md-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-md-1-2,#kera-scoreboard-options .pure-u-md-12-24{width:50%}#kera-scoreboard-options .pure-u-md-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-md-14-24,#kera-scoreboard-options .pure-u-md-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-md-3-5{width:60%}#kera-scoreboard-options .pure-u-md-15-24,#kera-scoreboard-options .pure-u-md-5-8{width:62.5%}#kera-scoreboard-options .pure-u-md-16-24,#kera-scoreboard-options .pure-u-md-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-md-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-md-18-24,#kera-scoreboard-options .pure-u-md-3-4{width:75%}#kera-scoreboard-options .pure-u-md-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-md-4-5{width:80%}#kera-scoreboard-options .pure-u-md-20-24,#kera-scoreboard-options .pure-u-md-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-md-21-24,#kera-scoreboard-options .pure-u-md-7-8{width:87.5%}#kera-scoreboard-options .pure-u-md-11-12,#kera-scoreboard-options .pure-u-md-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-md-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-md-1,#kera-scoreboard-options .pure-u-md-1-1,#kera-scoreboard-options .pure-u-md-24-24,#kera-scoreboard-options .pure-u-md-5-5{width:100%}}@media screen and (min-width:64em){#kera-scoreboard-options .pure-u-lg-1,#kera-scoreboard-options .pure-u-lg-1-1,#kera-scoreboard-options .pure-u-lg-1-12,#kera-scoreboard-options .pure-u-lg-1-2,#kera-scoreboard-options .pure-u-lg-1-24,#kera-scoreboard-options .pure-u-lg-1-3,#kera-scoreboard-options .pure-u-lg-1-4,#kera-scoreboard-options .pure-u-lg-1-5,#kera-scoreboard-options .pure-u-lg-1-6,#kera-scoreboard-options .pure-u-lg-1-8,#kera-scoreboard-options .pure-u-lg-10-24,#kera-scoreboard-options .pure-u-lg-11-12,#kera-scoreboard-options .pure-u-lg-11-24,#kera-scoreboard-options .pure-u-lg-12-24,#kera-scoreboard-options .pure-u-lg-13-24,#kera-scoreboard-options .pure-u-lg-14-24,#kera-scoreboard-options .pure-u-lg-15-24,#kera-scoreboard-options .pure-u-lg-16-24,#kera-scoreboard-options .pure-u-lg-17-24,#kera-scoreboard-options .pure-u-lg-18-24,#kera-scoreboard-options .pure-u-lg-19-24,#kera-scoreboard-options .pure-u-lg-2-24,#kera-scoreboard-options .pure-u-lg-2-3,#kera-scoreboard-options .pure-u-lg-2-5,#kera-scoreboard-options .pure-u-lg-20-24,#kera-scoreboard-options .pure-u-lg-21-24,#kera-scoreboard-options .pure-u-lg-22-24,#kera-scoreboard-options .pure-u-lg-23-24,#kera-scoreboard-options .pure-u-lg-24-24,#kera-scoreboard-options .pure-u-lg-3-24,#kera-scoreboard-options .pure-u-lg-3-4,#kera-scoreboard-options .pure-u-lg-3-5,#kera-scoreboard-options .pure-u-lg-3-8,#kera-scoreboard-options .pure-u-lg-4-24,#kera-scoreboard-options .pure-u-lg-4-5,#kera-scoreboard-options .pure-u-lg-5-12,#kera-scoreboard-options .pure-u-lg-5-24,#kera-scoreboard-options .pure-u-lg-5-5,#kera-scoreboard-options .pure-u-lg-5-6,#kera-scoreboard-options .pure-u-lg-5-8,#kera-scoreboard-options .pure-u-lg-6-24,#kera-scoreboard-options .pure-u-lg-7-12,#kera-scoreboard-options .pure-u-lg-7-24,#kera-scoreboard-options .pure-u-lg-7-8,#kera-scoreboard-options .pure-u-lg-8-24,#kera-scoreboard-options .pure-u-lg-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-lg-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-lg-1-12,#kera-scoreboard-options .pure-u-lg-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-lg-1-8,#kera-scoreboard-options .pure-u-lg-3-24{width:12.5%}#kera-scoreboard-options .pure-u-lg-1-6,#kera-scoreboard-options .pure-u-lg-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-lg-1-5{width:20%}#kera-scoreboard-options .pure-u-lg-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-lg-1-4,#kera-scoreboard-options .pure-u-lg-6-24{width:25%}#kera-scoreboard-options .pure-u-lg-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-lg-1-3,#kera-scoreboard-options .pure-u-lg-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-lg-3-8,#kera-scoreboard-options .pure-u-lg-9-24{width:37.5%}#kera-scoreboard-options .pure-u-lg-2-5{width:40%}#kera-scoreboard-options .pure-u-lg-10-24,#kera-scoreboard-options .pure-u-lg-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-lg-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-lg-1-2,#kera-scoreboard-options .pure-u-lg-12-24{width:50%}#kera-scoreboard-options .pure-u-lg-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-lg-14-24,#kera-scoreboard-options .pure-u-lg-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-lg-3-5{width:60%}#kera-scoreboard-options .pure-u-lg-15-24,#kera-scoreboard-options .pure-u-lg-5-8{width:62.5%}#kera-scoreboard-options .pure-u-lg-16-24,#kera-scoreboard-options .pure-u-lg-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-lg-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-lg-18-24,#kera-scoreboard-options .pure-u-lg-3-4{width:75%}#kera-scoreboard-options .pure-u-lg-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-lg-4-5{width:80%}#kera-scoreboard-options .pure-u-lg-20-24,#kera-scoreboard-options .pure-u-lg-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-lg-21-24,#kera-scoreboard-options .pure-u-lg-7-8{width:87.5%}#kera-scoreboard-options .pure-u-lg-11-12,#kera-scoreboard-options .pure-u-lg-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-lg-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-lg-1,#kera-scoreboard-options .pure-u-lg-1-1,#kera-scoreboard-options .pure-u-lg-24-24,#kera-scoreboard-options .pure-u-lg-5-5{width:100%}}@media screen and (min-width:80em){#kera-scoreboard-options .pure-u-xl-1,#kera-scoreboard-options .pure-u-xl-1-1,#kera-scoreboard-options .pure-u-xl-1-12,#kera-scoreboard-options .pure-u-xl-1-2,#kera-scoreboard-options .pure-u-xl-1-24,#kera-scoreboard-options .pure-u-xl-1-3,#kera-scoreboard-options .pure-u-xl-1-4,#kera-scoreboard-options .pure-u-xl-1-5,#kera-scoreboard-options .pure-u-xl-1-6,#kera-scoreboard-options .pure-u-xl-1-8,#kera-scoreboard-options .pure-u-xl-10-24,#kera-scoreboard-options .pure-u-xl-11-12,#kera-scoreboard-options .pure-u-xl-11-24,#kera-scoreboard-options .pure-u-xl-12-24,#kera-scoreboard-options .pure-u-xl-13-24,#kera-scoreboard-options .pure-u-xl-14-24,#kera-scoreboard-options .pure-u-xl-15-24,#kera-scoreboard-options .pure-u-xl-16-24,#kera-scoreboard-options .pure-u-xl-17-24,#kera-scoreboard-options .pure-u-xl-18-24,#kera-scoreboard-options .pure-u-xl-19-24,#kera-scoreboard-options .pure-u-xl-2-24,#kera-scoreboard-options .pure-u-xl-2-3,#kera-scoreboard-options .pure-u-xl-2-5,#kera-scoreboard-options .pure-u-xl-20-24,#kera-scoreboard-options .pure-u-xl-21-24,#kera-scoreboard-options .pure-u-xl-22-24,#kera-scoreboard-options .pure-u-xl-23-24,#kera-scoreboard-options .pure-u-xl-24-24,#kera-scoreboard-options .pure-u-xl-3-24,#kera-scoreboard-options .pure-u-xl-3-4,#kera-scoreboard-options .pure-u-xl-3-5,#kera-scoreboard-options .pure-u-xl-3-8,#kera-scoreboard-options .pure-u-xl-4-24,#kera-scoreboard-options .pure-u-xl-4-5,#kera-scoreboard-options .pure-u-xl-5-12,#kera-scoreboard-options .pure-u-xl-5-24,#kera-scoreboard-options .pure-u-xl-5-5,#kera-scoreboard-options .pure-u-xl-5-6,#kera-scoreboard-options .pure-u-xl-5-8,#kera-scoreboard-options .pure-u-xl-6-24,#kera-scoreboard-options .pure-u-xl-7-12,#kera-scoreboard-options .pure-u-xl-7-24,#kera-scoreboard-options .pure-u-xl-7-8,#kera-scoreboard-options .pure-u-xl-8-24,#kera-scoreboard-options .pure-u-xl-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-xl-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-xl-1-12,#kera-scoreboard-options .pure-u-xl-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-xl-1-8,#kera-scoreboard-options .pure-u-xl-3-24{width:12.5%}#kera-scoreboard-options .pure-u-xl-1-6,#kera-scoreboard-options .pure-u-xl-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-xl-1-5{width:20%}#kera-scoreboard-options .pure-u-xl-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-xl-1-4,#kera-scoreboard-options .pure-u-xl-6-24{width:25%}#kera-scoreboard-options .pure-u-xl-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-xl-1-3,#kera-scoreboard-options .pure-u-xl-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-xl-3-8,#kera-scoreboard-options .pure-u-xl-9-24{width:37.5%}#kera-scoreboard-options .pure-u-xl-2-5{width:40%}#kera-scoreboard-options .pure-u-xl-10-24,#kera-scoreboard-options .pure-u-xl-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-xl-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-xl-1-2,#kera-scoreboard-options .pure-u-xl-12-24{width:50%}#kera-scoreboard-options .pure-u-xl-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-xl-14-24,#kera-scoreboard-options .pure-u-xl-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-xl-3-5{width:60%}#kera-scoreboard-options .pure-u-xl-15-24,#kera-scoreboard-options .pure-u-xl-5-8{width:62.5%}#kera-scoreboard-options .pure-u-xl-16-24,#kera-scoreboard-options .pure-u-xl-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-xl-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-xl-18-24,#kera-scoreboard-options .pure-u-xl-3-4{width:75%}#kera-scoreboard-options .pure-u-xl-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-xl-4-5{width:80%}#kera-scoreboard-options .pure-u-xl-20-24,#kera-scoreboard-options .pure-u-xl-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-xl-21-24,#kera-scoreboard-options .pure-u-xl-7-8{width:87.5%}#kera-scoreboard-options .pure-u-xl-11-12,#kera-scoreboard-options .pure-u-xl-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-xl-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-xl-1,#kera-scoreboard-options .pure-u-xl-1-1,#kera-scoreboard-options .pure-u-xl-24-24,#kera-scoreboard-options .pure-u-xl-5-5{width:100%}}#kera-scoreboard-options .pure-form input:not([type]),#kera-scoreboard-options .pure-form input[type=text],#kera-scoreboard-options .pure-form input[type=number],#kera-scoreboard-options .pure-form input[type=search],#kera-scoreboard-options .pure-form input[type=tel],#kera-scoreboard-options .pure-form input[type=color],#kera-scoreboard-options .pure-form input[type=password],#kera-scoreboard-options .pure-form input[type=email],#kera-scoreboard-options .pure-form input[type=url],#kera-scoreboard-options .pure-form input[type=date],#kera-scoreboard-options .pure-form input[type=month],#kera-scoreboard-options .pure-form input[type=time],#kera-scoreboard-options .pure-form input[type=datetime],#kera-scoreboard-options .pure-form input[type=datetime-local],#kera-scoreboard-options .pure-form input[type=week],#kera-scoreboard-options .pure-form select,#kera-scoreboard-options .pure-form textarea{padding:.5em .6em;display:inline-block;border:1px solid #ccc;box-shadow:inset 0 1px 3px #ddd;border-radius:4px;box-sizing:border-box}#kera-scoreboard-options .pure-form input[type=color]{padding:.2em .5em}#kera-scoreboard-options .pure-form input:not([type]):focus,#kera-scoreboard-options .pure-form input[type=text]:focus,#kera-scoreboard-options .pure-form input[type=number]:focus,#kera-scoreboard-options .pure-form input[type=search]:focus,#kera-scoreboard-options .pure-form input[type=tel]:focus,#kera-scoreboard-options .pure-form input[type=color]:focus,#kera-scoreboard-options .pure-form input[type=password]:focus,#kera-scoreboard-options .pure-form input[type=email]:focus,#kera-scoreboard-options .pure-form input[type=url]:focus,#kera-scoreboard-options .pure-form input[type=date]:focus,#kera-scoreboard-options .pure-form input[type=month]:focus,#kera-scoreboard-options .pure-form input[type=time]:focus,#kera-scoreboard-options .pure-form input[type=datetime]:focus,#kera-scoreboard-options .pure-form input[type=datetime-local]:focus,#kera-scoreboard-options .pure-form input[type=week]:focus,#kera-scoreboard-options .pure-form select:focus,#kera-scoreboard-options .pure-form textarea:focus{outline:0;border-color:#129FEA}#kera-scoreboard-options .pure-form input[type=file]:focus,#kera-scoreboard-options .pure-form input[type=radio]:focus,#kera-scoreboard-options .pure-form input[type=checkbox]:focus{outline:#129FEA auto 1px}#kera-scoreboard-options .pure-form .pure-checkbox,#kera-scoreboard-options .pure-form .pure-radio{margin:.5em 0;display:block}#kera-scoreboard-options .pure-form input:not([type])[disabled],#kera-scoreboard-options .pure-form input[type=text][disabled],#kera-scoreboard-options .pure-form input[type=number][disabled],#kera-scoreboard-options .pure-form input[type=search][disabled],#kera-scoreboard-options .pure-form input[type=tel][disabled],#kera-scoreboard-options .pure-form input[type=color][disabled],#kera-scoreboard-options .pure-form input[type=password][disabled],#kera-scoreboard-options .pure-form input[type=email][disabled],#kera-scoreboard-options .pure-form input[type=url][disabled],#kera-scoreboard-options .pure-form input[type=date][disabled],#kera-scoreboard-options .pure-form input[type=month][disabled],#kera-scoreboard-options .pure-form input[type=time][disabled],#kera-scoreboard-options .pure-form input[type=datetime][disabled],#kera-scoreboard-options .pure-form input[type=datetime-local][disabled],#kera-scoreboard-options .pure-form input[type=week][disabled],#kera-scoreboard-options .pure-form select[disabled],#kera-scoreboard-options .pure-form textarea[disabled]{cursor:not-allowed;background-color:#eaeded;color:#cad2d3}#kera-scoreboard-options .pure-form input[readonly],#kera-scoreboard-options .pure-form select[readonly],#kera-scoreboard-options .pure-form textarea[readonly]{background:#eee;color:#777;border-color:#ccc}#kera-scoreboard-options .pure-form input:focus:invalid,#kera-scoreboard-options .pure-form select:focus:invalid,#kera-scoreboard-options .pure-form textarea:focus:invalid{color:#b94a48;border-color:#ee5f5b}#kera-scoreboard-options .pure-form input:focus:invalid:focus,#kera-scoreboard-options .pure-form select:focus:invalid:focus,#kera-scoreboard-options .pure-form textarea:focus:invalid:focus{border-color:#e9322d}#kera-scoreboard-options .pure-form input[type=file]:focus:invalid:focus,#kera-scoreboard-options .pure-form input[type=radio]:focus:invalid:focus,#kera-scoreboard-options .pure-form input[type=checkbox]:focus:invalid:focus{outline-color:#e9322d}#kera-scoreboard-options .pure-form select{border:1px solid #ccc;background-color:#fff}#kera-scoreboard-options .pure-form select[multiple]{height:auto}#kera-scoreboard-options .pure-form label{margin:.5em 0 .2em}#kera-scoreboard-options .pure-form fieldset{margin:0;padding:.35em 0 .75em;border:0}#kera-scoreboard-options .pure-form legend{display:block;width:100%;padding:.3em 0;margin-bottom:.3em;color:#333;border-bottom:1px solid #e5e5e5}#kera-scoreboard-options .pure-form-stacked input:not([type]),#kera-scoreboard-options .pure-form-stacked input[type=text],#kera-scoreboard-options .pure-form-stacked input[type=number],#kera-scoreboard-options .pure-form-stacked input[type=search],#kera-scoreboard-options .pure-form-stacked input[type=tel],#kera-scoreboard-options .pure-form-stacked input[type=color],#kera-scoreboard-options .pure-form-stacked input[type=password],#kera-scoreboard-options .pure-form-stacked input[type=email],#kera-scoreboard-options .pure-form-stacked input[type=url],#kera-scoreboard-options .pure-form-stacked input[type=date],#kera-scoreboard-options .pure-form-stacked input[type=month],#kera-scoreboard-options .pure-form-stacked input[type=time],#kera-scoreboard-options .pure-form-stacked input[type=datetime],#kera-scoreboard-options .pure-form-stacked input[type=datetime-local],#kera-scoreboard-options .pure-form-stacked input[type=week],#kera-scoreboard-options .pure-form-stacked label,#kera-scoreboard-options .pure-form-stacked select,#kera-scoreboard-options .pure-form-stacked textarea{display:block;margin:.25em 0}#kera-scoreboard-options .pure-form-aligned .pure-help-inline,#kera-scoreboard-options .pure-form-aligned input,#kera-scoreboard-options .pure-form-aligned select,#kera-scoreboard-options .pure-form-aligned textarea,#kera-scoreboard-options .pure-form-message-inline{display:inline-block;vertical-align:middle}#kera-scoreboard-options .pure-form-aligned textarea{vertical-align:top}#kera-scoreboard-options .pure-form-aligned .pure-control-group{margin-bottom:.5em}#kera-scoreboard-options .pure-form-aligned .pure-control-group label{text-align:right;display:inline-block;vertical-align:middle;width:10em;margin:0 1em 0 0}#kera-scoreboard-options .pure-form-aligned .pure-controls{margin:1.5em 0 0 10em}#kera-scoreboard-options .pure-form .pure-input-rounded,#kera-scoreboard-options .pure-form input.pure-input-rounded{border-radius:2em;padding:.5em 1em}#kera-scoreboard-options .pure-form .pure-group fieldset{margin-bottom:10px}#kera-scoreboard-options .pure-form .pure-group input{display:block;padding:10px;margin:0;border-radius:0;position:relative;top:-1px}#kera-scoreboard-options .pure-form .pure-group input:focus{z-index:2}#kera-scoreboard-options .pure-form .pure-group input:first-child{top:1px;border-radius:4px 4px 0 0}#kera-scoreboard-options .pure-form .pure-group input:last-child{top:-2px;border-radius:0 0 4px 4px}#kera-scoreboard-options .pure-form .pure-group button{margin:.35em 0}#kera-scoreboard-options .pure-form .pure-input-1{width:100%}#kera-scoreboard-options .pure-form .pure-input-2-3{width:66%}#kera-scoreboard-options .pure-form .pure-input-1-2{width:50%}#kera-scoreboard-options .pure-form .pure-input-1-3{width:33%}#kera-scoreboard-options .pure-form .pure-input-1-4{width:25%}#kera-scoreboard-options .pure-form .pure-help-inline,#kera-scoreboard-options .pure-form-message-inline{display:inline-block;padding-left:.3em;color:#666;vertical-align:middle;font-size:.875em}#kera-scoreboard-options .pure-form-message{display:block;color:#666;font-size:.875em}@media only screen and (max-width:480px){#kera-scoreboard-options .pure-form button[type=submit]{margin:.7em 0 0}#kera-scoreboard-options .pure-form input:not([type]),#kera-scoreboard-options .pure-form input[type=text],#kera-scoreboard-options .pure-form input[type=number],#kera-scoreboard-options .pure-form input[type=search],#kera-scoreboard-options .pure-form input[type=tel],#kera-scoreboard-options .pure-form input[type=color],#kera-scoreboard-options .pure-form input[type=password],#kera-scoreboard-options .pure-form input[type=email],#kera-scoreboard-options .pure-form input[type=url],#kera-scoreboard-options .pure-form input[type=date],#kera-scoreboard-options .pure-form input[type=month],#kera-scoreboard-options .pure-form input[type=time],#kera-scoreboard-options .pure-form input[type=datetime],#kera-scoreboard-options .pure-form input[type=datetime-local],#kera-scoreboard-options .pure-form input[type=week],#kera-scoreboard-options .pure-form label{margin-bottom:.3em;display:block}#kera-scoreboard-options .pure-group input:not([type]),#kera-scoreboard-options .pure-group input[type=text],#kera-scoreboard-options .pure-group input[type=number],#kera-scoreboard-options .pure-group input[type=search],#kera-scoreboard-options .pure-group input[type=tel],#kera-scoreboard-options .pure-group input[type=color],#kera-scoreboard-options .pure-group input[type=password],#kera-scoreboard-options .pure-group input[type=email],#kera-scoreboard-options .pure-group input[type=url],#kera-scoreboard-options .pure-group input[type=date],#kera-scoreboard-options .pure-group input[type=month],#kera-scoreboard-options .pure-group input[type=time],#kera-scoreboard-options .pure-group input[type=datetime],#kera-scoreboard-options .pure-group input[type=datetime-local],#kera-scoreboard-options .pure-group input[type=week]{margin-bottom:0}#kera-scoreboard-options .pure-form-aligned .pure-control-group label{margin-bottom:.3em;text-align:left;display:block;width:100%}#kera-scoreboard-options .pure-form-aligned .pure-controls{margin:1.5em 0 0}#kera-scoreboard-options .pure-form .pure-help-inline,#kera-scoreboard-options .pure-form-message,#kera-scoreboard-options .pure-form-message-inline{display:block;font-size:.75em;padding:.2em 0 .8em}}#kera-scoreboard-options .pure-g{letter-spacing:-.31em;word-spacing:-.43em;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;font-family:FreeSans,Arimo,\"Droid Sans\",Helvetica,Arial,sans-serif}#kera-scoreboard-options .pure-g [class*=pure-u]{font-family:sans-serif}#kera-scoreboard-options .pure-g [class*=pure-u] input[type=text]{width:90%}#kera-scoreboard-options h3{font-size:18px;margin:0;padding:4px 8px;border-bottom:1px solid #333;text-align:left}#kera-scoreboard-options h3 .icon{margin-right:5px}#kera-scoreboard-options h3 a{display:inline!important;font-size:inherit!important;color:green;text-decoration:none}#kera-scoreboard-options h3 a:hover{text-decoration:underline}#kera-scoreboard-options h4{font-size:16px;margin:0 0 5px;padding:15px 0 3px;border-bottom:1px solid #ccc}#kera-scoreboard-options .icon{vertical-align:middle}#kera-scoreboard-options .options-content{padding:10px}#kera-scoreboard-options .options-content a{background-color:#e7e7e7;border-radius:3px;display:inline-block;padding:10px;text-decoration:none;color:#333;-webkit-transition:background-color .3s;transition:background-color .3s}#kera-scoreboard-options .options-content a:hover{background-color:#b9b9b9}#kera-scoreboard-options .hide{display:none!important;visibility:hidden}#kera-scoreboard-options .close{text-decoration:none;padding:10px;position:absolute;right:0;top:0}#kera-scoreboard-options label.checkbox{display:inline-block}"
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\player_component.html":[function(require,module,exports){
module.exports={"v":1,"t":[{"t":4,"n":53,"r":"data","f":[{"t":7,"e":"span","a":{"class":"icons"},"f":[{"t":4,"n":50,"r":"flag","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getFlag","flag"],"s":"_0(_1)"}},";"]}}]}," ",{"t":4,"n":50,"r":"options.showPowerups","f":[{"t":4,"n":50,"r":".grip","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"grip\")"}},";"]}}]}," ",{"t":4,"n":50,"r":".bomb","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"bomb\")"}},";"]}}]}," ",{"t":4,"n":50,"r":".tagpro","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"tagpro\")"}},";"]}}]}]}]}," ",{"t":4,"n":50,"r":"options.showFlair","f":[{"t":7,"e":"span","a":{"class":"flair sprite-flair","style":["background-position: ",{"t":2,"x":{"r":["getFlair","flair"],"s":"_0(_1)"}}]}}]}," ",{"t":7,"e":"span","a":{"class":["name ",{"t":2,"x":{"r":["dead"],"s":"_0?\"dead\":\"\""}}," ",{"t":2,"x":{"r":["options.showAuth","auth"],"s":"_0&&_1?\"auth\":\"\""}}],"title":[{"t":2,"r":"degree"}]},"f":[{"t":2,"r":"name"}]}," ",{"t":4,"n":50,"r":"options.showDegree","f":[{"t":7,"e":"span","a":{"class":"degree"},"f":["(",{"t":2,"r":"degree"},"°)"]}]}]}]}
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\player_component.js":[function(require,module,exports){
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
},{"../util/helpers":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\helpers.js","./player_component.html":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\player_component.html","./player_component.tmp.css":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\player_component.tmp.css"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\player_component.tmp.css":[function(require,module,exports){
module.exports = "#kera-scoreboard .player-row .icons{position:absolute;font-size:0}#kera-scoreboard .player-row .dead{color:red!important}#kera-scoreboard .player-row .auth{color:#bfff00}#kera-scoreboard .player-row .name{padding:0 3px}#kera-scoreboard .player-row .red .icons{left:3px}#kera-scoreboard .player-row .red .icons .sprite-small{margin-right:-10px}#kera-scoreboard .player-row .red .flair{float:right;margin-left:4px}#kera-scoreboard .player-row .blue .icons{right:3px}#kera-scoreboard .player-row .blue .icons .sprite-small{margin-left:-10px}#kera-scoreboard .player-row .blue .flair{float:left;margin-right:4px}"
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\scoreboard_component.html":[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard","style":["background-color: ",{"t":2,"r":"options.backgroundColor"},"; max-height: ",{"t":2,"r":"options.maxHeight"},";"]},"t0":{"n":"fly","a":[{"x":0,"y":500}]},"f":[{"t":7,"e":"div","a":{"class":"tools"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"settings","title":"Settings"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showOptions\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-gear-white"},"f":[" "]}]}," ",{"t":7,"e":"a","a":{"href":"#","class":"close","title":"Close Scoreboard"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showScoreboard\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-close-white"},"f":[" "]}]}]}," ",{"t":4,"n":50,"x":{"r":["options.showScore","options.showTeams"],"s":"_0||_1"},"f":[{"t":4,"n":50,"x":{"r":["options.previousScores.red","options.previousScores.blue"],"s":"_0||_1"},"f":[{"t":7,"e":"div","a":{"class":"score-previous"},"f":[{"t":2,"x":{"r":["options.previousScores.red","score.r"],"s":"(parseInt(_0)||0)+_1"}}," - ",{"t":2,"x":{"r":["options.previousScores.blue","score.b"],"s":"(parseInt(_0)||0)+_1"}}]}]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"thead","f":[{"t":4,"n":50,"r":"options.showScore","f":[{"t":7,"e":"tr","a":{"class":"score-row"},"f":[{"t":7,"e":"th","a":{"class":"red"},"f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-large","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"redball\")"}},";"]}}," ",{"t":7,"e":"span","a":{"class":"score"},"f":[{"t":2,"x":{"r":["score.r"],"s":"_0||0"}}]}]}," ",{"t":7,"e":"th","a":{"class":"separator"},"f":["-"]}," ",{"t":7,"e":"th","a":{"class":"blue"},"f":[{"t":7,"e":"span","a":{"class":"score"},"f":[{"t":2,"x":{"r":["score.b"],"s":"_0||0"}}]}," ",{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-large","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"blueball\")"}},";"]}}]}]}]}," ",{"t":4,"n":50,"r":"options.showTeams","f":[{"t":7,"e":"tr","a":{"class":"team-name-row"},"f":[{"t":7,"e":"td","a":{"class":"team red"},"f":[{"t":2,"r":"options.teamNames.red"}]}," ",{"t":7,"e":"td","a":{"class":"separator"},"f":["vs"]}," ",{"t":7,"e":"td","a":{"class":"team blue"},"f":[{"t":2,"r":"options.teamNames.blue"}]}]}]}]}]}]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tbody","f":[{"t":4,"n":50,"r":"options.showPlayers","f":[{"t":7,"e":"tr","a":{"class":"player-row"},"f":[{"t":7,"e":"td","a":{"class":"player red"},"f":[{"t":4,"r":"redPlayers","i":"id","f":[{"t":7,"e":"p","f":[{"t":7,"e":"Player","a":{"data":[{"t":2,"r":"."}],"options":[{"t":2,"r":"options"}]}}]}]}]}," ",{"t":7,"e":"td","a":{"class":"separator"}}," ",{"t":7,"e":"td","a":{"class":"player blue"},"f":[{"t":4,"r":"bluePlayers","i":"id","f":[{"t":7,"e":"p","f":[{"t":7,"e":"Player","a":{"data":[{"t":2,"r":"."}],"options":[{"t":2,"r":"options"}]}}]}]}]}]}]}]}]}," ",{"t":4,"n":50,"x":{"r":["options.showStatistics","selectedStatsMap"],"s":"_0&&_1"},"f":[{"t":7,"e":"h3","f":["Team Statistics"]}," ",{"t":7,"e":"table","a":{"class":"team-statistics"},"f":[{"t":7,"e":"tbody","f":[{"t":4,"r":"selectedStatsMap","i":"key","f":[{"t":7,"e":"tr","a":{"class":[{"t":2,"r":"key"}]},"f":[{"t":7,"e":"td","a":{"class":"label"},"f":[{"t":2,"r":"label"}]}," ",{"t":7,"e":"td","a":{"class":"red"},"f":[{"t":2,"x":{"r":["time","formatTime","key","redTeamStats"],"s":"_0?_1(_3[_2]):_3[_2]"}}]}," ",{"t":7,"e":"td","a":{"class":"blue"},"f":[{"t":2,"x":{"r":["time","formatTime","key","blueTeamStats"],"s":"_0?_1(_3[_2]):_3[_2]"}}]}]}]}]}]}]}]}]}
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\scoreboard_component.js":[function(require,module,exports){
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
},{"./player_component":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\player_component.js","./scoreboard_component.html":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\scoreboard_component.html","./scoreboard_component.tmp.css":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\scoreboard_component.tmp.css"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\scoreboard_component.tmp.css":[function(require,module,exports){
module.exports = "#kera-scoreboard{position:absolute;right:0;bottom:0;z-index:2;overflow-y:auto;width:400px;border-radius:5px;border:3px solid #ccc;color:#fff}#kera-scoreboard h3{margin:10px 5px 0;font-weight:400;font-size:16px;text-align:center}#kera-scoreboard .tools{position:absolute;right:0;top:0;font-size:0;border-bottom:3px solid #ccc;border-left:3px solid #ccc;border-radius:0 0 0 5px;opacity:0;-webkit-transition:opacity 1s;transition:opacity 1s}#kera-scoreboard .tools a{padding:5px;color:#fff;text-decoration:none;display:inline-block}#kera-scoreboard .tools .icon{vertical-align:bottom}#kera-scoreboard:hover .tools{opacity:1}#kera-scoreboard .sprite-tiles{background-image:url(images/tiles.png);display:inline-block;width:40px;height:40px;zoom:.5}#kera-scoreboard .sprite-flair{background-image:url(images/flair.png);display:inline-block;width:16px;height:16px;vertical-align:middle}#kera-scoreboard .sprite-large{zoom:1}#kera-scoreboard .score-previous{position:absolute;top:15px;right:15px;font-size:20px;color:#888}#kera-scoreboard .team-statistics{font-size:14px;padding:5px}#kera-scoreboard .team-statistics td{padding:5px;border-top:1px solid #ccc}#kera-scoreboard .team-statistics .label{width:30%;white-space:nowrap}#kera-scoreboard .team-statistics .red{text-align:right;width:20%}#kera-scoreboard .team-statistics .blue{width:50%}#kera-scoreboard table{margin-bottom:0;border-spacing:0;width:100%}#kera-scoreboard table th{font-weight:400;text-align:left;padding:3px}#kera-scoreboard table tr{padding:3px 2px}#kera-scoreboard table thead td.separator,#kera-scoreboard table thead th.separator{padding:5px;text-align:center}#kera-scoreboard table thead td.blue,#kera-scoreboard table thead td.red,#kera-scoreboard table thead th.blue,#kera-scoreboard table thead th.red{width:50%}#kera-scoreboard table .score-row{font-size:40px;line-height:40px}#kera-scoreboard table .score-row .sprite-tiles{vertical-align:bottom}#kera-scoreboard table .score-row th{padding:3px;border-bottom:1px solid #ccc}#kera-scoreboard table .team-name-row td{border-bottom:1px solid #ccc}#kera-scoreboard table .player-row p{margin:5px 0}#kera-scoreboard table .player-row .red,#kera-scoreboard table .score-row .red,#kera-scoreboard table .team-name-row .red{text-align:right;width:50%}"
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\textbox_component.html":[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"class":[{"t":2,"r":"class"}]},"f":[{"t":7,"e":"label","a":{"class":"text","for":["kera-checkbox-",{"t":2,"r":"id"}]},"f":[{"t":2,"r":"label"}]}," ",{"t":7,"e":"input","a":{"id":["kera-checkbox-",{"t":2,"r":"id"}],"type":"text","value":[{"t":2,"r":"value"}]}}]}]}
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\textbox_component.js":[function(require,module,exports){
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
},{"./textbox_component.html":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\textbox_component.html"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\index.js":[function(require,module,exports){
tagpro.ready(function() {
	tagproRactive.addComponent(require('./scoreboard'), 'Scoreboard');

	console.log('TagPro Scoreboard initialized.');
});
},{"./scoreboard":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard.js"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard-data.js":[function(require,module,exports){
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

},{"./scoreboard-options":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard-options.js","./util/helpers":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\helpers.js","./util/stats":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\stats.js","./util/storage":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\storage.js"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard-options.js":[function(require,module,exports){
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
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard.html":[function(require,module,exports){
module.exports={"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard-container"},"f":[{"t":4,"n":50,"r":"options.showScoreboard","f":[{"t":7,"e":"Scoreboard"}]}," ",{"t":4,"n":50,"r":"options.showOptions","f":[{"t":7,"e":"Options"}]}," ",{"t":7,"e":"label","a":{"class":["options-toggle ",{"t":2,"x":{"r":["mouseMoved"],"s":"_0?\"\":\"hidden\""}}]},"f":[{"t":7,"e":"input","a":{"type":"checkbox","class":"hide","checked":[{"t":2,"r":"options.showScoreboard"}]}}," ",{"t":7,"e":"span","a":{"class":"icon icon-score-green"}}]}]}]}
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard.js":[function(require,module,exports){
var defaultOptions = require('./scoreboard-options');
var filter = require('./util/object/filter');
var storage = require('./util/storage');
require('./util/ractive-transitions-fly');

var helpers = require('./util/helpers');

// Ractive.defaults.noCssTransform = true; // TODO: Doesn't seem to work?
//Ractive.decorators.movable = require('./decorators/movable');

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
},{"./components/options_component":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\options_component.js","./components/scoreboard_component":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\components\\scoreboard_component.js","./scoreboard-data":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard-data.js","./scoreboard-options":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard-options.js","./scoreboard.html":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard.html","./scoreboard.tmp.css":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard.tmp.css","./util/helpers":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\helpers.js","./util/object/filter":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\object\\filter.js","./util/ractive-transitions-fly":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\ractive-transitions-fly.js","./util/storage":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\storage.js"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\scoreboard.tmp.css":[function(require,module,exports){
module.exports = "#kera-scoreboard-container .icon{background-image:url(data:image/png;base64,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)}#kera-scoreboard-container .icon-close-white{background-position:-5px -5px;width:32px;height:32px}#kera-scoreboard-container .icon-close{background-position:-5px -47px;width:32px;height:32px}#kera-scoreboard-container .icon-gear-white{background-position:-5px -89px;width:32px;height:32px}#kera-scoreboard-container .icon-gear{background-position:-5px -131px;width:32px;height:32px}#kera-scoreboard-container .icon-score-green{background-position:-5px -173px;width:32px;height:32px}#kera-scoreboard-container .icon-score-white{background-position:-5px -215px;width:32px;height:32px}#kera-scoreboard-container .icon-score{background-position:-5px -257px;width:32px;height:32px}#kera-scoreboard-container .icon{display:inline-block}#kera-scoreboard-container .icon-small{zoom:.5}#kera-scoreboard-container .options-toggle{padding:3px;cursor:pointer;position:absolute;right:0;bottom:0;z-index:3;opacity:1;-webkit-transition:opacity 1s;transition:opacity 1s}#kera-scoreboard-container .options-toggle.hidden{opacity:0;display:inherit!important}#kera-scoreboard-container .options-toggle .hide{display:none!important;visibility:hidden}#kera-scoreboard-container .options-toggle .icon{vertical-align:bottom}"
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\getChanges.js":[function(require,module,exports){
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
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\helpers.js":[function(require,module,exports){
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
},{"./stats":"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\stats.js"}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\object\\filter.js":[function(require,module,exports){
module.exports = function filter(obj, predicate) {
    var result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\ractive-transitions-fly.js":[function(require,module,exports){
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
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\stats.js":[function(require,module,exports){
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
},{}],"c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\util\\storage.js":[function(require,module,exports){
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
},{}]},{},["c:\\Projects\\github\\tagpro-ractive-scoreboard\\src\\index.js"]);
