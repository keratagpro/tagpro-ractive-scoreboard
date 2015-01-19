(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Ractive = require('ractive');

var defaultOptions = require('./main-options');
var getChanges = require('./util/getChanges');
var storage = require('./util/storage');
require('./util/ractive-transitions-fly');

var helpers = require('./main-helpers');
var getPlayersByTeam = helpers.getPlayersByTeam;
var getTeamStats = helpers.getTeamStats;
var addPowerupCounts = helpers.addPowerupCounts;

// Ractive.defaults.noCssTransform = true; // TODO: Doesn't seem to work?
Ractive.decorators.movable = require('./decorators/movable');

var ractive = new Ractive({
	debug: true,
	el: '#output',
	template: require('./main.ract'),
	magic: true,
	data: require('./main-data'),
	computed: {
		redPlayers: function() {
			return getPlayersByTeam.call(this, this.get('players'), 1);
		},
		bluePlayers: function() {
			return getPlayersByTeam.call(this, this.get('players'), 2);
		},
		redTeamStats: function() {
			return getTeamStats.call(this, this.get('redPlayers'));
		},
		blueTeamStats: function() {
			return getTeamStats.call(this, this.get('bluePlayers'));
		}
	},
	reloadOptions: function() {
		this.set('options', $.extend(true, {}, defaultOptions, storage.getJson('options')));
	},
	components: {
		'Options': require('./components/options_component'),
		'Scoreboard': require('./components/scoreboard_component')
	},
	oninit: function() {
		this.reloadOptions();

		window.addEventListener('mousemove', this.get('mouseMoveHandler').bind(this));
	}
});

ractive.on('Options.saveOptions', function() {
	var changed = getChanges(defaultOptions, this.get('options')) || null;

	if (changed && changed.showOptions) {
		delete changed.showOptions; // Don't store the Options window setting
	}

	console.log('Saved Settings: ', changed);
	storage.setJson('options', changed);
});

ractive.on('Options.resetOptions', function() {
	storage.setItem('options', null);
	this.reloadOptions();
});

addPowerupCounts(ractive);

window.ractive = ractive;

var style = document.createElement('style');
style.type = "text/css";
style.innerHTML = "#kera-scoreboard-container .icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAEmCAYAAAAUdgKUAAASC0lEQVR4Ae2cbYheRxXHn2eTdNOY0KZQpSVtMYVUqekLomiKRDBQCy0ptrTSSFApEbFKLFRBVxJi/FBbIzUKTV/ih6KUYIxtP2ihkhZDIX2lRiGCiSEWpWm30qRks3lbf/+7Mzfz3HvuvXOf3N3NQ+/A2Zk5c86Z/z3zcmfu2d3uxMREZxDS0CCAFMYWaNMjNTAenW09ebfbtdjTxrMW+MB4tAXa9DxpPXpOeJRVuRCaUxeMdKRbVy+RR7GTpTJDp06dGoHGoFFobZls2CZZpyPdkbAtW87iUT0HMmFmNV2dtoV0oo4mAlpXIJ6ykV0XyEt3TLZSgUxBGLKUY0igKNE2h07kyRCoyoVg1WbIj8pWST85XDlGGVAZplMNYRaoCbYApGRLp4wwZCnHqALqwFpe6gFbArLQ+97DWZAJJpPpNUryMiBlbSUm0yYTk8lMVcoLJYDk3SxVetL3ZmIymV4jIo8EGw1SXZqYTGYEwFCkAmwtkEVAB+Zdb7s5dFdFucKbfp7W8qo5yiazApxvjgRZG6yJyWR6JCV5Cch1ZW0lJtMmE5PJTFXsQgyQGBnbekOrHgDn/isU7w/GoQSgg3HM05xi6M/9g7Of/PKspoGvx+bSkW6VPDK5/b0rZja1X0qyHqlRH5h3fQu0xqhGiQ6MR81VH/WI0yw0MB5tgTY9M1qPth5t2gNN22vnaNMebSN3TXu0naOtR5v2QNP2+p2juvLWvi47ncrrsvmQ1h3aFHTMoaGhEWgMGoVKwzChHck6HelObeSOjhfSiTqaCKjyIy2y6wJ56Y7JVvggYdl0nskMtXrLc+hEngyBqlwIVm2G/ChmC6eOiclk9oLrqdGphjAL1ARbAFKypVPGxGQye6DlKyUAUs/GyOQtT3JMTCazyELALwNS1haYKCyamExmoYnehhJAUVOj19qZmonJZJ7RqSxFgk2nRKVBBExMJjPGWiBTAbYWSJm1MPX7ZgpgTlPRQl+n6wpv+rlay6smJpMZiTQSZG2wJiaTGQG0BOS6srYI0+YctZkV1mKAxMgUdWM6z2QWWYAPgIF4hQ7MoWRgjnka+oE4OPvZO6VXEWvdmN/w28idH48+8oF517dA+xjdUpWB8ai56ksfbYYaB8ajLdCmZ0jr0dajTXugaXvtHG3aowMTuTOB9uuNo0ePXjJr1qwF0j/vvPPe5gD+v35t5fSsY39OKIIxPj6+6vjx4yehCUdjJ06cWBGhmhOxMJmHkn6uIoB7gx7nQb9wPa8nfx3P1gYroLlkoc8JBYxjx45dGVSTIp5bLi+Sp9/mkdvoPLs0lKe/IeSWmWCcoInJZIaWA2U63uY630tnI4C5HP1hhv1p+D1/TKX5Cm8cue3IzKe8FNoEjUJ6KPHN7dHEZDIzQGUQMDvUAfQEtMuVVT/syo9m1DrwH3Vt4y4/KYDY2qK6bFpgTUwmM9MjRtc4wxt8E51cDU8e2kZ5pexkk3hqkwz04NjY2OVeRnVIYO/wPJ9bmKK2p9OnT/+HLyQdFtmb3tjw8PDfKd/r61buFuVTtIl6EmCOuHbZqU4WekuLp98H7bHa6vKcpw9ib5ela2EyJ7OlzNNvhv8J5tiNVrvn+U583coBeDv2LqPtEavd4kUDBcBfnIFPWYY01wCwmwfRRj+msjX/pMs0+phybL6uPCp5D4R5VpGOl9HxTkiTf0m2Hb52Au0Amh5bHamc7BJZedlwbS9YIxRi8eXST+MYWw295oyO0UG66n3ntCU7AvlDGE1HSGXxnO4aL+9zbK2jzW9t+wA8IlBKHlyY20yEMaRtJfESRu5DSZ8acwkZee4N30koIJ7aJBPyfZl2vQj0oN4Zq9UmvSylHvDKPmeyJ3seCjfNmTPnAeq5kxBtAr+Y/E+0e9U0F09tTib3oLS/z1ngEWS+7JQuSJUzhUKgGbkZr5YBfU/oeOonNTw89fwsWtrk5f3kX6Q925wMn9qcjDkimlbI/FHK2DiYM+IZ6iBLTknzdB2GDgBUc/Ww6l7P53oI1153MW1AT9uYbGuOJvPT953DlGWoHibV3cLaLaOUm9yeduKIZWF/fQP1RgCoY5qOZ+avAtGebPjIyEulG75syBb0SW8/zC3nRR1KZIR5dL1yDih7lWcTh5Rt8Lb5EUE+KxLWX1YFmc+RvRo2FJYt9JYwT78Lrx30QCyZOjzs7YGK9tfcuilb9Wm/GnYqN0CPV3gq1Yko6JCzmFvCzRGyndih/7iMATK5CqusQzBX4+9Q1HXkN2zcT2UfQt7Hayvhr0LuTeqPu3OsPLZI8hxQLpW9yiRjWcoq0Z5eRfDuFhbDdgD4q7F/X5ddRSTj5XWNSQ4x2Gr2KiLgAusAarUegjbR0RL4w44/rgudf0j4C5HRQUZghhmBRW6174UvG+nC8zo+Rz7vPJPpNTK5ZOlMV92euU2nydalK7JXQW6tAEne83yOXO7K7duUW5ia/ADxHH1oC1sPKWn+HmXuXpvUavwQ0Fyy0OeEIhh4bgUe9K9EDe1Jhl2LqHayMDXmUaGhA83Li1XmL3KPzJs3778q102WRxsFWhdQkXw00CIDM8nvWb0zCaSq7xZolYfqtrcereuxKvnWo1UeqtveerSux6rkzRN+9qReZaTpdusVagLtt+Pzzz//Eg4jyXWFw8nb2Ml9HenXtnlI7ccYH9JWzZ49+yT5hKMx6iv6sSWPZqmx0xPg3gBULnKnc2pdsNbQ55CbQkFP3CJz1wg8t1xeJE8jd5zsNzrP6qodpiHkcteTUCDrzQSTyQy1gjIdbHOd76U8Amh9Qx0G1NPwe/6YSvMV3jhy25GZT3kptAkahfRQ4pvbo4nJZAbgXHEIMDvUAfQEtMuVVT/syrnrMvxHXdu4csCdFEDKW1SXTQusiclkZoBidI0zvME30cnV8DbR8TbKKz0/m6tNMsg+OHfu3OQrtmRUdzajIndRc5QhvllGoVzQIAssts4DrHNAr87qmM4zmVlN6hjdBzUSuZN5bB2Edhldmc4zJ3OBchK543tTaeTO0s3y8Obt8KYmcsdrNYnckZuROzq/Aw/thsYc7RYvC1J1vrEmkTuKr1vtJi9m6FkMy+h8J6SVmvs0Dl87geawpsdWRyqL90S2Y9lwbS9YI2RiMpnOMsZWQ685o2N0kK563zltyY5A/hC8cCoNied0c4sQW1pMfmvbhzPST+4mJpNJjxha6TqRkftgLfTgwhwZeU6vTzOpTTJm4+SLQA/qnZFERixMoQd6bCGc7HnMyZtOnjz5AI3WSUjgFyOj6JyZXNtiGq0HfZ+zwCPIfIAid3j2SYZGcywXuYMnL+9HRtE5M7m2/TSaI6JphUwSucOzB00jYiKUIy+sCY+hAwDV6j2sum/zuR7CtT8EL5xKVYtpA3raymRbczSZn7JrYjKZHoXL3cLSHtn09rQTR+SOfCYmk5kBqiogdUzTCSjdRkIxHiZ6w5cN2YKaj9wB6noBI9xiRu64IyWRuxB8URnnvMx81BA3H7nj6XUGLZ7sRagK+NjaA5n7qzXK4eQvMDk57DTegBceLxSq35BE7nSEjFGNAgrAJHLHkyZXYRnWIRiPPMh8iz04b2Iep2dPbC6SHQ4ozUXusBdeRbYAbjvkr8b+fV12FTkcyGsKJYcYgO+QbQEOkzX09p4Vap0p6/ao+45W6yFIHtJJatjxx3WhOyPeWYiMDjICM8wILEJOq30vpN1Di89MZws0MUoH2vd6vEDHydYFqI2+Z+TWOkC5fdK6cns95RbQJj9AmJE7Dh3XhiBiygKaSxb6nFAEAw+uwIP+laih1Rw+NyN3PM9Chj+J3HFyP0JEuY3cRQzyzIj0rN6ZgRDXaws0zk/xUq1H430VJ9l6NM5P8VKtR+N9FSc52xLTxWsmk3V6aoe+6REZGI+ac1Te+NbpZYrQzWraMxX2Tv1q6EXzrm8CBeQmDN4CHakw3HTzAvp+BqO5P+gygSJ4BXQPt6y5/BruR5pGY9njlvQWe80x2nKf0SVfBHTSVre7lcJFk5Wp/QnId+nhrqJeyoH2aulj7FEus3zZ6L5E+TPQvyA9iEagLJ2NbmK3DlBdh98C5DKmxMMT3c5F3U73dwC/Bl4V0DJdfdqpXLSxQL+BsR9Ak4C63S+4d9enAfk3+N+DfgoVpTPzrld3/0Sncxu2/lCk6Pmx+6iidekHMq+c5BOdizsTHfODbI+cXbkYkOkncVtkkhvrUTzXucA01E3CMtcFbcdd+byAV1TUw68sagz5sR79Okp/DRWD8ovM2e8H9fspi2JSMvQxgrEe1dAXbVOXsNcu9Z0RY0mizyw0z1IuL5+G9O9m34NkSy+TC5se+p9jdC5kpatg/tA3AFDTJJt+DONNSG+7b0K/ZRFtBuRyyt+FKlPs0KuDfxRYexX+3UHb7ymLwiSgv4a+BLHFdbRraKV/BfoJRAJ6SYod+hNFNhjqU3gxbNcbJjbplampQOqZKpOs4GcsUB0UFgR6adEN9WMpo9e7AdssXga3bP9NlaKGnkHRHPx3qtVb+CfVn/Wyomv6/b3mgDIoH2UOfaig+2H4eg32kzT078QoRnkUQ6zMrlb+1yAtFB39/oynbyXnfd+zmKhm0kRnPRytdi0g7RLPQ3dCO6Aoj8bOUex1fgT5vfDzlDmUdLQVyaPlqdtZi4B050PXQFe4w0zhv/FGpidVAT0VSIevRL/5mwss0PHFC32BfPFkuett+KawL89L8zKgetrPQmEnqeIUFPSmWlJktwjosyhshSrPiUWG++TLqyOWbt9xJi5hmzF4j2W0hPdLbpnfLmlPmgb6S0nR0Fc9tF7N7/DW0z4Yn6TTZ+p76PvsL0ptoIc+9s0U5YmpFDKHfio77Nf2wHi0BdrvEBfptR4t8ky//Naj/XquSK/1aJFn+uWbp6c2ctevO9Fr5+hZOM9UNeeoJDm8XglN6+WOtXEK2mchNY95ANyEwi0o6Ao7nWkBfT9D3/dmOzU9iiBfMpIbpj7eTkvkjn703fQYfa8hzyUTaCClu332i0bQ3GhR31XvKrJYBTTU20/lKHQp9BLUR+SuL126qoqFJiKTP5g7z1F6i6FZRv4wJE/rS5776EWpIFXo6pNl9aLFiFZ4lvRvYW+ERiEl/Tu6A0kp/2MPLP1hSj9pH0r6J6tK6kt9qu8snugNvzhy1yFy1+k/cofu6oKB6GHHvpmKI3eTf1B1XWBVMSVRTNJny2mM3HU6aeSOYbtfFIMSGS3Q22JkY1d9eeSu01nqO2Ox3ejLQS4Pn4ZykTt4UUMfCzQ6ckfHUZE75PTZcjkUFbnLrS634rKrfgX8vZCVXoG5KmiQrigmHUJooxMcJS9c9VEexcAJhpSHN5O+EjcQuTNtp8wooIB8Bg2tUCtpqB8LGu4OylXFyxCICt/Ebk+DEblj6Incdc79yB1Dr5WZi9zBuxXS+75quNcjk0TueOjpj9zRueZndeSucyZyx0P7Q4zyQYjc5c652j0KU+GqZ4jm8PTTFrmjP117ltCnCdYEitKzKGxFo/qcaJqtz3QAT9H3iAmWhtzbKaYb9DZDdZNem5UJozlMsftopfGpFjCHPrJTReHqRe4if9vB6t+815tzxNKeIp6GPpsGZugHBqg59Fm3nwv1gfFoC7Tp6dJ6tPVo0x5o2l47R5v2qHl6ag8lZ+Hmdo6ehfNMVXOOOskryaftcuf61JV5nyv3ZEVANyE1I5E7+tUHubjIHYIzFrmj7zZyp8CYRqAsKahwFLoUqhv1S+wWzdGkMfMjidzBWwbVitwhX6bbf+QOw9shRTdGId1dNW8OuLLqIe2hfl+GF7aXlbXCFWeSjPpSn/r+3/eXkjZyhwdnJnJHx4ranfuRO0BqnmXTWUfucpPWfffJLqYxei5bFFXtI+h/FZLdD0PaBTTkegN6u6WLKRboCgzuDYx648pfgVYFbQIjCmWKyoeQ2+hkS4HG7qNhZA67PUkHibD93Z7W8oo+W7q/uSsXjPXoYcwUeUX8qvYyXd9W6tHYg/NgRO7w2GBE7gDaWOQOW1dBz0N3QjugqKBt7GLCXv5v7uDVjtyho4jdFS7/AEXueOL2b+5wQlHSnqy3WD5ZZ7+8lMlRFM7vgbF5G7kzXemYbeSujdyVzY+m2trIXVOe9HZij3lefsbyFmjTrv8/G796gVFW6usAAAAASUVORK5CYII=)}#kera-scoreboard-container .icon-close-white{background-position:-5px -5px;width:32px;height:32px}#kera-scoreboard-container .icon-close{background-position:-5px -47px;width:32px;height:32px}#kera-scoreboard-container .icon-gear-white{background-position:-5px -89px;width:32px;height:32px}#kera-scoreboard-container .icon-gear{background-position:-5px -131px;width:32px;height:32px}#kera-scoreboard-container .icon-score-green{background-position:-5px -173px;width:32px;height:32px}#kera-scoreboard-container .icon-score-white{background-position:-5px -215px;width:32px;height:32px}#kera-scoreboard-container .icon-score{background-position:-5px -257px;width:32px;height:32px}#kera-scoreboard-container .icon{display:inline-block}#kera-scoreboard-container .icon-small{zoom:.5}#kera-scoreboard-container .options-toggle{padding:3px;cursor:pointer;position:absolute;right:0;bottom:0;z-index:1;opacity:100%;-webkit-transition:opacity 1s;transition:opacity 1s}#kera-scoreboard-container .options-toggle.hidden{opacity:0}#kera-scoreboard-container .options-toggle .hide{display:none!important;visibility:hidden}#kera-scoreboard-container .options-toggle .icon{vertical-align:bottom}";
document.head.appendChild(style);
},{"./components/options_component":4,"./components/scoreboard_component":8,"./decorators/movable":12,"./main-data":13,"./main-helpers":14,"./main-options":15,"./main.ract":16,"./util/getChanges":18,"./util/ractive-transitions-fly":19,"./util/storage":20,"ractive":26}],2:[function(require,module,exports){
var Ractive = require('ractive');

var CheckboxComponent = Ractive.extend({
	isolated: true,
	template: require('./checkbox_component.ract'),
	data: {
		trueClass: 'selected',
		falseClass: '',
		size: 'small'
	}
});

module.exports = CheckboxComponent;
},{"./checkbox_component.ract":3,"ractive":26}],3:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"label","a":{"class":[{"t":2,"r":"class"}," ",{"t":2,"x":{"r":["value",".trueClass",".falseClass"],"s":"_0?_1:_2"}}]},"f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"value"}]}}," ",{"t":7,"e":"span","f":[{"t":2,"r":"label"}]}]}]}
},{}],4:[function(require,module,exports){

var Ractive = require('ractive');

var OptionsComponent = Ractive.extend({
	noCssTransform: true,
	css: "#kera-scoreboard-options{border:3px solid #333;border-radius:3px;max-width:600px;color:#333;background-color:#eee;font-size:14px;margin:0 auto;position:absolute;left:0;right:0;z-index:10/*!\nPure v0.5.0\nCopyright 2014 Yahoo! Inc. All rights reserved.\nLicensed under the BSD License.\nhttps://github.com/yui/pure/blob/master/LICENSE.md\n*/}@media screen and (min-width:35.5em){#kera-scoreboard-options .pure-u-sm-1,#kera-scoreboard-options .pure-u-sm-1-1,#kera-scoreboard-options .pure-u-sm-1-12,#kera-scoreboard-options .pure-u-sm-1-2,#kera-scoreboard-options .pure-u-sm-1-24,#kera-scoreboard-options .pure-u-sm-1-3,#kera-scoreboard-options .pure-u-sm-1-4,#kera-scoreboard-options .pure-u-sm-1-5,#kera-scoreboard-options .pure-u-sm-1-6,#kera-scoreboard-options .pure-u-sm-1-8,#kera-scoreboard-options .pure-u-sm-10-24,#kera-scoreboard-options .pure-u-sm-11-12,#kera-scoreboard-options .pure-u-sm-11-24,#kera-scoreboard-options .pure-u-sm-12-24,#kera-scoreboard-options .pure-u-sm-13-24,#kera-scoreboard-options .pure-u-sm-14-24,#kera-scoreboard-options .pure-u-sm-15-24,#kera-scoreboard-options .pure-u-sm-16-24,#kera-scoreboard-options .pure-u-sm-17-24,#kera-scoreboard-options .pure-u-sm-18-24,#kera-scoreboard-options .pure-u-sm-19-24,#kera-scoreboard-options .pure-u-sm-2-24,#kera-scoreboard-options .pure-u-sm-2-3,#kera-scoreboard-options .pure-u-sm-2-5,#kera-scoreboard-options .pure-u-sm-20-24,#kera-scoreboard-options .pure-u-sm-21-24,#kera-scoreboard-options .pure-u-sm-22-24,#kera-scoreboard-options .pure-u-sm-23-24,#kera-scoreboard-options .pure-u-sm-24-24,#kera-scoreboard-options .pure-u-sm-3-24,#kera-scoreboard-options .pure-u-sm-3-4,#kera-scoreboard-options .pure-u-sm-3-5,#kera-scoreboard-options .pure-u-sm-3-8,#kera-scoreboard-options .pure-u-sm-4-24,#kera-scoreboard-options .pure-u-sm-4-5,#kera-scoreboard-options .pure-u-sm-5-12,#kera-scoreboard-options .pure-u-sm-5-24,#kera-scoreboard-options .pure-u-sm-5-5,#kera-scoreboard-options .pure-u-sm-5-6,#kera-scoreboard-options .pure-u-sm-5-8,#kera-scoreboard-options .pure-u-sm-6-24,#kera-scoreboard-options .pure-u-sm-7-12,#kera-scoreboard-options .pure-u-sm-7-24,#kera-scoreboard-options .pure-u-sm-7-8,#kera-scoreboard-options .pure-u-sm-8-24,#kera-scoreboard-options .pure-u-sm-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-sm-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-sm-1-12,#kera-scoreboard-options .pure-u-sm-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-sm-1-8,#kera-scoreboard-options .pure-u-sm-3-24{width:12.5%}#kera-scoreboard-options .pure-u-sm-1-6,#kera-scoreboard-options .pure-u-sm-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-sm-1-5{width:20%}#kera-scoreboard-options .pure-u-sm-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-sm-1-4,#kera-scoreboard-options .pure-u-sm-6-24{width:25%}#kera-scoreboard-options .pure-u-sm-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-sm-1-3,#kera-scoreboard-options .pure-u-sm-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-sm-3-8,#kera-scoreboard-options .pure-u-sm-9-24{width:37.5%}#kera-scoreboard-options .pure-u-sm-2-5{width:40%}#kera-scoreboard-options .pure-u-sm-10-24,#kera-scoreboard-options .pure-u-sm-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-sm-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-sm-1-2,#kera-scoreboard-options .pure-u-sm-12-24{width:50%}#kera-scoreboard-options .pure-u-sm-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-sm-14-24,#kera-scoreboard-options .pure-u-sm-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-sm-3-5{width:60%}#kera-scoreboard-options .pure-u-sm-15-24,#kera-scoreboard-options .pure-u-sm-5-8{width:62.5%}#kera-scoreboard-options .pure-u-sm-16-24,#kera-scoreboard-options .pure-u-sm-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-sm-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-sm-18-24,#kera-scoreboard-options .pure-u-sm-3-4{width:75%}#kera-scoreboard-options .pure-u-sm-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-sm-4-5{width:80%}#kera-scoreboard-options .pure-u-sm-20-24,#kera-scoreboard-options .pure-u-sm-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-sm-21-24,#kera-scoreboard-options .pure-u-sm-7-8{width:87.5%}#kera-scoreboard-options .pure-u-sm-11-12,#kera-scoreboard-options .pure-u-sm-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-sm-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-sm-1,#kera-scoreboard-options .pure-u-sm-1-1,#kera-scoreboard-options .pure-u-sm-24-24,#kera-scoreboard-options .pure-u-sm-5-5{width:100%}}@media screen and (min-width:48em){#kera-scoreboard-options .pure-u-md-1,#kera-scoreboard-options .pure-u-md-1-1,#kera-scoreboard-options .pure-u-md-1-12,#kera-scoreboard-options .pure-u-md-1-2,#kera-scoreboard-options .pure-u-md-1-24,#kera-scoreboard-options .pure-u-md-1-3,#kera-scoreboard-options .pure-u-md-1-4,#kera-scoreboard-options .pure-u-md-1-5,#kera-scoreboard-options .pure-u-md-1-6,#kera-scoreboard-options .pure-u-md-1-8,#kera-scoreboard-options .pure-u-md-10-24,#kera-scoreboard-options .pure-u-md-11-12,#kera-scoreboard-options .pure-u-md-11-24,#kera-scoreboard-options .pure-u-md-12-24,#kera-scoreboard-options .pure-u-md-13-24,#kera-scoreboard-options .pure-u-md-14-24,#kera-scoreboard-options .pure-u-md-15-24,#kera-scoreboard-options .pure-u-md-16-24,#kera-scoreboard-options .pure-u-md-17-24,#kera-scoreboard-options .pure-u-md-18-24,#kera-scoreboard-options .pure-u-md-19-24,#kera-scoreboard-options .pure-u-md-2-24,#kera-scoreboard-options .pure-u-md-2-3,#kera-scoreboard-options .pure-u-md-2-5,#kera-scoreboard-options .pure-u-md-20-24,#kera-scoreboard-options .pure-u-md-21-24,#kera-scoreboard-options .pure-u-md-22-24,#kera-scoreboard-options .pure-u-md-23-24,#kera-scoreboard-options .pure-u-md-24-24,#kera-scoreboard-options .pure-u-md-3-24,#kera-scoreboard-options .pure-u-md-3-4,#kera-scoreboard-options .pure-u-md-3-5,#kera-scoreboard-options .pure-u-md-3-8,#kera-scoreboard-options .pure-u-md-4-24,#kera-scoreboard-options .pure-u-md-4-5,#kera-scoreboard-options .pure-u-md-5-12,#kera-scoreboard-options .pure-u-md-5-24,#kera-scoreboard-options .pure-u-md-5-5,#kera-scoreboard-options .pure-u-md-5-6,#kera-scoreboard-options .pure-u-md-5-8,#kera-scoreboard-options .pure-u-md-6-24,#kera-scoreboard-options .pure-u-md-7-12,#kera-scoreboard-options .pure-u-md-7-24,#kera-scoreboard-options .pure-u-md-7-8,#kera-scoreboard-options .pure-u-md-8-24,#kera-scoreboard-options .pure-u-md-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-md-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-md-1-12,#kera-scoreboard-options .pure-u-md-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-md-1-8,#kera-scoreboard-options .pure-u-md-3-24{width:12.5%}#kera-scoreboard-options .pure-u-md-1-6,#kera-scoreboard-options .pure-u-md-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-md-1-5{width:20%}#kera-scoreboard-options .pure-u-md-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-md-1-4,#kera-scoreboard-options .pure-u-md-6-24{width:25%}#kera-scoreboard-options .pure-u-md-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-md-1-3,#kera-scoreboard-options .pure-u-md-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-md-3-8,#kera-scoreboard-options .pure-u-md-9-24{width:37.5%}#kera-scoreboard-options .pure-u-md-2-5{width:40%}#kera-scoreboard-options .pure-u-md-10-24,#kera-scoreboard-options .pure-u-md-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-md-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-md-1-2,#kera-scoreboard-options .pure-u-md-12-24{width:50%}#kera-scoreboard-options .pure-u-md-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-md-14-24,#kera-scoreboard-options .pure-u-md-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-md-3-5{width:60%}#kera-scoreboard-options .pure-u-md-15-24,#kera-scoreboard-options .pure-u-md-5-8{width:62.5%}#kera-scoreboard-options .pure-u-md-16-24,#kera-scoreboard-options .pure-u-md-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-md-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-md-18-24,#kera-scoreboard-options .pure-u-md-3-4{width:75%}#kera-scoreboard-options .pure-u-md-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-md-4-5{width:80%}#kera-scoreboard-options .pure-u-md-20-24,#kera-scoreboard-options .pure-u-md-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-md-21-24,#kera-scoreboard-options .pure-u-md-7-8{width:87.5%}#kera-scoreboard-options .pure-u-md-11-12,#kera-scoreboard-options .pure-u-md-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-md-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-md-1,#kera-scoreboard-options .pure-u-md-1-1,#kera-scoreboard-options .pure-u-md-24-24,#kera-scoreboard-options .pure-u-md-5-5{width:100%}}@media screen and (min-width:64em){#kera-scoreboard-options .pure-u-lg-1,#kera-scoreboard-options .pure-u-lg-1-1,#kera-scoreboard-options .pure-u-lg-1-12,#kera-scoreboard-options .pure-u-lg-1-2,#kera-scoreboard-options .pure-u-lg-1-24,#kera-scoreboard-options .pure-u-lg-1-3,#kera-scoreboard-options .pure-u-lg-1-4,#kera-scoreboard-options .pure-u-lg-1-5,#kera-scoreboard-options .pure-u-lg-1-6,#kera-scoreboard-options .pure-u-lg-1-8,#kera-scoreboard-options .pure-u-lg-10-24,#kera-scoreboard-options .pure-u-lg-11-12,#kera-scoreboard-options .pure-u-lg-11-24,#kera-scoreboard-options .pure-u-lg-12-24,#kera-scoreboard-options .pure-u-lg-13-24,#kera-scoreboard-options .pure-u-lg-14-24,#kera-scoreboard-options .pure-u-lg-15-24,#kera-scoreboard-options .pure-u-lg-16-24,#kera-scoreboard-options .pure-u-lg-17-24,#kera-scoreboard-options .pure-u-lg-18-24,#kera-scoreboard-options .pure-u-lg-19-24,#kera-scoreboard-options .pure-u-lg-2-24,#kera-scoreboard-options .pure-u-lg-2-3,#kera-scoreboard-options .pure-u-lg-2-5,#kera-scoreboard-options .pure-u-lg-20-24,#kera-scoreboard-options .pure-u-lg-21-24,#kera-scoreboard-options .pure-u-lg-22-24,#kera-scoreboard-options .pure-u-lg-23-24,#kera-scoreboard-options .pure-u-lg-24-24,#kera-scoreboard-options .pure-u-lg-3-24,#kera-scoreboard-options .pure-u-lg-3-4,#kera-scoreboard-options .pure-u-lg-3-5,#kera-scoreboard-options .pure-u-lg-3-8,#kera-scoreboard-options .pure-u-lg-4-24,#kera-scoreboard-options .pure-u-lg-4-5,#kera-scoreboard-options .pure-u-lg-5-12,#kera-scoreboard-options .pure-u-lg-5-24,#kera-scoreboard-options .pure-u-lg-5-5,#kera-scoreboard-options .pure-u-lg-5-6,#kera-scoreboard-options .pure-u-lg-5-8,#kera-scoreboard-options .pure-u-lg-6-24,#kera-scoreboard-options .pure-u-lg-7-12,#kera-scoreboard-options .pure-u-lg-7-24,#kera-scoreboard-options .pure-u-lg-7-8,#kera-scoreboard-options .pure-u-lg-8-24,#kera-scoreboard-options .pure-u-lg-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-lg-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-lg-1-12,#kera-scoreboard-options .pure-u-lg-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-lg-1-8,#kera-scoreboard-options .pure-u-lg-3-24{width:12.5%}#kera-scoreboard-options .pure-u-lg-1-6,#kera-scoreboard-options .pure-u-lg-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-lg-1-5{width:20%}#kera-scoreboard-options .pure-u-lg-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-lg-1-4,#kera-scoreboard-options .pure-u-lg-6-24{width:25%}#kera-scoreboard-options .pure-u-lg-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-lg-1-3,#kera-scoreboard-options .pure-u-lg-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-lg-3-8,#kera-scoreboard-options .pure-u-lg-9-24{width:37.5%}#kera-scoreboard-options .pure-u-lg-2-5{width:40%}#kera-scoreboard-options .pure-u-lg-10-24,#kera-scoreboard-options .pure-u-lg-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-lg-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-lg-1-2,#kera-scoreboard-options .pure-u-lg-12-24{width:50%}#kera-scoreboard-options .pure-u-lg-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-lg-14-24,#kera-scoreboard-options .pure-u-lg-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-lg-3-5{width:60%}#kera-scoreboard-options .pure-u-lg-15-24,#kera-scoreboard-options .pure-u-lg-5-8{width:62.5%}#kera-scoreboard-options .pure-u-lg-16-24,#kera-scoreboard-options .pure-u-lg-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-lg-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-lg-18-24,#kera-scoreboard-options .pure-u-lg-3-4{width:75%}#kera-scoreboard-options .pure-u-lg-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-lg-4-5{width:80%}#kera-scoreboard-options .pure-u-lg-20-24,#kera-scoreboard-options .pure-u-lg-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-lg-21-24,#kera-scoreboard-options .pure-u-lg-7-8{width:87.5%}#kera-scoreboard-options .pure-u-lg-11-12,#kera-scoreboard-options .pure-u-lg-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-lg-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-lg-1,#kera-scoreboard-options .pure-u-lg-1-1,#kera-scoreboard-options .pure-u-lg-24-24,#kera-scoreboard-options .pure-u-lg-5-5{width:100%}}@media screen and (min-width:80em){#kera-scoreboard-options .pure-u-xl-1,#kera-scoreboard-options .pure-u-xl-1-1,#kera-scoreboard-options .pure-u-xl-1-12,#kera-scoreboard-options .pure-u-xl-1-2,#kera-scoreboard-options .pure-u-xl-1-24,#kera-scoreboard-options .pure-u-xl-1-3,#kera-scoreboard-options .pure-u-xl-1-4,#kera-scoreboard-options .pure-u-xl-1-5,#kera-scoreboard-options .pure-u-xl-1-6,#kera-scoreboard-options .pure-u-xl-1-8,#kera-scoreboard-options .pure-u-xl-10-24,#kera-scoreboard-options .pure-u-xl-11-12,#kera-scoreboard-options .pure-u-xl-11-24,#kera-scoreboard-options .pure-u-xl-12-24,#kera-scoreboard-options .pure-u-xl-13-24,#kera-scoreboard-options .pure-u-xl-14-24,#kera-scoreboard-options .pure-u-xl-15-24,#kera-scoreboard-options .pure-u-xl-16-24,#kera-scoreboard-options .pure-u-xl-17-24,#kera-scoreboard-options .pure-u-xl-18-24,#kera-scoreboard-options .pure-u-xl-19-24,#kera-scoreboard-options .pure-u-xl-2-24,#kera-scoreboard-options .pure-u-xl-2-3,#kera-scoreboard-options .pure-u-xl-2-5,#kera-scoreboard-options .pure-u-xl-20-24,#kera-scoreboard-options .pure-u-xl-21-24,#kera-scoreboard-options .pure-u-xl-22-24,#kera-scoreboard-options .pure-u-xl-23-24,#kera-scoreboard-options .pure-u-xl-24-24,#kera-scoreboard-options .pure-u-xl-3-24,#kera-scoreboard-options .pure-u-xl-3-4,#kera-scoreboard-options .pure-u-xl-3-5,#kera-scoreboard-options .pure-u-xl-3-8,#kera-scoreboard-options .pure-u-xl-4-24,#kera-scoreboard-options .pure-u-xl-4-5,#kera-scoreboard-options .pure-u-xl-5-12,#kera-scoreboard-options .pure-u-xl-5-24,#kera-scoreboard-options .pure-u-xl-5-5,#kera-scoreboard-options .pure-u-xl-5-6,#kera-scoreboard-options .pure-u-xl-5-8,#kera-scoreboard-options .pure-u-xl-6-24,#kera-scoreboard-options .pure-u-xl-7-12,#kera-scoreboard-options .pure-u-xl-7-24,#kera-scoreboard-options .pure-u-xl-7-8,#kera-scoreboard-options .pure-u-xl-8-24,#kera-scoreboard-options .pure-u-xl-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}#kera-scoreboard-options .pure-u-xl-1-24{width:4.1667%}#kera-scoreboard-options .pure-u-xl-1-12,#kera-scoreboard-options .pure-u-xl-2-24{width:8.3333%}#kera-scoreboard-options .pure-u-xl-1-8,#kera-scoreboard-options .pure-u-xl-3-24{width:12.5%}#kera-scoreboard-options .pure-u-xl-1-6,#kera-scoreboard-options .pure-u-xl-4-24{width:16.6667%}#kera-scoreboard-options .pure-u-xl-1-5{width:20%}#kera-scoreboard-options .pure-u-xl-5-24{width:20.8333%}#kera-scoreboard-options .pure-u-xl-1-4,#kera-scoreboard-options .pure-u-xl-6-24{width:25%}#kera-scoreboard-options .pure-u-xl-7-24{width:29.1667%}#kera-scoreboard-options .pure-u-xl-1-3,#kera-scoreboard-options .pure-u-xl-8-24{width:33.3333%}#kera-scoreboard-options .pure-u-xl-3-8,#kera-scoreboard-options .pure-u-xl-9-24{width:37.5%}#kera-scoreboard-options .pure-u-xl-2-5{width:40%}#kera-scoreboard-options .pure-u-xl-10-24,#kera-scoreboard-options .pure-u-xl-5-12{width:41.6667%}#kera-scoreboard-options .pure-u-xl-11-24{width:45.8333%}#kera-scoreboard-options .pure-u-xl-1-2,#kera-scoreboard-options .pure-u-xl-12-24{width:50%}#kera-scoreboard-options .pure-u-xl-13-24{width:54.1667%}#kera-scoreboard-options .pure-u-xl-14-24,#kera-scoreboard-options .pure-u-xl-7-12{width:58.3333%}#kera-scoreboard-options .pure-u-xl-3-5{width:60%}#kera-scoreboard-options .pure-u-xl-15-24,#kera-scoreboard-options .pure-u-xl-5-8{width:62.5%}#kera-scoreboard-options .pure-u-xl-16-24,#kera-scoreboard-options .pure-u-xl-2-3{width:66.6667%}#kera-scoreboard-options .pure-u-xl-17-24{width:70.8333%}#kera-scoreboard-options .pure-u-xl-18-24,#kera-scoreboard-options .pure-u-xl-3-4{width:75%}#kera-scoreboard-options .pure-u-xl-19-24{width:79.1667%}#kera-scoreboard-options .pure-u-xl-4-5{width:80%}#kera-scoreboard-options .pure-u-xl-20-24,#kera-scoreboard-options .pure-u-xl-5-6{width:83.3333%}#kera-scoreboard-options .pure-u-xl-21-24,#kera-scoreboard-options .pure-u-xl-7-8{width:87.5%}#kera-scoreboard-options .pure-u-xl-11-12,#kera-scoreboard-options .pure-u-xl-22-24{width:91.6667%}#kera-scoreboard-options .pure-u-xl-23-24{width:95.8333%}#kera-scoreboard-options .pure-u-xl-1,#kera-scoreboard-options .pure-u-xl-1-1,#kera-scoreboard-options .pure-u-xl-24-24,#kera-scoreboard-options .pure-u-xl-5-5{width:100%}}#kera-scoreboard-options .pure-form input:not([type]),#kera-scoreboard-options .pure-form input[type=text],#kera-scoreboard-options .pure-form input[type=number],#kera-scoreboard-options .pure-form input[type=search],#kera-scoreboard-options .pure-form input[type=tel],#kera-scoreboard-options .pure-form input[type=color],#kera-scoreboard-options .pure-form input[type=password],#kera-scoreboard-options .pure-form input[type=email],#kera-scoreboard-options .pure-form input[type=url],#kera-scoreboard-options .pure-form input[type=date],#kera-scoreboard-options .pure-form input[type=month],#kera-scoreboard-options .pure-form input[type=time],#kera-scoreboard-options .pure-form input[type=datetime],#kera-scoreboard-options .pure-form input[type=datetime-local],#kera-scoreboard-options .pure-form input[type=week],#kera-scoreboard-options .pure-form select,#kera-scoreboard-options .pure-form textarea{padding:.5em .6em;display:inline-block;border:1px solid #ccc;box-shadow:inset 0 1px 3px #ddd;border-radius:4px;box-sizing:border-box}#kera-scoreboard-options .pure-form input[type=color]{padding:.2em .5em}#kera-scoreboard-options .pure-form input:not([type]):focus,#kera-scoreboard-options .pure-form input[type=text]:focus,#kera-scoreboard-options .pure-form input[type=number]:focus,#kera-scoreboard-options .pure-form input[type=search]:focus,#kera-scoreboard-options .pure-form input[type=tel]:focus,#kera-scoreboard-options .pure-form input[type=color]:focus,#kera-scoreboard-options .pure-form input[type=password]:focus,#kera-scoreboard-options .pure-form input[type=email]:focus,#kera-scoreboard-options .pure-form input[type=url]:focus,#kera-scoreboard-options .pure-form input[type=date]:focus,#kera-scoreboard-options .pure-form input[type=month]:focus,#kera-scoreboard-options .pure-form input[type=time]:focus,#kera-scoreboard-options .pure-form input[type=datetime]:focus,#kera-scoreboard-options .pure-form input[type=datetime-local]:focus,#kera-scoreboard-options .pure-form input[type=week]:focus,#kera-scoreboard-options .pure-form select:focus,#kera-scoreboard-options .pure-form textarea:focus{outline:0;border-color:#129FEA}#kera-scoreboard-options .pure-form input[type=file]:focus,#kera-scoreboard-options .pure-form input[type=radio]:focus,#kera-scoreboard-options .pure-form input[type=checkbox]:focus{outline:#129FEA auto 1px}#kera-scoreboard-options .pure-form .pure-checkbox,#kera-scoreboard-options .pure-form .pure-radio{margin:.5em 0;display:block}#kera-scoreboard-options .pure-form input:not([type])[disabled],#kera-scoreboard-options .pure-form input[type=text][disabled],#kera-scoreboard-options .pure-form input[type=number][disabled],#kera-scoreboard-options .pure-form input[type=search][disabled],#kera-scoreboard-options .pure-form input[type=tel][disabled],#kera-scoreboard-options .pure-form input[type=color][disabled],#kera-scoreboard-options .pure-form input[type=password][disabled],#kera-scoreboard-options .pure-form input[type=email][disabled],#kera-scoreboard-options .pure-form input[type=url][disabled],#kera-scoreboard-options .pure-form input[type=date][disabled],#kera-scoreboard-options .pure-form input[type=month][disabled],#kera-scoreboard-options .pure-form input[type=time][disabled],#kera-scoreboard-options .pure-form input[type=datetime][disabled],#kera-scoreboard-options .pure-form input[type=datetime-local][disabled],#kera-scoreboard-options .pure-form input[type=week][disabled],#kera-scoreboard-options .pure-form select[disabled],#kera-scoreboard-options .pure-form textarea[disabled]{cursor:not-allowed;background-color:#eaeded;color:#cad2d3}#kera-scoreboard-options .pure-form input[readonly],#kera-scoreboard-options .pure-form select[readonly],#kera-scoreboard-options .pure-form textarea[readonly]{background:#eee;color:#777;border-color:#ccc}#kera-scoreboard-options .pure-form input:focus:invalid,#kera-scoreboard-options .pure-form select:focus:invalid,#kera-scoreboard-options .pure-form textarea:focus:invalid{color:#b94a48;border-color:#ee5f5b}#kera-scoreboard-options .pure-form input:focus:invalid:focus,#kera-scoreboard-options .pure-form select:focus:invalid:focus,#kera-scoreboard-options .pure-form textarea:focus:invalid:focus{border-color:#e9322d}#kera-scoreboard-options .pure-form input[type=file]:focus:invalid:focus,#kera-scoreboard-options .pure-form input[type=radio]:focus:invalid:focus,#kera-scoreboard-options .pure-form input[type=checkbox]:focus:invalid:focus{outline-color:#e9322d}#kera-scoreboard-options .pure-form select{border:1px solid #ccc;background-color:#fff}#kera-scoreboard-options .pure-form select[multiple]{height:auto}#kera-scoreboard-options .pure-form label{margin:.5em 0 .2em}#kera-scoreboard-options .pure-form fieldset{margin:0;padding:.35em 0 .75em;border:0}#kera-scoreboard-options .pure-form legend{display:block;width:100%;padding:.3em 0;margin-bottom:.3em;color:#333;border-bottom:1px solid #e5e5e5}#kera-scoreboard-options .pure-form-stacked input:not([type]),#kera-scoreboard-options .pure-form-stacked input[type=text],#kera-scoreboard-options .pure-form-stacked input[type=number],#kera-scoreboard-options .pure-form-stacked input[type=search],#kera-scoreboard-options .pure-form-stacked input[type=tel],#kera-scoreboard-options .pure-form-stacked input[type=color],#kera-scoreboard-options .pure-form-stacked input[type=password],#kera-scoreboard-options .pure-form-stacked input[type=email],#kera-scoreboard-options .pure-form-stacked input[type=url],#kera-scoreboard-options .pure-form-stacked input[type=date],#kera-scoreboard-options .pure-form-stacked input[type=month],#kera-scoreboard-options .pure-form-stacked input[type=time],#kera-scoreboard-options .pure-form-stacked input[type=datetime],#kera-scoreboard-options .pure-form-stacked input[type=datetime-local],#kera-scoreboard-options .pure-form-stacked input[type=week],#kera-scoreboard-options .pure-form-stacked label,#kera-scoreboard-options .pure-form-stacked select,#kera-scoreboard-options .pure-form-stacked textarea{display:block;margin:.25em 0}#kera-scoreboard-options .pure-form-aligned .pure-help-inline,#kera-scoreboard-options .pure-form-aligned input,#kera-scoreboard-options .pure-form-aligned select,#kera-scoreboard-options .pure-form-aligned textarea,#kera-scoreboard-options .pure-form-message-inline{display:inline-block;vertical-align:middle}#kera-scoreboard-options .pure-form-aligned textarea{vertical-align:top}#kera-scoreboard-options .pure-form-aligned .pure-control-group{margin-bottom:.5em}#kera-scoreboard-options .pure-form-aligned .pure-control-group label{text-align:right;display:inline-block;vertical-align:middle;width:10em;margin:0 1em 0 0}#kera-scoreboard-options .pure-form-aligned .pure-controls{margin:1.5em 0 0 10em}#kera-scoreboard-options .pure-form .pure-input-rounded,#kera-scoreboard-options .pure-form input.pure-input-rounded{border-radius:2em;padding:.5em 1em}#kera-scoreboard-options .pure-form .pure-group fieldset{margin-bottom:10px}#kera-scoreboard-options .pure-form .pure-group input{display:block;padding:10px;margin:0;border-radius:0;position:relative;top:-1px}#kera-scoreboard-options .pure-form .pure-group input:focus{z-index:2}#kera-scoreboard-options .pure-form .pure-group input:first-child{top:1px;border-radius:4px 4px 0 0}#kera-scoreboard-options .pure-form .pure-group input:last-child{top:-2px;border-radius:0 0 4px 4px}#kera-scoreboard-options .pure-form .pure-group button{margin:.35em 0}#kera-scoreboard-options .pure-form .pure-input-1{width:100%}#kera-scoreboard-options .pure-form .pure-input-2-3{width:66%}#kera-scoreboard-options .pure-form .pure-input-1-2{width:50%}#kera-scoreboard-options .pure-form .pure-input-1-3{width:33%}#kera-scoreboard-options .pure-form .pure-input-1-4{width:25%}#kera-scoreboard-options .pure-form .pure-help-inline,#kera-scoreboard-options .pure-form-message-inline{display:inline-block;padding-left:.3em;color:#666;vertical-align:middle;font-size:.875em}#kera-scoreboard-options .pure-form-message{display:block;color:#666;font-size:.875em}@media only screen and (max-width:480px){#kera-scoreboard-options .pure-form button[type=submit]{margin:.7em 0 0}#kera-scoreboard-options .pure-form input:not([type]),#kera-scoreboard-options .pure-form input[type=text],#kera-scoreboard-options .pure-form input[type=number],#kera-scoreboard-options .pure-form input[type=search],#kera-scoreboard-options .pure-form input[type=tel],#kera-scoreboard-options .pure-form input[type=color],#kera-scoreboard-options .pure-form input[type=password],#kera-scoreboard-options .pure-form input[type=email],#kera-scoreboard-options .pure-form input[type=url],#kera-scoreboard-options .pure-form input[type=date],#kera-scoreboard-options .pure-form input[type=month],#kera-scoreboard-options .pure-form input[type=time],#kera-scoreboard-options .pure-form input[type=datetime],#kera-scoreboard-options .pure-form input[type=datetime-local],#kera-scoreboard-options .pure-form input[type=week],#kera-scoreboard-options .pure-form label{margin-bottom:.3em;display:block}#kera-scoreboard-options .pure-group input:not([type]),#kera-scoreboard-options .pure-group input[type=text],#kera-scoreboard-options .pure-group input[type=number],#kera-scoreboard-options .pure-group input[type=search],#kera-scoreboard-options .pure-group input[type=tel],#kera-scoreboard-options .pure-group input[type=color],#kera-scoreboard-options .pure-group input[type=password],#kera-scoreboard-options .pure-group input[type=email],#kera-scoreboard-options .pure-group input[type=url],#kera-scoreboard-options .pure-group input[type=date],#kera-scoreboard-options .pure-group input[type=month],#kera-scoreboard-options .pure-group input[type=time],#kera-scoreboard-options .pure-group input[type=datetime],#kera-scoreboard-options .pure-group input[type=datetime-local],#kera-scoreboard-options .pure-group input[type=week]{margin-bottom:0}#kera-scoreboard-options .pure-form-aligned .pure-control-group label{margin-bottom:.3em;text-align:left;display:block;width:100%}#kera-scoreboard-options .pure-form-aligned .pure-controls{margin:1.5em 0 0}#kera-scoreboard-options .pure-form .pure-help-inline,#kera-scoreboard-options .pure-form-message,#kera-scoreboard-options .pure-form-message-inline{display:block;font-size:.75em;padding:.2em 0 .8em}}#kera-scoreboard-options .pure-g{letter-spacing:-.31em;word-spacing:-.43em;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;font-family:FreeSans,Arimo,\"Droid Sans\",Helvetica,Arial,sans-serif}#kera-scoreboard-options .pure-g [class*=pure-u]{font-family:sans-serif}#kera-scoreboard-options .pure-g [class*=pure-u] input[type=text]{width:90%}#kera-scoreboard-options h3{font-size:18px;margin:0;padding:4px 8px;border-bottom:1px solid #333}#kera-scoreboard-options h3 .icon{margin-right:5px}#kera-scoreboard-options h4{font-size:16px;margin:0 0 5px;padding:15px 0 3px;border-bottom:1px solid #ccc}#kera-scoreboard-options .icon{vertical-align:middle}#kera-scoreboard-options .options-content{padding:10px}#kera-scoreboard-options .options-content a{background-color:#e7e7e7;border-radius:3px;display:inline-block;padding:10px;text-decoration:none;color:#333;-webkit-transition:background-color .3s;transition:background-color .3s}#kera-scoreboard-options .options-content a:hover{background-color:#b9b9b9}#kera-scoreboard-options .hide{display:none!important;visibility:hidden}#kera-scoreboard-options .close{text-decoration:none;padding:10px;position:absolute;right:0;top:0}",
	template: require('./options_component.ract'),
	components: {
		'Textbox': require('./textbox_component'),
		'Checkbox': require('./checkbox_component')
	}
});

module.exports = OptionsComponent;
},{"./checkbox_component":2,"./options_component.ract":5,"./textbox_component":10,"ractive":26}],5:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard-options"},"t0":{"n":"fly","a":[{"x":0,"y":-500,"opacity":1}]},"o":{"n":"movable","a":"document.body"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"close","title":"Close Options"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showOptions\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-small icon-close"}}]}," ",{"t":7,"e":"h3","a":{"class":"drag-handle"},"f":[{"t":7,"e":"span","a":{"class":"icon icon-score"}}," TagPro Scoreboard Options (",{"t":7,"e":"a","a":{"href":"https://github.com/keratagpro/tagpro-scoreboard"},"f":["github"]},")"]}," ",{"t":7,"e":"div","a":{"class":"options-content"},"f":[{"t":7,"e":"form","a":{"class":"pure-form"},"f":[{"t":7,"e":"Checkbox","a":{"class":"pure-checkbox","label":"Show Scoreboard","value":[{"t":2,"r":"options.showScoreboard"}]}}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Team info"]}," ",{"t":7,"e":"Checkbox","a":{"label":"Score","value":[{"t":2,"r":"options.showScore"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Team names","value":[{"t":2,"r":"options.showTeams"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Players","value":[{"t":2,"r":"options.showPlayers"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Statistics","value":[{"t":2,"r":"options.showStatistics"}]}}]}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":["Player info"]}," ",{"t":7,"e":"Checkbox","a":{"label":"Powerups","value":[{"t":2,"r":"options.showPowerups"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Authentication","value":[{"t":2,"r":"options.showAuth"}]}}," ",{"t":7,"e":"Checkbox","a":{"label":"Flair","value":[{"t":2,"r":"options.showFlair"}]}}]}," ",{"t":7,"e":"fieldset","a":{"class":"pure-form-stacked"},"f":[{"t":7,"e":"legend","f":["Advanced"]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"id":"name-red","label":"Red Team Name","value":[{"t":2,"r":"options.teamNames.red"}]}}," ",{"t":7,"e":"Textbox","a":{"id":"name-blue","label":"Blue Team Name","value":[{"t":2,"r":"options.teamNames.blue"}]}}]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"id":"score-red","label":"Red Team Score","value":[{"t":2,"r":"options.previousScores.red"}]}}," ",{"t":7,"e":"Textbox","a":{"id":"score-blue","label":"Blue Team Score","value":[{"t":2,"r":"options.previousScores.blue"}]}}]}," ",{"t":7,"e":"div","a":{"class":"pure-g"},"f":[{"t":7,"e":"Textbox","a":{"label":"Scoreboard Background Color","value":[{"t":2,"r":"backgroundColor"}]}}]}]}," ",{"t":7,"e":"a","a":{"href":"#"},"v":{"click":"saveOptions"},"f":["Save Locally"]}," ",{"t":7,"e":"a","a":{"href":"#"},"v":{"click":"resetOptions"},"f":["Reset"]}]}]}]}]}
},{}],6:[function(require,module,exports){

var Ractive = require('ractive');

var PlayerComponent = Ractive.extend({
	noCssTransform: true,
	css: "#kera-scoreboard .player-row .icons{position:absolute;font-size:0}#kera-scoreboard .player-row .dead{color:red!important}#kera-scoreboard .player-row .auth{color:#bfff00}#kera-scoreboard .player-row .name{padding:0 3px}#kera-scoreboard .player-row .red .icons{left:3px}#kera-scoreboard .player-row .red .flair{float:right;margin-left:4px}#kera-scoreboard .player-row .blue .icons{right:3px}#kera-scoreboard .player-row .blue .flair{float:left;margin-right:4px}",
	template: require('./player_component.ract')
});

module.exports = PlayerComponent;
},{"./player_component.ract":7,"ractive":26}],7:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"span","a":{"class":"icons"},"f":[{"t":4,"n":50,"r":"flag","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getFlag","flag"],"s":"_0(_1)"}},";"]}}]}," ",{"t":4,"n":50,"r":"options.showPowerups","f":[{"t":4,"n":50,"r":"grip","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"grip\")"}},";"]}}]}," ",{"t":4,"n":50,"r":"bomb","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"bomb\")"}},";"]}}]}," ",{"t":4,"n":50,"r":"tagpro","f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-small","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"tagpro\")"}},";"]}}]}]}]}," ",{"t":4,"n":50,"r":"options.showFlair","f":[{"t":7,"e":"span","a":{"class":"flair sprite-flair","style":["background-position: ",{"t":2,"x":{"r":["getFlair","flair"],"s":"_0(_1)"}}]}}]},{"t":7,"e":"span","a":{"class":["name ",{"t":2,"x":{"r":["dead"],"s":"_0?\"dead\":\"\""}}," ",{"t":2,"x":{"r":["options.showAuth","auth"],"s":"_0&&_1?\"auth\":\"\""}}],"title":[{"t":2,"r":"degree"}]},"f":[{"t":2,"r":"name"}]}," ",{"t":4,"n":50,"r":"options.showDegree","f":[{"t":7,"e":"span","a":{"class":"degree"},"f":["(",{"t":2,"r":"degree"},"&deg;)"]}]}]}
},{}],8:[function(require,module,exports){

var Ractive = require('ractive');

var ScoreboardComponent = Ractive.extend({
	noCssTransform: true,
	css: "#kera-scoreboard{position:absolute;right:0;bottom:0;z-index:2;width:400px;border-radius:5px;border:3px solid #ccc;color:#fff}#kera-scoreboard h3{margin:10px 5px 0;font-weight:400;font-size:16px;text-align:center}#kera-scoreboard .tools{position:absolute;right:0;top:0;font-size:0;border-bottom:3px solid #ccc;border-left:3px solid #ccc;border-radius:0 0 0 5px;opacity:0;-webkit-transition:opacity 1s;transition:opacity 1s}#kera-scoreboard .tools a{padding:5px;color:#fff;text-decoration:none;display:inline-block}#kera-scoreboard .tools .icon{vertical-align:bottom}#kera-scoreboard:hover .tools{opacity:1}#kera-scoreboard .sprite-tiles{background-image:url(/images/tiles.png);display:inline-block;width:40px;height:40px;zoom:.5}#kera-scoreboard .sprite-flair{background-image:url(/images/flair.png);display:inline-block;width:16px;height:16px;vertical-align:middle}#kera-scoreboard .sprite-large{zoom:1}#kera-scoreboard .score-previous{position:absolute;top:15px;right:15px;font-size:20px;color:#888}#kera-scoreboard .team-statistics{font-size:14px;padding:5px}#kera-scoreboard .team-statistics td{padding:5px;border-top:1px solid #ccc}#kera-scoreboard .team-statistics .label{width:30%;white-space:nowrap}#kera-scoreboard .team-statistics .red{text-align:right;width:20%}#kera-scoreboard .team-statistics .blue{width:50%}#kera-scoreboard>table{margin-bottom:0;border-spacing:0;width:100%}#kera-scoreboard>table th{font-weight:400;text-align:left;padding:3px}#kera-scoreboard>table tr{padding:3px 2px}#kera-scoreboard>table thead td.separator,#kera-scoreboard>table thead th.separator{padding:5px;text-align:center}#kera-scoreboard>table thead td.blue,#kera-scoreboard>table thead td.red,#kera-scoreboard>table thead th.blue,#kera-scoreboard>table thead th.red{width:50%}#kera-scoreboard>table .score-row{font-size:40px;line-height:40px}#kera-scoreboard>table .score-row .sprite-tiles{vertical-align:bottom}#kera-scoreboard>table .score-row th{padding:3px;border-bottom:1px solid #ccc}#kera-scoreboard>table .team-name-row td{border-bottom:1px solid #ccc}#kera-scoreboard>table .player-row p{margin:5px 0}#kera-scoreboard>table .player-row .red,#kera-scoreboard>table .score-row .red,#kera-scoreboard>table .team-name-row .red{text-align:right}",
	template: require('./scoreboard_component.ract'),
	data: {
		formatTime: function(sec) {
			var hours = parseInt(sec / 3600, 10) % 24;
			var minutes = parseInt(sec / 60, 10) % 60;
			var seconds = sec % 60;

			var result = (minutes < 10 ? "0" + minutes : minutes) + ":" +
				(seconds  < 10 ? "0" + seconds : seconds);

			if (hours > 0)
				result = (hours < 10 ? "0" + hours : hours) + ":" + result;

			return result;
		}
	},
	components: {
		'Player': require('./player_component')
	}
});

module.exports = ScoreboardComponent;
},{"./player_component":6,"./scoreboard_component.ract":9,"ractive":26}],9:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard","style":["background-color: ",{"t":2,"r":"backgroundColor"}]},"t0":{"n":"fly","a":[{"x":0,"y":500}]},"f":[{"t":7,"e":"div","a":{"class":"tools"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"settings","title":"Settings"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showOptions\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-gear-white"},"f":["&nbsp;"]}]}," ",{"t":7,"e":"a","a":{"href":"#","class":"close","title":"Close Scoreboard"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"options.showScoreboard\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"icon icon-close-white"},"f":["&nbsp;"]}]}]}," ",{"t":4,"n":50,"x":{"r":["options.showScore","options.showTeams"],"s":"_0||_1"},"f":[{"t":4,"n":50,"x":{"r":["options.previousScores.red","options.previousScores.blue"],"s":"_0||_1"},"f":[{"t":7,"e":"div","a":{"class":"score-previous"},"f":[{"t":2,"x":{"r":["options.previousScores.red","score.r"],"s":"(parseInt(_0)||0)+_1"}}," - ",{"t":2,"x":{"r":["options.previousScores.blue","score.b"],"s":"(parseInt(_0)||0)+_1"}}]}]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"thead","f":[{"t":4,"n":50,"r":"options.showScore","f":[{"t":7,"e":"tr","a":{"class":"score-row"},"f":[{"t":7,"e":"th","a":{"class":"red"},"f":[{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-large","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"redball\")"}},";"]}}," ",{"t":7,"e":"span","a":{"class":"score"},"f":[{"t":2,"r":"score.r"}]}]}," ",{"t":7,"e":"th","a":{"class":"separator"},"f":["-"]}," ",{"t":7,"e":"th","a":{"class":"blue"},"f":[{"t":7,"e":"span","a":{"class":"score"},"f":[{"t":2,"r":"score.b"}]}," ",{"t":7,"e":"span","a":{"class":"sprite-tiles sprite-large","style":["background-position: ",{"t":2,"x":{"r":["getSprite"],"s":"_0(\"blueball\")"}},";"]}}]}]}]}," ",{"t":4,"n":50,"r":"options.showTeams","f":[{"t":7,"e":"tr","a":{"class":"team-name-row"},"f":[{"t":7,"e":"td","a":{"class":"team red"},"f":[{"t":2,"r":"options.teamNames.red"}]}," ",{"t":7,"e":"td","a":{"class":"separator"},"f":["vs"]}," ",{"t":7,"e":"td","a":{"class":"team blue"},"f":[{"t":2,"r":"options.teamNames.blue"}]}]}]}]}]}]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tbody","f":[{"t":4,"n":50,"r":"options.showPlayers","f":[{"t":7,"e":"tr","a":{"class":"player-row"},"f":[{"t":7,"e":"td","a":{"class":"player red"},"f":[{"t":4,"r":"redPlayers","i":"id","f":[{"t":7,"e":"p","f":[{"t":7,"e":"Player"}]}]}]}," ",{"t":7,"e":"td","a":{"class":"separator"}}," ",{"t":7,"e":"td","a":{"class":"player blue"},"f":[{"t":4,"r":"bluePlayers","i":"id","f":[{"t":7,"e":"p","f":[{"t":7,"e":"Player"}]}]}]}]}]}]}]}," ",{"t":4,"n":50,"r":"options.showStatistics","f":[{"t":7,"e":"h3","f":["Team Statistics"]}," ",{"t":7,"e":"table","a":{"class":"team-statistics"},"f":[{"t":4,"r":"options.selectedStats","i":"key","f":[{"t":7,"e":"tr","a":{"class":[{"t":2,"r":"key"}]},"f":[{"t":7,"e":"td","a":{"class":"label"},"f":[{"t":2,"r":"label"}]}," ",{"t":7,"e":"td","a":{"class":"red"},"f":[{"t":2,"x":{"r":["time","formatTime","key","redTeamStats"],"s":"_0?_1(_3[_2]):_3[_2]"}}]}," ",{"t":7,"e":"td","a":{"class":"blue"},"f":[{"t":2,"x":{"r":["time","formatTime","key","blueTeamStats"],"s":"_0?_1(_3[_2]):_3[_2]"}}]}]}]}]}]}]}]}
},{}],10:[function(require,module,exports){
var Ractive = require('ractive');

var TextBoxComponent = Ractive.extend({
	isolated: true,
	template: require('./textbox_component.ract'),
	data: {
		'class': 'pure-u-sm-1-2'
	}
});

module.exports = TextBoxComponent;
},{"./textbox_component.ract":11,"ractive":26}],11:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"div","a":{"class":[{"t":2,"r":"class"}]},"f":[{"t":7,"e":"label","a":{"class":"text","for":["kera-checkbox-",{"t":2,"r":"id"}]},"f":[{"t":2,"r":"label"}]}," ",{"t":7,"e":"input","a":{"id":["kera-checkbox-",{"t":2,"r":"id"}],"type":"text","value":[{"t":2,"r":"value"}]}}]}]}
},{}],12:[function(require,module,exports){
(function (global){
var Ractive = require('ractive');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('jquery-ui/draggable');
require('jquery-ui/resizable');

var movable = function(elem, options) {
	var opts = options || {};

	opts.handleClass = options.handle || 'drag-handle';
	opts.callback = options.callback;

	return {
		teardown: function() {
			
		}
	};
};

module.exports = movable;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery-ui/draggable":22,"jquery-ui/resizable":24,"ractive":26}],13:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var tagpro = (typeof window !== "undefined" ? window.tagpro : typeof global !== "undefined" ? global.tagpro : null);

var storage = require('./util/storage');

var mouseMoveTimeout;
var defaultOptions = require('./main-options');

module.exports = {
	defaultOptions: defaultOptions,
	mouseMoved: false,
	players: tagpro.players,
	score: tagpro.score,
	backgroundColor: '#000',
	getSprite: function(sprite) {
		var width = 40;
		var height = 40;
		var tile = tagpro.tiles[sprite];
		var position = (-tile.x * width) + "px " + (-tile.y * height) + "px";
		return position;
	},
	getFlag: function(flag) {
		var sprite = this.get('getSprite');
		return sprite(flag == 1 ? 'redflag' : flag == 2 ? 'blueflag' : 'yellowflag');
	},
	getFlair: function(flair) {
		var x = flair ? flair.x : 10;
		var y = flair ? flair.y : 10;
		var width = 16;
		var height = 16;
		var position = (-x * width) + "px " + (-y * height) + "px";
		return position;
	},
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./main-options":15,"./util/storage":20}],14:[function(require,module,exports){
var filter = require('./util/filter');

var powerups = {
	grip: { label: 'Grip' },
	speed: { label: 'Speed' },
	bomb: { label: 'Rolling Bomb' },
	tagpro: { label: 'Tagpro' }
}

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

function getTeamStats(players) {
	var stats = Object.keys(summables);
	var powerupCounts = Object.keys(powerups).map(function(item) { return item + 'Count'; });
	Array.prototype.push.apply(stats, powerupCounts);

	var map = {};

	stats.forEach(function(stat) {
		map[stat] = Object.keys(players).reduce(function(sum, key) {
			if (!players[key]) {
				return sum;
			}

			return sum + (players[key][stat] || 0);
		}, 0);
	});

	map.powerups = powerupCounts.reduce(function(sum, key) {
		return sum + map[key];
	}, 0);

	return map;
}

function getPlayersByTeam(players, team) {
	var players = this.get('players');

	return filter(players, function(item) {
		return item.team === team;
	});
}

function addPowerupCounts(ractive) {
	var keys = Object.keys(powerups);

	var keypaths = keys.map(function(item) {
		return 'players.*.' + item;
	}).join(' ');

	ractive.observe(keypaths, function(val, old, keypath) {
		if (val && !old) {
			ractive.set(keypath + 'Count', (ractive.get(keypath + 'Count') || 0) + 1);
		}
	});
}

module.exports = {
	getTeamStats: getTeamStats,
	getPlayersByTeam: getPlayersByTeam,
	addPowerupCounts: addPowerupCounts
};
},{"./util/filter":17}],15:[function(require,module,exports){
(function (global){
var tagpro = (typeof window !== "undefined" ? window.tagpro : typeof global !== "undefined" ? global.tagpro : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"div","a":{"id":"kera-scoreboard-container"},"f":[{"t":4,"n":50,"r":"options.showScoreboard","f":[{"t":7,"e":"Scoreboard"}]}," ",{"t":4,"n":50,"r":"options.showOptions","f":[{"t":7,"e":"Options"}]}," ",{"t":7,"e":"label","a":{"class":["options-toggle ",{"t":2,"x":{"r":["mouseMoved"],"s":"_0?\"\":\"hidden\""}}]},"f":[{"t":7,"e":"input","a":{"type":"checkbox","class":"hide","checked":[{"t":2,"r":"options.showScoreboard"}]}}," ",{"t":7,"e":"span","a":{"class":"icon icon-score-green"}}]}]}]}
},{}],17:[function(require,module,exports){
module.exports = function filter(obj, predicate) {
    var result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};
},{}],18:[function(require,module,exports){
module.exports = function getChanges(prev, now) {
	var changes = {}, prop, pc;
	
	for (prop in now) {
		if (!prev || prev[prop] !== now[prop]) {
			if (typeof now[prop] == "object") {
				if(c = getChanges(prev[prop], now[prop]))
					changes[prop] = c;
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
},{}],19:[function(require,module,exports){
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
},{"ractive":26}],20:[function(require,module,exports){
function getItem(name) {
	return GM_getValue(name);
};

function setItem(name, value) {
	GM_setValue(name, value);
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
}
},{}],21:[function(require,module,exports){
(function (global){
var jQuery = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

/*!
 * jQuery UI Core 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(require,module,exports){
(function (global){
var jQuery = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('./core');
require('./mouse');
require('./widget');

/*!
 * jQuery UI Draggable 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.10.4",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
			this.element[0].style.position = "relative";
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent();
		this.offsetParent = this.helper.offsetParent();
		this.offsetParentCssPosition = this.offsetParent.css( "position" );

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		//Reset scroll cache
		this.offset.scroll = false;

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.offsetParentCssPosition === "fixed" ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		if ( this.options.helper === "original" && !$.contains( this.element[ 0 ].ownerDocument, this.element[ 0 ] ) ) {
			return false;
		}

		if((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);

		if(!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		if(helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		//This needs to be actually done for all browsers, since pageX/pageY includes this information
		//Ugly IE fix
		if((this.offsetParent[0] === document.body) ||
			(this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var over, c, ce,
			o = this.options;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if( !ce ) {
			return;
		}

		over = c.css( "overflow" ) !== "hidden";

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ) ,
			( over ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) - ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) - this.helperProportions.width - this.margins.left - this.margins.right,
			( over ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) - ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) - this.helperProportions.height - this.margins.top  - this.margins.bottom
		];
		this.relative_container = c;
	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top ) * mod )
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left ) * mod )
			)
		};

	},

	_generatePosition: function(event) {

		var containment, co, top, left,
			o = this.options,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent,
			pageX = event.pageX,
			pageY = event.pageY;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( this.originalPosition ) {
			if ( this.containment ) {
				if ( this.relative_container ){
					co = this.relative_container.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				}
				else {
					containment = this.containment;
				}

				if(event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		//The absolute position has to be recalculated after plugins
		if(type === "drag") {
			this.positionAbs = this._convertPositionTo("absolute");
		}
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("ui-draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, "ui-sortable");
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("ui-draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: "valid/invalid"
				if(this.shouldRevert) {
					this.instance.options.revert = this.shouldRevert;
				}

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper === "original") {
					this.instance.currentItem.css({ top: "auto", left: "auto" });
				}

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("ui-draggable"), that = this;

		$.each(inst.sortables, function() {

			var innermostIntersecting = false,
				thisSortable = this;

			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if (this !== thisSortable &&
						this.instance._intersectsWith(this.instance.containerCache) &&
						$.contains(thisSortable.instance.element[0], this.instance.element[0])
					) {
						innermostIntersecting = false;
					}
					return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) {
					this.instance._mouseDrag(event);
				}

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger("out", event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) {
						this.instance.placeholder.remove();
					}

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			}

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function() {
		var t = $("body"), o = $(this).data("ui-draggable").options;
		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function() {
		var o = $(this).data("ui-draggable").options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function() {
		var i = $(this).data("ui-draggable");
		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
			i.overflowOffset = i.scrollParent.offset();
		}
	},
	drag: function( event ) {

		var i = $(this).data("ui-draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {

			if(!o.axis || o.axis !== "x") {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
				}
			}

			if(!o.axis || o.axis !== "y") {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if(!o.axis || o.axis !== "x") {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if(!o.axis || o.axis !== "y") {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function() {

		var i = $(this).data("ui-draggable"),
			o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if(this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function(event, ui) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			inst = $(this).data("ui-draggable"),
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if(inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
				}
			}

			first = (ts || bs || ls || rs);

			if(o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
				}
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function() {
		var min,
			o = this.data("ui-draggable").options,
			group = $.makeArray($(o.stack)).sort(function(a,b) {
				return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

})(jQuery);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./core":21,"./mouse":23,"./widget":25}],23:[function(require,module,exports){
(function (global){
var jQuery = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('./widget');

/*!
 * jQuery UI Mouse 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./widget":25}],24:[function(require,module,exports){
(function (global){
var jQuery = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('./core');
require('./mouse');
require('./widget');

/*!
 * jQuery UI Resizable 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/resizable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

function num(v) {
	return parseInt(v, 10) || 0;
}

function isNumber(value) {
	return !isNaN(parseInt(value, 10));
}

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.10.4",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},
	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"ui-resizable", this.element.data("ui-resizable")
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw" });
		if(this.handles.constructor === String) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for(i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "ui-resizable-"+handle;
				axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				//Insert into internal handles object and append to element
				this.handles[handle] = ".ui-resizable-"+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for(i in this.handles) {

				if(this.handles[i].constructor === String) {
					this.handles[i] = $(this.handles[i], this.element).show();
				}

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					axis = $(this.handles[i], this.element);

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length) {
					continue;
				}
			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $(".ui-resizable-handle", this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
			};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			iniPos = this.element.position(),
			el = this.element;

		this.resizing = true;

		// bugfix for http://dev.jquery.com/ticket/1749
		if ( (/absolute/).test( el.css("position") ) ) {
			el.css({ position: "absolute", top: el.css("top"), left: el.css("left") });
		} else if (el.is(".ui-draggable")) {
			el.css({ position: "absolute", top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		curleft = num(this.helper.css("left"));
		curtop = num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: this.helper.width(), height: this.helper.height() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio === "number") ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".ui-resizable-" + this.axis).css("cursor");
		$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var data,
			el = this.helper, props = {},
			smp = this.originalMousePosition,
			a = this.axis,
			prevTop = this.position.top,
			prevLeft = this.position.left,
			prevWidth = this.size.width,
			prevHeight = this.size.height,
			dx = (event.pageX-smp.left)||0,
			dy = (event.pageY-smp.top)||0,
			trigger = this._change[a];

		if (!trigger) {
			return false;
		}

		// Calculate the attrs that will be change
		data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio(data, event);
		}

		data = this._respectSize(data, event);

		this._updateCache(data);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		if (this.position.top !== prevTop) {
			props.top = this.position.top + "px";
		}
		if (this.position.left !== prevLeft) {
			props.left = this.position.left + "px";
		}
		if (this.size.width !== prevWidth) {
			props.width = this.size.width + "px";
		}
		if (this.size.height !== prevHeight) {
			props.height = this.size.height + "px";
		}
		el.css(props);

		if (!this._helper && this._proportionallyResizeElements.length) {
			this._proportionallyResize();
		}

		// Call the user callback if the element was resized
		if ( ! $.isEmptyObject(props) ) {
			this._trigger("resize", event, this.ui());
		}

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if(this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/textarea/i).test(pr[0].nodeName);
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) };
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null;
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate) {
				this.element.css($.extend(s, { top: top, left: left }));
			}

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) {
				this._proportionallyResize();
			}
		}

		$("body").css("cursor", "auto");

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) {
			this.helper.remove();
		}

		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if(pMinHeight > b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if(pMaxWidth < b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if(pMaxHeight < b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		this.offset = this.helper.offset();
		if (isNumber(data.left)) {
			this.position.left = data.left;
		}
		if (isNumber(data.top)) {
			this.position.top = data.top;
		}
		if (isNumber(data.height)) {
			this.size.height = data.height;
		}
		if (isNumber(data.width)) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (isNumber(data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (isNumber(data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// fixing jump error on top/left - bug #2330
		if (!data.width && !data.height && !data.left && data.top) {
			data.top = null;
		} else if (!data.width && !data.height && !data.top && data.left) {
			data.left = null;
		}

		return data;
	},

	_proportionallyResize: function() {

		if (!this._proportionallyResizeElements.length) {
			return;
		}

		var i, j, borders, paddings, prel,
			element = this.helper || this.element;

		for ( i=0; i < this._proportionallyResizeElements.length; i++) {

			prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				this.borderDif = [];
				borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
				paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];

				for ( j = 0; j < borders.length; j++ ) {
					this.borderDif[ j ] = ( parseInt( borders[ j ], 10 ) || 0 ) + ( parseInt( paddings[ j ], 10 ) || 0 );
				}
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() - 1,
				height: this.element.outerHeight() - 1,
				position: "absolute",
				left: this.elementOffset.left +"px",
				top: this.elementOffset.top +"px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n !== "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "animate", {

	stop: function( event ) {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/textarea/i).test(pr[0].nodeName),
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null,
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css("width"), 10),
						height: parseInt(that.element.css("height"), 10),
						top: parseInt(that.element.css("top"), 10),
						left: parseInt(that.element.css("left"), 10)
					};

					if (pr && pr.length) {
						$(pr[0]).css({ width: data.width, height: data.height });
					}

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $(this).data("ui-resizable"),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;

		if (!ce) {
			return;
		}

		that.containerElement = $(ce);

		if (/document/.test(oc) || oc === document) {
			that.containerOffset = { left: 0, top: 0 };
			that.containerPosition = { left: 0, top: 0 };

			that.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			element = $(ce);
			p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw );
			height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			that.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset, cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = { top:0, left:0 }, ce = that.containerElement;

		if (ce[0] !== document && (/static/).test(ce.css("position"))) {
			cop = co;
		}

		if (cp.left < (that._helper ? co.left : 0)) {
			that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (that._helper ? co.top : 0)) {
			that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		that.offset.left = that.parentData.left+that.position.left;
		that.offset.top = that.parentData.top+that.position.top;

		woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width );
		hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

		isParent = that.containerElement.get(0) === that.element.parent().get(0);
		isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

		if ( isParent && isOffsetRelative ) {
			woset -= Math.abs( that.parentData.left );
		}

		if (woset + that.size.width >= that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
			}
		}

		if (hoset + that.size.height >= that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
			}
		}
	},

	stop: function(){
		var that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $(that.helper),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if (that._helper && !o.animate && (/relative/).test(ce.css("position"))) {
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });
		}

		if (that._helper && !o.animate && (/static/).test(ce.css("position"))) {
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });
		}

	}
});

$.ui.plugin.add("resizable", "alsoResize", {

	start: function () {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			_store = function (exp) {
				$(exp).each(function() {
					var el = $(this);
					el.data("ui-resizable-alsoresize", {
						width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
						left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
					});
				});
			};

		if (typeof(o.alsoResize) === "object" && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
				top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
			},

			_alsoResize = function (exp, c) {
				$(exp).each(function() {
					var el = $(this), start = $(this).data("ui-resizable-alsoresize"), style = {},
						css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

					$.each(css, function (i, prop) {
						var sum = (start[prop]||0) + (delta[prop]||0);
						if (sum && sum >= 0) {
							style[prop] = sum || null;
						}
					});

					el.css(style);
				});
			};

		if (typeof(o.alsoResize) === "object" && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function () {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function() {

		var that = $(this).data("ui-resizable"), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({ opacity: 0.25, display: "block", position: "relative", height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass("ui-resizable-ghost")
			.addClass(typeof o.ghost === "string" ? o.ghost : "");

		that.ghost.appendTo(that.helper);

	},

	resize: function(){
		var that = $(this).data("ui-resizable");
		if (that.ghost) {
			that.ghost.css({ position: "relative", height: that.size.height, width: that.size.width });
		}
	},

	stop: function() {
		var that = $(this).data("ui-resizable");
		if (that.ghost && that.helper) {
			that.helper.get(0).removeChild(that.ghost.get(0));
		}
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function() {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
			gridX = (grid[0]||1),
			gridY = (grid[1]||1),
			ox = Math.round((cs.width - os.width) / gridX) * gridX,
			oy = Math.round((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
			isMinWidth = o.minWidth && (o.minWidth > newWidth),
			isMinHeight = o.minHeight && (o.minHeight > newHeight);

		o.grid = grid;

		if (isMinWidth) {
			newWidth = newWidth + gridX;
		}
		if (isMinHeight) {
			newHeight = newHeight + gridY;
		}
		if (isMaxWidth) {
			newWidth = newWidth - gridX;
		}
		if (isMaxHeight) {
			newHeight = newHeight - gridY;
		}

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if (/^(ne)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if (/^(sw)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			if ( newHeight - gridY > 0 ) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else {
				that.size.height = gridY;
				that.position.top = op.top + os.height - gridY;
			}
			if ( newWidth - gridX > 0 ) {
				that.size.width = newWidth;
				that.position.left = op.left - ox;
			} else {
				that.size.width = gridX;
				that.position.left = op.left + os.width - gridX;
			}
		}
	}

});

})(jQuery);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./core":21,"./mouse":23,"./widget":25}],25:[function(require,module,exports){
(function (global){
var jQuery = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

/*!
 * jQuery UI Widget 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){
/*
	ractive.runtime.min.js v0.6.1
	2014-10-25 - commit 3a576eb3 

	http://ractivejs.org
	http://twitter.com/RactiveJS

	Released under the MIT License.
*/

!function(a){"use strict";var b=a.Ractive,c=function(){var a={el:void 0,append:!1,template:{v:1,t:[]},"yield":null,preserveWhitespace:!1,sanitize:!1,stripComments:!0,data:{},computed:{},magic:!1,modifyArrays:!0,adapt:[],isolated:!1,twoway:!0,lazy:!1,noIntro:!1,transitionsEnabled:!0,complete:void 0,noCssTransform:!1,debug:!1};return a}(),d={linear:function(a){return a},easeIn:function(a){return Math.pow(a,3)},easeOut:function(a){return Math.pow(a-1,3)+1},easeInOut:function(a){return(a/=.5)<1?.5*Math.pow(a,3):.5*(Math.pow(a-2,3)+2)}},e=[],f=Object.prototype.hasOwnProperty,g=function(){var a=Object.prototype.toString;return function(b){return"[object Array]"===a.call(b)}}(),h=function(){var a=Object.prototype.toString;return function(b){return b&&"[object Object]"===a.call(b)}}(),i=function(a){return!isNaN(parseFloat(a))&&isFinite(a)},j=function(a,b,c,d,e){var f,g,h;return a.push(function(){g=a.interpolate}),h=/^([+-]?[0-9]+\.?(?:[0-9]+)?)(px|em|ex|%|in|cm|mm|pt|pc)$/,f={number:function(a,b){var c;return e(a)&&e(b)?(a=+a,b=+b,c=b-a,c?function(b){return a+b*c}:function(){return a}):null},array:function(a,b){var d,e,f,h;if(!c(a)||!c(b))return null;for(d=[],e=[],h=f=Math.min(a.length,b.length);h--;)e[h]=g(a[h],b[h]);for(h=f;h<a.length;h+=1)d[h]=a[h];for(h=f;h<b.length;h+=1)d[h]=b[h];return function(a){for(var b=f;b--;)d[b]=e[b](a);return d}},object:function(a,c){var e,f,h,i,j;if(!d(a)||!d(c))return null;e=[],i={},h={};for(j in a)b.call(a,j)&&(b.call(c,j)?(e.push(j),h[j]=g(a[j],c[j])):i[j]=a[j]);for(j in c)b.call(c,j)&&!b.call(a,j)&&(i[j]=c[j]);return f=e.length,function(a){for(var b,c=f;c--;)b=e[c],i[b]=h[b](a);return i}}}}(e,f,g,h,i),k=function(){var a;return a="undefined"==typeof document?!1:document&&document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}(),l=function(){var a,b={};return a="undefined"!=typeof console&&"function"==typeof console.warn&&"function"==typeof console.warn.apply?function(a,c){if(!c){if(b[a])return;b[a]=!0}console.warn("%cRactive.js: %c"+a,"color: rgb(114, 157, 52);","color: rgb(85, 85, 85);")}:function(){}}(),m={missingParser:"Missing Ractive.parse - cannot parse template. Either preparse or use the version that includes the parser",mergeComparisonFail:"Merge operation: comparison failed. Falling back to identity checking",noComponentEventArguments:"Components currently only support simple events - you cannot include arguments. Sorry!",noTemplateForPartial:'Could not find template for partial "{name}"',noNestedPartials:"Partials ({{>{name}}}) cannot contain nested inline partials",evaluationError:'Error evaluating "{uniqueString}": {err}',badArguments:"Bad arguments \"{arguments}\". I'm not allowed to argue unless you've paid.",failedComputation:'Failed to compute "{key}": {err}',missingPlugin:'Missing "{name}" {plugin} plugin. You may need to download a {plugin} via http://docs.ractivejs.org/latest/plugins#{plugin}s',badRadioInputBinding:"A radio input can have two-way binding on its name attribute, or its checked attribute - not both",noRegistryFunctionReturn:'A function was specified for "{name}" {registry}, but no {registry} was returned',defaultElSpecified:"The <{name}/> component has a default `el` property; it has been disregarded",noElementProxyEventWildcards:'Only component proxy-events may contain "*" wildcards, <{element} on-{event}/> is not valid.',methodDeprecated:'The method "{deprecated}" has been deprecated in favor of "{replacement}" and will likely be removed in a future release. See http://docs.ractivejs.org/latest/migrating for more information.'},n=function(a,b){function c(a){var c=b[a.message]||a.message||"";return d(c,a.args)}function d(a,b){return a.replace(/{([^{}]*)}/g,function(a,c){return b[c]})}var e={warn:function(a,b){(a.debug||b)&&this.warnAlways(a)},warnAlways:function(a){this.logger(c(a),a.allowDuplicates)},error:function(a){this.errorOnly(a),a.debug||this.warn(a,!0)},errorOnly:function(a){a.debug&&this.critical(a)},critical:function(a){var b=a.err||new Error(c(a));this.thrower(b)},logger:a,thrower:function(a){throw a}};return e}(l,m),o=function(a){function b(a){this.event=a,this.method="on"+a,this.deprecate=c[a]}var c={construct:{deprecated:"beforeInit",replacement:"onconstruct"},render:{deprecated:"init",message:'The "init" method has been deprecated and will likely be removed in a future release. You can either use the "oninit" method which will fire only once prior to, and regardless of, any eventual ractive instance being rendered, or if you need to access the rendered DOM, use "onrender" instead. See http://docs.ractivejs.org/latest/migrating for more information.'},complete:{deprecated:"complete",replacement:"oncomplete"}};return b.prototype.fire=function(b,c){function d(a){return b[a]?(c?b[a](c):b[a](),!0):void 0}d(this.method),!b[this.method]&&this.deprecate&&d(this.deprecate.deprecated)&&a.warnAlways({debug:b.debug,message:this.deprecate.message||"methodDeprecated",args:this.deprecate}),c?b.fire(this.event,c):b.fire(this.event)},b}(n),p=function(a,b){var c=a.indexOf(b);-1!==c&&a.splice(c,1)},q=function(){function a(a){setTimeout(a,0)}function b(a,b){return function(){for(var c;c=a.shift();)c(b)}}function c(a,b,d,f){var g;if(b===a)throw new TypeError("A promise's fulfillment handler cannot return the same promise");if(b instanceof e)b.then(d,f);else if(!b||"object"!=typeof b&&"function"!=typeof b)d(b);else{try{g=b.then}catch(h){return void f(h)}if("function"==typeof g){var i,j,k;j=function(b){i||(i=!0,c(a,b,d,f))},k=function(a){i||(i=!0,f(a))};try{g.call(b,j,k)}catch(h){if(!i)return f(h),void(i=!0)}}else d(b)}}var d,e,f={},g={},h={};return"function"==typeof q?e=q:(e=function(d){var i,j,k,l,m,n,o=[],p=[],q=f;k=function(c){return function(d){q===f&&(i=d,q=c,j=b(q===g?o:p,i),a(j))}},l=k(g),m=k(h);try{d(l,m)}catch(r){m(r)}return n={then:function(b,d){var g=new e(function(e,h){var i=function(a,b,d){b.push("function"==typeof a?function(b){var d;try{d=a(b),c(g,d,e,h)}catch(f){h(f)}}:d)};i(b,o,e),i(d,p,h),q!==f&&a(j)});return g}},n["catch"]=function(a){return this.then(null,a)},n},e.all=function(a){return new e(function(b,c){var d,e,f,g=[];if(!a.length)return void b(g);for(f=function(e){a[e].then(function(a){g[e]=a,--d||b(g)},c)},d=e=a.length;e--;)f(e)})},e.resolve=function(a){return new e(function(b){b(a)})},e.reject=function(a){return new e(function(b,c){c(a)})}),d=e}(),r=function(){var a=/\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;return function(b){return(b||"").replace(a,".$1")}}(),s=function(a){do if(void 0!==a.context)return a.context;while(a=a.parent);return""},t=function(a,b){return null===a&&null===b?!0:"object"==typeof a||"object"==typeof b?!1:a===b},u=function(a,b){function c(a,b){var c=a.computations[b];return!c||c.setter}var d;a.push(function(){return d=a.runloop});var e=function(a,b,c,d){var e=this;this.root=a,this.keypath=b,this.otherInstance=c,this.otherKeypath=d,this.lock=function(){return e.updating=!0},this.unlock=function(){return e.updating=!1},this.bind(),this.value=this.root.viewmodel.get(this.keypath)};return e.prototype={isLocked:function(){return this.updating||this.counterpart&&this.counterpart.updating},shuffle:function(a,b){this.propagateChange(b,a)},setValue:function(a){this.propagateChange(a)},propagateChange:function(a,e){var f;return this.isLocked()?void(this.value=a):void(b(a,this.value)||(this.lock(),d.addViewmodel(f=this.otherInstance.viewmodel)||this.counterpart.value===a||d.scheduleTask(function(){return d.addViewmodel(f)}),e?f.smartUpdate(this.otherKeypath,a,e):c(f,this.otherKeypath)&&f.set(this.otherKeypath,a),this.value=a,d.scheduleTask(this.unlock)))},refineValue:function(a){var b,c=this;this.isLocked()||(this.lock(),d.addViewmodel(b=this.otherInstance.viewmodel),a.map(function(a){return c.otherKeypath+a.substr(c.keypath.length)}).forEach(function(a){return b.mark(a)}),d.scheduleTask(this.unlock))},bind:function(){this.root.viewmodel.register(this.keypath,this)},rebind:function(a){this.unbind(),this.keypath=a,this.counterpart.otherKeypath=a,this.bind()},unbind:function(){this.root.viewmodel.unregister(this.keypath,this)}},function(a,b,c,d){var f,g,h,i,j;f=c+"="+d,h=a.bindings,h[f]||(g=a.instance,i=new e(b,c,g,d),h.push(i),g.twoway&&(j=new e(g,d,b,c),h.push(j),i.counterpart=j,j.counterpart=i),h[f]=i)}}(e,t),v=function(a,b,c){function d(a,b){var c;if("."===b)return a;if(c=a?a.split("."):[],"../"===b.substr(0,3)){for(;"../"===b.substr(0,3);){if(!c.length)throw new Error(f);c.pop(),b=b.substring(3)}return c.push(b),c.join(".")}return a?a+b.replace(/^\.\//,"."):b.replace(/^\.\/?/,"")}var e,f,g;return f='Could not resolve reference - too many "../" prefixes',g={evaluateWrapped:!0},e=function h(e,f,i,j){var k,l,m,n,o,p,q,r,s,t;if(f=a(f),"~/"===f.substr(0,2))return f.substring(2);if("."===f.charAt(0))return d(b(i),f);l=f.split(".")[0],i=i||{};do if(k=i.context,k&&(p=!0,o=e.viewmodel.get(k,g),o&&("object"==typeof o||"function"==typeof o)&&l in o))return k+"."+f;while(i=i.parent);if(l in e.data||l in e.viewmodel.computations)return f;if(e._parent&&!e.isolated){if(p=!0,i=e.component.parentFragment,i.indexRefs&&void 0!==(m=i.indexRefs[f]))return e.component.indexRefBindings[f]=f,void e.viewmodel.set(f,m,!0);if(n=h(e._parent,f,i,!0)){for(q=n.split("."),r=f.split(".");q.length>1&&r.length>1&&q[q.length-1]===r[r.length-1];)q.pop(),r.pop();return s=q.join("."),t=r.join("."),e.viewmodel.set(t,e._parent.viewmodel.get(s),!0),c(e.component,e._parent,s,t),f}}return j||p?void 0!==e.viewmodel.get(f)?f:void 0:(e.viewmodel.set(f,void 0),f)}}(r,s,u),w=function(a){function b(a){a.detach()}function c(a){a.detachNodes()}function d(a){!a.ready||a.outros.length||a.outroChildren||(a.outrosComplete||(a.parent?a.parent.decrementOutros(a):a.detachNodes(),a.outrosComplete=!0),a.intros.length||a.totalChildren||("function"==typeof a.callback&&a.callback(),a.parent&&a.parent.decrementTotal()))}var e=function(a,b){this.callback=a,this.parent=b,this.intros=[],this.outros=[],this.children=[],this.totalChildren=this.outroChildren=0,this.detachQueue=[],this.outrosComplete=!1,b&&b.addChild(this)};return e.prototype={addChild:function(a){this.children.push(a),this.totalChildren+=1,this.outroChildren+=1},decrementOutros:function(){this.outroChildren-=1,d(this)},decrementTotal:function(){this.totalChildren-=1,d(this)},add:function(a){var b=a.isIntro?this.intros:this.outros;b.push(a)},remove:function(b){var c=b.isIntro?this.intros:this.outros;a(c,b),d(this)},init:function(){this.ready=!0,d(this)},detachNodes:function(){this.detachQueue.forEach(b),this.children.forEach(c)}},e}(p),x=function(a,b,c,d,e,f){function g(){var a,b,c;for(a=0;a<k.viewmodels.length;a+=1)b=k.viewmodels[a],c=b.applyChanges(),c&&n.fire(b.ractive,c);for(k.viewmodels.length=0,h(),a=0;a<k.views.length;a+=1)k.views[a].update();for(k.views.length=0,a=0;a<k.tasks.length;a+=1)k.tasks[a]();return k.tasks.length=0,k.viewmodels.length?g():void 0}function h(){var a,b,c,d;for(a=m.length;a--;)b=m[a],b.keypath&&m.splice(a,1),(c=e(b.root,b.ref,b.parentFragment))&&((d||(d=[])).push({item:b,keypath:c}),m.splice(a,1));d&&d.forEach(i)}function i(a){a.item.resolve(a.keypath)}var j,k,l,m=[],n=new b("change");return l={start:function(a,b){var c,e;return b&&(c=new d(function(a){return e=a})),k={previousBatch:k,transitionManager:new f(e,k&&k.transitionManager),views:[],tasks:[],viewmodels:[],instance:a},a&&k.viewmodels.push(a.viewmodel),c},end:function(){g(),k.transitionManager.init(),!k.previousBatch&&k.instance&&(k.instance.viewmodel.changes=[]),k=k.previousBatch},addViewmodel:function(a){return k?-1===k.viewmodels.indexOf(a)?(k.viewmodels.push(a),!0):!1:(a.applyChanges(),!1)},registerTransition:function(a){a._manager=k.transitionManager,k.transitionManager.add(a)},addView:function(a){k.views.push(a)},addUnresolved:function(a){m.push(a)},removeUnresolved:function(a){c(m,a)},detachWhenReady:function(a){k.transitionManager.detachQueue.push(a)},scheduleTask:function(a,b){var c;if(k){for(c=k;b&&c.previousBatch;)c=c.previousBatch;c.tasks.push(a)}else a()}},a.runloop=l,j=l}(e,o,p,q,v,w),y=function(){var a=/^\s*[0-9]+\s*$/;return function(b){return a.test(b)?[]:{}}}(),z=function(a,b,c){function d(b,c,d){function e(b){var d,e;b.value=c,b.updating||(e=b.ractive,d=b.keypath,b.updating=!0,a.start(e),e.viewmodel.mark(d),a.end(),b.updating=!1)}var f,g,h,i,j,k;if(f=b.obj,g=b.prop,d&&!d.configurable){if("length"===g)return;throw new Error('Cannot use magic mode with property "'+g+'" - object is not configurable')}d&&(h=d.get,i=d.set),j=h||function(){return c},k=function(a){i&&i(a),c=h?h():a,k._ractiveWrappers.forEach(e)},k._ractiveWrappers=[b],Object.defineProperty(f,g,{get:j,set:k,enumerable:!0,configurable:!0})}var e,f,g;try{Object.defineProperty({},"test",{value:0}),f={filter:function(a,b,d){var e,f,g,h,i;return b?(e=b.split("."),f=e.pop(),g=e.join("."),(h=d.viewmodel.wrapped[g])&&!h.magic?!1:(i=d.get(g),c(i)&&/^[0-9]+$/.test(f)?!1:i&&("object"==typeof i||"function"==typeof i))):!1},wrap:function(a,b,c){return new g(a,b,c)}},g=function(a,b,c){var e,f,g,h;return this.magic=!0,this.ractive=a,this.keypath=c,this.value=b,e=c.split("."),this.prop=e.pop(),f=e.join("."),this.obj=f?a.get(f):a.data,g=this.originalDescriptor=Object.getOwnPropertyDescriptor(this.obj,this.prop),g&&g.set&&(h=g.set._ractiveWrappers)?void(-1===h.indexOf(this)&&h.push(this)):void d(this,b,g)},g.prototype={get:function(){return this.value},reset:function(b){this.updating||(this.updating=!0,this.obj[this.prop]=b,a.addViewmodel(this.ractive.viewmodel),this.ractive.viewmodel.mark(this.keypath),this.updating=!1)},set:function(a,c){this.updating||(this.obj[this.prop]||(this.updating=!0,this.obj[this.prop]=b(a),this.updating=!1),this.obj[this.prop][a]=c)},teardown:function(){var a,b,c,d,e;return this.updating?!1:(a=Object.getOwnPropertyDescriptor(this.obj,this.prop),b=a&&a.set,void(b&&(d=b._ractiveWrappers,e=d.indexOf(this),-1!==e&&d.splice(e,1),d.length||(c=this.obj[this.prop],Object.defineProperty(this.obj,this.prop,this.originalDescriptor||{writable:!0,enumerable:!0,configurable:!0}),this.obj[this.prop]=c))))}}}catch(h){f=!1}return e=f}(x,y,g),A=function(a){return!!a}(z),B={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},C=function(a,b){var c;return c=a?function(a,c){return c&&c!==b.html?document.createElementNS(c,a):document.createElement(a)}:function(a,c){if(c&&c!==b.html)throw"This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you're trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information";return document.createElement(a)}}(k,B),D=function(){var a="object"==typeof document;return a}(),E=function(a){var b;try{Object.defineProperty({},"test",{value:0}),a&&Object.defineProperty(document.createElement("div"),"test",{value:0}),b=Object.defineProperty}catch(c){b=function(a,b,c){a[b]=c.value}}return b}(D),F=function(a,b,c){var d;try{try{Object.defineProperties({},{test:{value:0}})}catch(e){throw e}c&&Object.defineProperties(a("div"),{test:{value:0}}),d=Object.defineProperties}catch(e){d=function(a,c){var d;for(d in c)c.hasOwnProperty(d)&&b(a,d,c[d])}}return d}(C,E,D),G=function(a){return function(b,c,d){var e;if("string"!=typeof c||!a(d))throw new Error("Bad arguments");if(e=+b.get(c)||0,!a(e))throw new Error("Cannot add to a non-numeric value");return b.set(c,e+d)}}(i),H=function(a){return function(b,c){return a(this,b,void 0===c?1:+c)}}(G),I=function(a){var b=/^\.+/;return function(c){return a(c).replace(b,"")}}(r),J=["o","ms","moz","webkit"],K=function(a){var b;return"undefined"==typeof window?b=null:(!function(a,b,c){var d,e;if(!c.requestAnimationFrame){for(d=0;d<a.length&&!c.requestAnimationFrame;++d)c.requestAnimationFrame=c[a[d]+"RequestAnimationFrame"];c.requestAnimationFrame||(e=c.setTimeout,c.requestAnimationFrame=function(a){var c,d,f;return c=Date.now(),d=Math.max(0,16-(c-b)),f=e(function(){a(c+d)},d),b=c+d,f})}}(a,0,window),b=window.requestAnimationFrame),b}(J),L=function(){var a;return a="undefined"!=typeof window&&window.performance&&"function"==typeof window.performance.now?function(){return window.performance.now()}:function(){return Date.now()}}(),M=function(a,b,c){var d=[],e={tick:function(){var f,g,h;for(h=b(),c.start(),f=0;f<d.length;f+=1)g=d[f],g.tick(h)||d.splice(f--,1);c.end(),d.length?a(e.tick):e.running=!1},add:function(b){d.push(b),e.running||(e.running=!0,a(e.tick))},abort:function(a,b){for(var c,e=d.length;e--;)c=d[e],c.root===b&&c.keypath===a&&c.stop()}};return e}(K,L,x),N=function(){function a(a){return a.trim?a.trim():a.replace(/^\s+/,"").replace(/\s+$/,"")}function b(a){return a.str}var c,d=/(?:^|\})?\s*([^\{\}]+)\s*\{/g,e=/\/\*.*?\*\//g,f=/((?:(?:\[[^\]+]\])|(?:[^\s\+\>\~:]))+)((?::[^\s\+\>\~]+)?\s*[\s\+\>\~]?)\s*/g,g=/^@media/,h=/\[data-rvcguid="[a-z0-9-]+"]/g;return c=function(c,i){var j,k;return k=function(a){var c,d,e,g,h,j,k,l,m=[];for(c=[];d=f.exec(a);)c.push({str:d[0],base:d[1],modifiers:d[2]});for(g='[data-rvcguid="'+i+'"]',h=c.map(b),l=c.length;l--;)k=h.slice(),e=c[l],k[l]=e.base+g+e.modifiers||"",j=h.slice(),j[l]=g+" "+j[l],m.push(k.join(" "),j.join(" "));return m.join(", ")},j=h.test(c)?c.replace(h,'[data-rvcguid="'+i+'"]'):c.replace(e,"").replace(d,function(b,c){var d,e;return g.test(c)?b:(d=c.split(",").map(a),e=d.map(k).join(", ")+" ",b.replace(c,e))})}}(),O=function(a){function b(a,b,d){var e,f=b.constructor._guid;(e=c(d.css,d,f)||c(a.css,a,f))&&(b.constructor.css=e)}function c(b,c,d){return b?c.noCssTransform?b:a(b,d):void 0}var d={name:"css",extend:b,init:function(){}};return d}(N),P=function(){function a(a,b){return"function"==typeof b&&/_super/.test(a)}var b;return b=function(b,c,d){return d||a(b,c)?function(){var a,d="_super"in this,e=this._super;return this._super=c,a=b.apply(this,arguments),d&&(this._super=e),a}:b}}(),Q=function(a){function b(a,b,c){var d=c.data||{},e=f(a.prototype.data);if("object"!=typeof d&&"function"!=typeof d)throw new TypeError('data option must be an object or a function, "'+d+'" is not valid');return g(e,d)}function c(a,c,d){c.data=b(a,c,d)}function d(a,c,d){var e=d.data,f=b(a,c,d);return"function"==typeof f&&(f=f.call(c,e)||e),c.data=f||{}}function e(a){var b=this.init(a.constructor,a,a);return b?(a.data=b,!0):void 0}function f(a){if("function"!=typeof a||!Object.keys(a).length)return a;var b={};return h(a,b),g(a,b)}function g(a,b){return"function"==typeof b?k(b,a):"function"==typeof a?j(b,a):i(b,a)}function h(a,b,c){for(var d in a)c&&d in b||(b[d]=a[d])}function i(a,b){return a=a||{},b?(h(b,a,!0),a):a}function j(a,b){return function(c){var d;if(a){d=[];for(var e in a)c&&e in c||d.push(e)}return c=b.call(this,c)||c,d&&d.length&&(c=c||{},d.forEach(function(b){c[b]=a[b]})),c}}function k(b,c){var d;return d="function"!=typeof c?function(a){i(a,c)}:function(b){return c=a(c,function(){},!0),c.call(this,b)||b},a(b,d)}var l,m={name:"data",extend:c,init:d,reset:e};return l=m}(P),R=null,S=function(){var a;try{Object.create(null),a=Object.create}catch(b){a=function(){var a=function(){};return function(b,c){var d;return null===b?{}:(a.prototype=b,d=new a,c&&Object.defineProperties(d,c),d)}}()}return a}(),T=null,U=function(){return function(a,b){var c=a.map(b);return a.forEach(function(a,b){c[a]=c[b]}),c}}(T),V=function(a){var b,c;return b=["preserveWhitespace","sanitize","stripComments","delimiters","tripleDelimiters","interpolate"],c=a(b,function(a){return a})}(U),W=function(a,b,c,d,e){function f(a){var b=d(l);return b.parse=function(b,c){return g(b,c||a)},b}function g(b,d){if(!c)throw new Error(a.missingParser);return c(b,d||this.options)}function h(a,c){var d;if(!b){if(c&&c.noThrow)return;throw new Error("Cannot retrieve template #"+a+" as Ractive is not running in a browser.")}if(i(a)&&(a=a.substring(1)),!(d=document.getElementById(a))){if(c&&c.noThrow)return;throw new Error("Could not find template element with id #"+a)}if("SCRIPT"!==d.tagName.toUpperCase()){if(c&&c.noThrow)return;throw new Error("Template element with id #"+a+", must be a <script> element")}return d.innerHTML}function i(a){return a&&"#"===a.charAt(0)}function j(a){return!("string"==typeof a)}function k(a){return a.defaults&&(a=a.defaults),e.reduce(function(b,c){return b[c]=a[c],b},{})}var l={parse:g,fromId:h,isHashedId:i,isParsed:j,getParseOptions:k,createHelper:f};return l}(m,D,R,S,V),X=function(a,b){function c(a){var b,c=a._config.template;if(c&&c.fn)return b=d(a,c.fn),b!==c.result?(c.result=b,b=e(b,a)):void 0}function d(b,c){var d=a.createHelper(a.getParseOptions(b));return c.call(b,b.data,d)}function e(c,d){if("string"==typeof c)"#"===c[0]&&(c=a.fromId(c)),c=b(c,a.getParseOptions(d));else if(1!==c.v)throw new Error("Mismatched template version! Please ensure you are using the latest version of Ractive.js in your build process as well as in your app");return c}function f(a,b,c){if(b)for(var d in b)(c||!a.hasOwnProperty(d))&&(a[d]=b[d])}var g={name:"template",extend:function(a,b,c){var d;"template"in c&&(d=c.template,b.template="function"==typeof d?d:e(d,b))},init:function(a,b,c){var g,h;g="template"in c?c.template:a.prototype.template,"function"==typeof g&&(h=g,g=d(b,h),b._config.template={fn:h,result:g}),g=e(g,b),b.template=g.t,g.p&&f(b.partials,g.p)},reset:function(a){var b,d=c(a);return d?(b=e(d,a),a.template=b.t,f(a.partials,b.p,!0),!0):void 0}};return g}(W,R),Y=function(a){function b(a,b){this.name=a,this.useDefaults=b}function c(a,b){var d,e;return(d=b(a))?d:!a.isolated&&(e=a._parent)?c(e,b):void 0}return b.prototype={constructor:b,extend:function(a,b,c){this.configure(this.useDefaults?a.defaults:a,this.useDefaults?b:b.constructor,c)},init:function(a,b,c){this.configure(this.useDefaults?a.defaults:a,b,c)},configure:function(b,c,d){var e,f=this.name,g=d[f];e=a(b[f]);for(var h in g)e[h]=g[h];c[f]=e},reset:function(a){var b=a[this.name],c=!1;return Object.keys(b).forEach(function(a){var d=b[a];d._fn&&(d._fn.isOwner?b[a]=d._fn:delete b[a],c=!0)}),c},findOwner:function(a,b){return a[this.name].hasOwnProperty(b)?a:this.findConstructor(a.constructor,b)},findConstructor:function(a,b){return a?a[this.name].hasOwnProperty(b)?a:this.findConstructor(a._parent,b):void 0},find:function(a,b){var d=this;return c(a,function(a){return a[d.name][b]})},findInstance:function(a,b){var d=this;return c(a,function(a){return a[d.name][b]?a:void 0})}},b}(S,T),Z=function(a,b){var c=["adaptors","components","computed","decorators","easing","events","interpolators","partials","transitions"],d=a(c,function(a){return new b(a,"computed"===a)});return d}(U,Y),$=function(){},_=function(a){function b(b,c){var d;if(c in b){var e=b[c];d="function"==typeof e?e:function(){return e}}else d=a;return d}var c;return c=function(a,c,d){if(!/_super/.test(d))return d;var e=function(){var a,f=b(e._parent,c),g="_super"in this,h=this._super;return this._super=f,a=d.apply(this,arguments),g?this._super=h:delete this._super,a};return e._parent=a,e._method=d,e}}($),ab=function(a,b){function c(b,c,e){if(c in b){if(e in b)throw new Error(d(c,e,!0));a(d(c,e)),b[e]=b[c]}}function d(a,b,c){return"options."+a+" has been deprecated in favour of options."+b+"."+(c?" You cannot specify both options, please use options."+b+".":"")}function e(a){c(a,"eventDefinitions","events")}function f(a){b(a.adaptors)&&c(a,"adaptors","adapt")}return function(a){c(a,"beforeInit","onconstruct"),c(a,"init","onrender"),c(a,"complete","oncomplete"),e(a),f(a)}}(l,g),bb=function(a,b,c,d,e,f,g,h){function i(a,b,c,d,e){m[b][a](c,d,e)}function j(a){return a in c&&!(a in o.parseOptions)&&!(a in m)}function k(a,b,c,d){h(d),i(a,"data",b,c,d),o.parseOptions.forEach(function(a){a in d&&(c[a]=d[a])});for(var e in d)if(j(e)){var f=d[e];c[e]="function"==typeof f?g(b.prototype,e,f):f}o.registries.forEach(function(e){e[a](b,c,d)}),i(a,"template",b,c,d),i(a,"css",b,c,d),l(b.prototype,c,d)}function l(a,b,c){for(var d in c)if(!(d in p)&&c.hasOwnProperty(d)){var e=c[d];"function"==typeof e&&(e=g(a,d,e)),b[d]=e}}var m,n,o,p;p={_parent:!0,_component:!0},m={data:b,template:d,css:a},n=Object.keys(c).filter(function(a){return!f[a]&&!m[a]&&!e[a]}),o=[].concat(m.data,e,n,f,m.template,m.css);for(var q in m)o[q]=m[q];return o.keys=Object.keys(c).concat(f.map(function(a){return a.name})).concat(["css"]),o.keys.forEach(function(a){return p[a]=!0}),o.parseOptions=e,o.registries=f,o.extend=function(a,b,c){k("extend",a,b,c)},o.init=function(a,b,c){k("init",a,b,c)},o.reset=function(a){return o.filter(function(b){return b.reset&&b.reset(a)}).map(function(a){return a.name})},o.getConstructTarget=function(a,b){return b.onconstruct?{onconstruct:g(a,"onconstruct",b.onconstruct).bind(a),fire:a.fire.bind(a)}:a},o}(O,Q,c,X,V,Z,_,ab),cb=function(a,b,c,d){function e(a){return function(){return a}}var f,g=function(a,f,g,h){if(a===f)return e(f);if(h){var i=d.registries.interpolators.find(g,h);if(i)return i(a,f)||e(f);b('Missing "'+h+'" interpolator. You may need to download a plugin from [TODO]')}return c.number(a,f)||c.array(a,f)||c.object(a,f)||e(f)};return a.interpolate=g,f=g}(e,l,j,bb),db=function(a,b,c){var d=function(a){var b;this.startTime=Date.now();for(b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);this.interpolator=c(this.from,this.to,this.root,this.interpolator),this.running=!0,this.tick()};return d.prototype={tick:function(){var c,d,e,f,g,h;return h=this.keypath,this.running?(f=Date.now(),c=f-this.startTime,c>=this.duration?(null!==h&&(b.start(this.root),this.root.viewmodel.set(h,this.to),b.end()),this.step&&this.step(1,this.to),this.complete(this.to),g=this.root._animations.indexOf(this),-1===g&&a("Animation was not found"),this.root._animations.splice(g,1),this.running=!1,!1):(d=this.easing?this.easing(c/this.duration):c/this.duration,null!==h&&(e=this.interpolator(d),b.start(this.root),this.root.viewmodel.set(h,e),b.end()),this.step&&this.step(d,e),!0)):!1},stop:function(){var b;this.running=!1,b=this.root._animations.indexOf(this),-1===b&&a("Animation was not found"),this.root._animations.splice(b,1)}},d}(l,x,cb),eb=function(a,b,c,d,e){function f(b,f,g,h){var j,k,l,m;return f&&(f=c(f)),null!==f&&(m=b.viewmodel.get(f)),d.abort(f,b),a(m,g)?(h.complete&&h.complete(h.to),i):(h.easing&&(j="function"==typeof h.easing?h.easing:b.easing[h.easing],"function"!=typeof j&&(j=null)),k=void 0===h.duration?400:h.duration,l=new e({keypath:f,from:m,to:g,root:b,duration:k,easing:j,interpolator:h.interpolator,step:h.step,complete:h.complete}),d.add(l),b._animations.push(l),l)}var g,h=function(){},i={stop:h};return g=function(a,c,d){var e,g,i,j,k,l,m,n,o,p,q,r,s,t;if(e=new b(function(a){g=a}),"object"==typeof a){d=c||{},l=d.easing,m=d.duration,k=[],n=d.step,o=d.complete,(n||o)&&(q={},d.step=null,d.complete=null,p=function(a){return function(b,c){q[a]=c}});for(i in a)a.hasOwnProperty(i)&&((n||o)&&(r=p(i),d={easing:l,duration:m},n&&(d.step=r)),d.complete=o?r:h,k.push(f(this,i,a[i],d)));return t={easing:l,duration:m},n&&(t.step=function(a){n(a,q)}),o&&e.then(function(a){o(a,q)}),t.complete=g,s=f(this,null,null,t),k.push(s),e.stop=function(){for(var a;a=k.pop();)a.stop();s&&s.stop()},e}return d=d||{},d.complete&&e.then(d.complete),d.complete=g,j=f(this,a,c,d),e.stop=function(){j.stop()},e}}(t,q,I,M,db),fb=function(a,b){var c=new a("detach");return function(){return this.detached?this.detached:(this.el&&b(this.el.__ractive_instances__,this),this.detached=this.fragment.detach(),c.fire(this),this.detached)}}(o,p),gb=function(a){return this.el?this.fragment.find(a):null},hb=function(a,b,c){var d,e,f,g,h,i,j,k;if(a){for(e=c("div"),f=["matches","matchesSelector"],k=function(a){return function(b,c){return b[a](c)}},i=f.length;i--&&!d;)if(g=f[i],e[g])d=k(g);else for(j=b.length;j--;)if(h=b[i]+g.substr(0,1).toUpperCase()+g.substring(1),e[h]){d=k(h);break}d||(d=function(a,b){var c,d,f;for(d=a.parentNode,d||(e.innerHTML="",d=e,a=a.cloneNode(),e.appendChild(a)),c=d.querySelectorAll(b),f=c.length;f--;)if(c[f]===a)return!0;return!1})}else d=null;return d}(D,J,C),ib=function(a){return function(b,c){var d=this._isComponentQuery?!this.selector||b.name===this.selector:a(b.node,this.selector);return d?(this.push(b.node||b.instance),c||this._makeDirty(),!0):void 0}}(hb),jb=function(){var a,b,c;a=this._root[this._isComponentQuery?"liveComponentQueries":"liveQueries"],b=this.selector,c=a.indexOf(b),-1!==c&&(a.splice(c,1),a[b]=null)},kb=function(){function a(a){var b;return(b=a.parentFragment)?b.owner:a.component&&(b=a.component.parentFragment)?b.owner:void 0}function b(b){var c,d;for(c=[b],d=a(b);d;)c.push(d),d=a(d);return c}var c;return c=function(a,c){var d,e,f,g,h,i,j,k,l,m;for(d=b(a.component||a._ractive.proxy),e=b(c.component||c._ractive.proxy),f=d[d.length-1],g=e[e.length-1];f&&f===g;)d.pop(),e.pop(),h=f,f=d[d.length-1],g=e[e.length-1];if(f=f.component||f,g=g.component||g,l=f.parentFragment,m=g.parentFragment,l===m)return i=l.items.indexOf(f),j=m.items.indexOf(g),i-j||d.length-e.length;if(k=h.fragments)return i=k.indexOf(l),j=k.indexOf(m),i-j||d.length-e.length;throw new Error("An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/RactiveJS/Ractive/issues - thanks!")}}(),lb=function(a){return function(b,c){var d;return b.compareDocumentPosition?(d=b.compareDocumentPosition(c),2&d?1:-1):a(b,c)}}(kb),mb=function(a,b){return function(){this.sort(this._isComponentQuery?b:a),this._dirty=!1}}(lb,kb),nb=function(a){return function(){var b=this;this._dirty||(this._dirty=!0,a.scheduleTask(function(){b._sort()}))}}(x),ob=function(a){var b=this.indexOf(this._isComponentQuery?a.instance:a);-1!==b&&this.splice(b,1)},pb=function(a,b,c,d,e,f){return function(g,h,i,j){var k=[];return a(k,{selector:{value:h},live:{value:i},_isComponentQuery:{value:j},_test:{value:b}}),i?(a(k,{cancel:{value:c},_root:{value:g},_sort:{value:d},_makeDirty:{value:e},_remove:{value:f},_dirty:{value:!1,writable:!0}}),k):k}}(F,ib,jb,mb,nb,ob),qb=function(a){return function(b,c){var d,e;return this.el?(c=c||{},d=this._liveQueries,(e=d[b])?c&&c.live?e:e.slice():(e=a(this,b,!!c.live,!1),e.live&&(d.push(b),d["_"+b]=e),this.fragment.findAll(b,e),e)):[]}}(pb),rb=function(a){return function(b,c){var d,e;return c=c||{},d=this._liveComponentQueries,(e=d[b])?c&&c.live?e:e.slice():(e=a(this,b,!!c.live,!0),e.live&&(d.push(b),d["_"+b]=e),this.fragment.findAllComponents(b,e),e)}}(pb),sb=function(a){return this.fragment.findComponent(a)},tb=function(){function a(a){var b,d,e,f,g,h="";if(!c[a]){for(e=[];h.length<a;)h+=1;for(b=parseInt(h,2),f=function(a){return"1"===a},g=0;b>=g;g+=1){for(d=g.toString(2);d.length<a;)d="0"+d;e[g]=Array.prototype.map.call(d,f)}c[a]=e}return c[a]}var b,c={};return b=function(b){var d,e,f,g,h,i;for(d=b.split("."),(e=c[d.length])||(e=a(d.length)),h=[],f=function(a,b){return a?"*":d[b]},g=e.length;g--;)i=e[g].map(f).join("."),h.hasOwnProperty(i)||(h.push(i),h[i]=!0);return h}}(),ub=function(a){function b(d,e,f,g){var h=arguments[4];void 0===h&&(h=!1);var i,j,k=!0;for(f&&(d.event=f),j=e.length;j>=0;j--)i=d._subs[e[j]],i&&(k=c(d,i,f,g)&&k);if(f&&delete d.event,d._parent&&k){if(h&&d.component){var l=d.component.name+"."+e[e.length-1];e=a(l),f&&(f.component=d)}b(d._parent,e,f,g)}}function c(a,b,c,d){var e=null,f=!1;c&&!c._noArg&&(d=[c].concat(d));for(var g=0,h=b.length;h>g;g+=1)b[g].apply(a,d)===!1&&(f=!0);return c&&!c._noArg&&f&&(e=c.original)&&(e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation()),!f}var d;return d=function(c,d){var e=arguments[2];if(void 0===e&&(e={}),d){e.event?e.event.name=d:e.event={name:d,context:c.data,keypath:"",_noArg:!0};var f=a(d);b(c,f,e.event,e.args,!0)}}}(tb),vb=function(a){return function(b){var c={args:Array.prototype.slice.call(arguments,1)};a(this,b,c)}}(ub),wb=function(a,b){var c={capture:!0};return function(d){var e;return d=a(d),e=this.viewmodel.get(d,c),void 0===e&&this._parent&&!this.isolated&&b(this,d,this.fragment)&&(e=this.viewmodel.get(d)),e
}}(I,v),xb=function(a){var b;if(a&&"boolean"!=typeof a)return"undefined"!=typeof window&&document&&a?a.nodeType?a:"string"==typeof a&&(b=document.getElementById(a),!b&&document.querySelector&&(b=document.querySelector(a)),b&&b.nodeType)?b:a[0]&&a[0].nodeType?a[0]:null:null},yb=function(a,b){function c(a){e.fire(a),a.findAllComponents("*").forEach(function(a){c(a.instance)})}var d,e=new a("insert");return d=function(a,d){if(!this.fragment.rendered)throw new Error("The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.");if(a=b(a),d=b(d)||null,!a)throw new Error("You must specify a valid target to insert into");a.insertBefore(this.detach(),d),this.el=a,(a.__ractive_instances__||(a.__ractive_instances__=[])).push(this),this.detached=null,c(this)}}(o,xb),zb=function(a,b,c){return function(d,e,f){var g,h;return d=c(d),g=this.viewmodel.get(d),b(g)&&b(e)?(h=a.start(this,!0),this.viewmodel.merge(d,g,e,f),a.end(),f&&f.complete&&h.then(f.complete),h):this.set(d,e,f&&f.complete)}}(x,g,I),Ab=function(a,b){var c=function(a,b,c,d){this.root=a,this.keypath=b,this.callback=c,this.defer=d.defer,this.context=d&&d.context?d.context:a};return c.prototype={init:function(a){this.value=this.root.get(this.keypath),a!==!1?this.update():this.oldValue=this.value},setValue:function(c){var d=this;b(c,this.value)||(this.value=c,this.defer&&this.ready?a.scheduleTask(function(){return d.update()}):this.update())},update:function(){this.updating||(this.updating=!0,this.callback.call(this.context,this.value,this.oldValue,this.keypath),this.oldValue=this.value,this.updating=!1)}},c}(x,t),Bb=function(a){return function(b,c){function d(c,d){var e,f,g;e=b.viewmodel.wrapped[d]?b.viewmodel.wrapped[d].get():b.get(d);for(f in e)!e.hasOwnProperty(f)||"_ractive"===f&&a(e)||(g=d?d+"."+f:f,c.push(g));return c}function e(a){return function(b){return b?b+"."+a:a}}var f,g,h;for(f=c.split("."),h=[""];g=f.shift();)"*"===g?h=h.reduce(d,[]):""===h[0]?h[0]=g:h=h.map(e(g));return h}}(g),Cb=function(a){return function(b,c){var d,e;return d=a(b,c),e={},d.forEach(function(a){e[a]=b.get(a)}),e}}(Bb),Db=function(a,b,c){var d,e=/\*/,f=Array.prototype.slice;return d=function(a,b,c,d){this.root=a,this.callback=c,this.defer=d.defer,this.keypath=b,this.regex=new RegExp("^"+b.replace(/\./g,"\\.").replace(/\*/g,"([^\\.]+)")+"$"),this.values={},this.defer&&(this.proxies=[]),this.context=d&&d.context?d.context:a},d.prototype={init:function(a){var b,d;if(b=c(this.root,this.keypath),a!==!1)for(d in b)b.hasOwnProperty(d)&&this.update(d);else this.values=b},update:function(b){var d,f=this;if(e.test(b)){d=c(this.root,b);for(b in d)d.hasOwnProperty(b)&&this.update(b)}else if(!this.root.viewmodel.implicitChanges[b])return this.defer&&this.ready?void a.scheduleTask(function(){return f.getProxy(b).update()}):void this.reallyUpdate(b)},reallyUpdate:function(a){var c,d,e;return c=this.root.viewmodel.get(a),this.updating?void(this.values[a]=c):(this.updating=!0,b(c,this.values[a])&&this.ready||(d=f.call(this.regex.exec(a),1),e=[c,this.values[a],a].concat(d),this.callback.apply(this.context,e),this.values[a]=c),void(this.updating=!1))},getProxy:function(a){var b=this;return this.proxies[a]||(this.proxies[a]={update:function(){b.reallyUpdate(a)}}),this.proxies[a]}},d}(x,t,Cb),Eb=function(a,b,c){var d=/\*/,e={};return function(f,g,h,i){var j,k,l;return g=a(g),i=i||e,d.test(g)?(j=new c(f,g,h,i),f.viewmodel.patternObservers.push(j),k=!0):j=new b(f,g,h,i),f.viewmodel.register(g,j,k?"patternObservers":"observers"),j.init(i.init),j.ready=!0,{cancel:function(){var a;l||(k?(a=f.viewmodel.patternObservers.indexOf(j),f.viewmodel.patternObservers.splice(a,1),f.viewmodel.unregister(g,j,"patternObservers")):f.viewmodel.unregister(g,j,"observers"),l=!0)}}}}(I,Ab,Db),Fb=function(a,b){return function(c,d,e){var f,g,h,i;if(a(c)){e=d,g=c,f=[];for(c in g)g.hasOwnProperty(c)&&(d=g[c],f.push(this.observe(c,d,e)));return{cancel:function(){for(;f.length;)f.pop().cancel()}}}if("function"==typeof c)return e=d,d=c,c="",b(this,c,d,e);if(h=c.split(" "),1===h.length)return b(this,c,d,e);for(f=[],i=h.length;i--;)c=h[i],c&&f.push(b(this,c,d,e));return{cancel:function(){for(;f.length;)f.pop().cancel()}}}}(h,Eb),Gb=function(a){return a.trim()},Hb=function(a){return""!==a},Ib=function(a,b){return function(c,d){var e,f=this;if(c)e=c.split(" ").map(a).filter(b),e.forEach(function(a){var b,c;(b=f._subs[a])&&(d?(c=b.indexOf(d),-1!==c&&b.splice(c,1)):f._subs[a]=[])});else for(c in this._subs)delete this._subs[c];return this}}(Gb,Hb),Jb=function(a,b){return function(c,d){var e,f,g,h=this,i=this;if("object"==typeof c){e=[];for(f in c)c.hasOwnProperty(f)&&e.push(this.on(f,c[f]));return{cancel:function(){for(var a;a=e.pop();)a.cancel()}}}return g=c.split(" ").map(a).filter(b),g.forEach(function(a){(h._subs[a]||(h._subs[a]=[])).push(d)}),{cancel:function(){i.off(c,d)}}}}(Gb,Hb),Kb=function(){function a(a,b,c){switch(b){case"splice":for(void 0!==c[0]&&c[0]<0&&(c[0]=a.length+Math.max(c[0],-a.length));c.length<2;)c.push(0);return c[1]=Math.min(c[1],a.length-c[0]),c;case"sort":case"reverse":return null;case"pop":return a.length?[a.length-1,1]:null;case"push":return[a.length,0].concat(c);case"shift":return[0,1];case"unshift":return[0,0].concat(c)}}var b;return b=function(b,c,d){var e,f,g,h,i,j,k=[];if(e=a(b,c,d),!e)return null;for(f=b.length,i=e.length-2-e[1],g=Math.min(f,e[0]),h=g+e[1],j=0;g>j;j+=1)k.push(j);for(;h>j;j+=1)k.push(-1);for(;f>j;j+=1)k.push(j+i);return k}}(),Lb=function(a,b,c){var d=Array.prototype;return function(e){return function(f){var g,h,i,j,k=Array.prototype.slice,l=k.call(arguments,1),m=[];if(g=this.get(f),h=g.length,!a(g))throw new Error("Called ractive."+e+"('"+f+"'), but '"+f+"' does not refer to an array");return m=c(g,e,l),j=d[e].apply(g,l),i=b.start(this,!0).then(function(){return j}),m?this.viewmodel.smartUpdate(f,g,m):this.viewmodel.mark(f),b.end(),i}}}(g,x,Kb),Mb=function(a){return a("pop")}(Lb),Nb=function(a){return a("push")}(Lb),Ob=function(a,b,c){var d,e,f,g,h,i,j,k="/* Ractive.js component styles */\n",l={},m=[];return b?(a.push(function(){f=a.runloop}),g=document.createElement("style"),g.type="text/css",h=document.getElementsByTagName("head")[0],j=!1,i=g.styleSheet,e=function(){var a;m.length?(a=k+m.join(" "),i?i.cssText=a:g.innerHTML=a,j||(h.appendChild(g),j=!0)):j&&(h.removeChild(g),j=!1)},d={add:function(a){a.css&&(l[a._guid]||(l[a._guid]=0,m.push(a.css),e()),l[a._guid]+=1)},remove:function(a){a.css&&(l[a._guid]-=1,l[a._guid]||(c(m,a.css),f.scheduleTask(e)))}}):d=null,d}(e,D,p),Pb=function(a,b,c,d){var e=new b("render"),f=new b("complete");return function(b,g){var h,i,j,k=this;if(j=this.transitionsEnabled,this.noIntro&&(this.transitionsEnabled=!1),h=d.start(this,!0),d.scheduleTask(function(){return e.fire(k)},!0),this.fragment.rendered)throw new Error("You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first");return b=c(b)||this.el,g=c(g)||this.anchor,this.el=b,this.anchor=g,this.constructor.css&&a.add(this.constructor),b&&((i=b.__ractive_instances__)?i.push(this):b.__ractive_instances__=[this],g?b.insertBefore(this.fragment.render(),g):b.appendChild(this.fragment.render())),d.end(),this.transitionsEnabled=j,h.then(function(){return f.fire(k)}),h}}(Ob,o,xb,x),Qb=function(){this.dirtyValue=this.dirtyArgs=!0,this.bound&&"function"==typeof this.owner.bubble&&this.owner.bubble()},Rb=function(){var a;return 1===this.items.length?this.items[0].detach():(a=document.createDocumentFragment(),this.items.forEach(function(b){var c=b.detach();c&&a.appendChild(c)}),a)},Sb=function(a){var b,c,d,e;if(this.items){for(c=this.items.length,b=0;c>b;b+=1)if(d=this.items[b],d.find&&(e=d.find(a)))return e;return null}},Tb=function(a,b){var c,d,e;if(this.items)for(d=this.items.length,c=0;d>c;c+=1)e=this.items[c],e.findAll&&e.findAll(a,b);return b},Ub=function(a,b){var c,d,e;if(this.items)for(d=this.items.length,c=0;d>c;c+=1)e=this.items[c],e.findAllComponents&&e.findAllComponents(a,b);return b},Vb=function(a){var b,c,d,e;if(this.items){for(b=this.items.length,c=0;b>c;c+=1)if(d=this.items[c],d.findComponent&&(e=d.findComponent(a)))return e;return null}},Wb=function(a){var b,c=a.index;return b=this.items[c+1]?this.items[c+1].firstNode():this.owner===this.root?this.owner.component?this.owner.component.findNextNode():null:this.owner.findNextNode(this)},Xb=function(){return this.items&&this.items[0]?this.items[0].firstNode():null},Yb=function(){var a=this;do if(a.pElement)return a.pElement.node;while(a=a.parent);return this.root.detached||this.root.el},Zb={TEXT:1,INTERPOLATOR:2,TRIPLE:3,SECTION:4,INVERTED:5,CLOSING:6,ELEMENT:7,PARTIAL:8,COMMENT:9,DELIMCHANGE:10,MUSTACHE:11,TAG:12,ATTRIBUTE:13,CLOSING_TAG:14,COMPONENT:15,NUMBER_LITERAL:20,STRING_LITERAL:21,ARRAY_LITERAL:22,OBJECT_LITERAL:23,BOOLEAN_LITERAL:24,GLOBAL:26,KEY_VALUE_PAIR:27,REFERENCE:30,REFINEMENT:31,MEMBER:32,PREFIX_OPERATOR:33,BRACKETED:34,CONDITIONAL:35,INFIX_OPERATOR:36,INVOCATION:40,SECTION_IF:50,SECTION_UNLESS:51,SECTION_EACH:52,SECTION_WITH:53,SECTION_IF_WITH:54},$b={expectedExpression:"Expected a JavaScript expression",expectedParen:"Expected closing paren"},_b=function(a){var b=/^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;return function(c){var d;return(d=c.matchPattern(b))?{t:a.NUMBER_LITERAL,v:d}:null}}(Zb),ac=function(a){return function(b){var c=b.remaining();return"true"===c.substr(0,4)?(b.pos+=4,{t:a.BOOLEAN_LITERAL,v:"true"}):"false"===c.substr(0,5)?(b.pos+=5,{t:a.BOOLEAN_LITERAL,v:"false"}):null}}(Zb),bc=function(){var a,b,c;return a=/^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/,b=/^\\(?:['"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/,c=/^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/,function(d){return function(e){var f,g,h,i;for(f=e.pos,g='"',h=!1;!h;)i=e.matchPattern(a)||e.matchPattern(b)||e.matchString(d),i?g+='"'===i?'\\"':"\\'"===i?"'":i:(i=e.matchPattern(c),i?g+="\\u"+("000"+i.charCodeAt(1).toString(16)).slice(-4):h=!0);return g+='"',JSON.parse(g)}}}(),cc=function(a){return a('"')}(bc),dc=function(a){return a("'")}(bc),ec=function(a,b,c){return function(d){var e,f;return e=d.pos,d.matchString('"')?(f=c(d),d.matchString('"')?{t:a.STRING_LITERAL,v:f}:(d.pos=e,null)):d.matchString("'")?(f=b(d),d.matchString("'")?{t:a.STRING_LITERAL,v:f}:(d.pos=e,null)):null}}(Zb,cc,dc),fc={name:/^[a-zA-Z_$][a-zA-Z_$0-9]*/},gc=function(a,b,c){var d=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;return function(e){var f;return(f=a(e))?d.test(f.v)?f.v:'"'+f.v.replace(/"/g,'\\"')+'"':(f=b(e))?f.v:(f=e.matchPattern(c.name))?f:void 0}}(ec,_b,fc),hc=function(a,b){return function(c){var d,e,f;return d=c.pos,c.allowWhitespace(),e=b(c),null===e?(c.pos=d,null):(c.allowWhitespace(),c.matchString(":")?(c.allowWhitespace(),f=c.readExpression(),null===f?(c.pos=d,null):{t:a.KEY_VALUE_PAIR,k:e,v:f}):(c.pos=d,null))}}(Zb,gc),ic=function(a){return function b(c){var d,e,f,g;return d=c.pos,f=a(c),null===f?null:(e=[f],c.matchString(",")?(g=b(c),g?e.concat(g):(c.pos=d,null)):e)}}(hc),jc=function(a,b){return function(c){var d,e;return d=c.pos,c.allowWhitespace(),c.matchString("{")?(e=b(c),c.allowWhitespace(),c.matchString("}")?{t:a.OBJECT_LITERAL,m:e}:(c.pos=d,null)):(c.pos=d,null)}}(Zb,ic),kc=function(a){return function b(c){function d(a){f.push(a)}var e,f,g,h;return e=c.pos,c.allowWhitespace(),g=c.readExpression(),null===g?null:(f=[g],c.allowWhitespace(),c.matchString(",")&&(h=b(c),null===h&&c.error(a.expectedExpression),h.forEach(d)),f)}}($b),lc=function(a,b){return function(c){var d,e;return d=c.pos,c.allowWhitespace(),c.matchString("[")?(e=b(c),c.matchString("]")?{t:a.ARRAY_LITERAL,m:e}:(c.pos=d,null)):(c.pos=d,null)}}(Zb,kc),mc=function(a,b,c,d,e){return function(f){var g=a(f)||b(f)||c(f)||d(f)||e(f);return g}}(_b,ac,ec,jc,lc),nc=function(a,b){var c,d,e,f,g;return c=/^\.[a-zA-Z_$0-9]+/,e=function(a){var b=a.matchPattern(d);return b?"."+b:null},d=/^\[(0|[1-9][0-9]*)\]/,f=/^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null)$/,g=/^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/,function(d){var h,i,j,k,l,m,n;if(h=d.pos,d.matchString("~/"))i="~/";else for(i="";d.matchString("../");)i+="../";if(i||(k=d.matchString("./")||d.matchString(".")||""),j=d.matchPattern(/^@(?:keypath|index|key)/)||d.matchPattern(b.name)||"",g.test(j))return d.pos=h,null;if(!i&&!k&&f.test(j))return{t:a.GLOBAL,v:j};if(l=(i||k)+j,!l)return null;for(;m=d.matchPattern(c)||e(d);)l+=m;return d.matchString("(")&&(n=l.lastIndexOf("."),-1!==n?(l=l.substr(0,n),d.pos=h+l.length):d.pos-=1),{t:a.REFERENCE,n:l.replace(/^this\./,"./").replace(/^this$/,".")}}}(Zb,fc),oc=function(a,b){return function(c){var d,e;return d=c.pos,c.matchString("(")?(c.allowWhitespace(),e=c.readExpression(),e||c.error(b.expectedExpression),c.allowWhitespace(),c.matchString(")")||c.error(b.expectedParen),{t:a.BRACKETED,x:e}):null}}(Zb,$b),pc=function(a,b,c){return function(d){return a(d)||b(d)||c(d)}}(mc,nc,oc),qc=function(a,b,c){return function(d){var e,f,g;if(e=d.pos,d.allowWhitespace(),d.matchString(".")){if(d.allowWhitespace(),f=d.matchPattern(c.name))return{t:a.REFINEMENT,n:f};d.error("Expected a property name")}return d.matchString("[")?(d.allowWhitespace(),g=d.readExpression(),g||d.error(b.expectedExpression),d.allowWhitespace(),d.matchString("]")||d.error("Expected ']'"),{t:a.REFINEMENT,x:g}):null}}(Zb,$b,fc),rc=function(a,b,c,d,e){return function(f){var g,h,i,j;if(h=b(f),!h)return null;for(;h;)if(g=f.pos,i=d(f))h={t:a.MEMBER,x:h,r:i};else{if(!f.matchString("("))break;f.allowWhitespace(),j=c(f),f.allowWhitespace(),f.matchString(")")||f.error(e.expectedParen),h={t:a.INVOCATION,x:h},j&&(h.o=j)}return h}}(Zb,pc,kc,qc,$b),sc=function(a,b,c){var d,e;return e=function(c,d){return function(e){var f;return(f=d(e))?f:e.matchString(c)?(e.allowWhitespace(),f=e.readExpression(),f||e.error(b.expectedExpression),{s:c,o:f,t:a.PREFIX_OPERATOR}):null}},function(){var a,b,f,g,h;for(g="! ~ + - typeof".split(" "),h=c,a=0,b=g.length;b>a;a+=1)f=e(g[a],h),h=f;d=h}(),d}(Zb,$b,rc),tc=function(a,b){var c,d;return d=function(b,c){return function(d){var e,f,g;if(f=c(d),!f)return null;for(;;){if(e=d.pos,d.allowWhitespace(),!d.matchString(b))return d.pos=e,f;if("in"===b&&/[a-zA-Z_$0-9]/.test(d.remaining().charAt(0)))return d.pos=e,f;if(d.allowWhitespace(),g=c(d),!g)return d.pos=e,f;f={t:a.INFIX_OPERATOR,s:b,o:[f,g]}}}},function(){var a,e,f,g,h;for(g="* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||".split(" "),h=b,a=0,e=g.length;e>a;a+=1)f=d(g[a],h),h=f;c=h}(),c}(Zb,sc),uc=function(a,b,c){return function(d){var e,f,g,h;return(f=b(d))?(e=d.pos,d.allowWhitespace(),d.matchString("?")?(d.allowWhitespace(),g=d.readExpression(),g||d.error(c.expectedExpression),d.allowWhitespace(),d.matchString(":")||d.error('Expected ":"'),d.allowWhitespace(),h=d.readExpression(),h||d.error(c.expectedExpression),{t:a.CONDITIONAL,o:[f,g,h]}):(d.pos=e,f)):null}}(Zb,tc,$b),vc=function(a,b){function c(a){return JSON.stringify(String(a))}function d(c,e){var f,g;if(c.t===a.REFERENCE&&-1===e.indexOf(c.n)&&e.unshift(c.n),g=c.o||c.m)if(b(g))d(g,e);else for(f=g.length;f--;)d(g[f],e);c.x&&d(c.x,e),c.r&&d(c.r,e),c.v&&d(c.v,e)}function e(b,d,f){var g=function(a){return e(b,a,f)};switch(d.t){case a.BOOLEAN_LITERAL:case a.GLOBAL:case a.NUMBER_LITERAL:return d.v;case a.STRING_LITERAL:return c(d.v);case a.ARRAY_LITERAL:return"["+(d.m?d.m.map(g).join(","):"")+"]";case a.OBJECT_LITERAL:return"{"+(d.m?d.m.map(g).join(","):"")+"}";case a.KEY_VALUE_PAIR:return d.k+":"+e(b,d.v,f);case a.PREFIX_OPERATOR:return("typeof"===d.s?"typeof ":d.s)+e(b,d.o,f);case a.INFIX_OPERATOR:return e(b,d.o[0],f)+("in"===d.s.substr(0,2)?" "+d.s+" ":d.s)+e(b,d.o[1],f);case a.INVOCATION:return e(b,d.x,f)+"("+(d.o?d.o.map(g).join(","):"")+")";case a.BRACKETED:return"("+e(b,d.x,f)+")";case a.MEMBER:return e(b,d.x,f)+e(b,d.r,f);case a.REFINEMENT:return d.n?"."+d.n:"["+e(b,d.x,f)+"]";case a.CONDITIONAL:return e(b,d.o[0],f)+"?"+e(b,d.o[1],f)+":"+e(b,d.o[2],f);case a.REFERENCE:return"_"+f.indexOf(d.n);default:b.error("Expected legal JavaScript")}}var f;return f=function(a){var b,c=[];return d(a,c),b={r:c,s:e(this,a,c)}}}(Zb,h),wc=function(a,b,c,d,e){var f,g,h=/^\s+/;return g=function(a){this.name="ParseError",this.message=a;try{throw new Error(a)}catch(b){this.stack=b.stack}},g.prototype=Error.prototype,f=function(a,b){var c,d,e=0;for(this.str=a,this.options=b||{},this.pos=0,this.lines=this.str.split("\n"),this.lineEnds=this.lines.map(function(a){var b=e+a.length+1;return e=b,b},0),this.init&&this.init(a,b),c=[];this.pos<this.str.length&&(d=this.read());)c.push(d);this.leftover=this.remaining(),this.result=this.postProcess?this.postProcess(c,b):c},f.prototype={read:function(a){var b,c,d,e;for(a||(a=this.converters),b=this.pos,d=a.length,c=0;d>c;c+=1)if(this.pos=b,e=a[c](this))return e;return null},readExpression:function(){return d(this)},flattenExpression:e,getLinePos:function(a){for(var b,c=0,d=0;a>=this.lineEnds[c];)d=this.lineEnds[c],c+=1;return b=a-d,[c+1,b+1,a]},error:function(a){var b,c,d,e,f,h;throw b=this.getLinePos(this.pos),c=b[0],d=b[1],e=this.lines[b[0]-1],f=e+"\n"+new Array(b[1]).join(" ")+"^----",h=new g(a+" at line "+c+" character "+d+":\n"+f),h.line=b[0],h.character=b[1],h.shortMessage=a,h},matchString:function(a){return this.str.substr(this.pos,a.length)===a?(this.pos+=a.length,a):void 0},matchPattern:function(a){var b;return(b=a.exec(this.remaining()))?(this.pos+=b[0].length,b[1]||b[0]):void 0},allowWhitespace:function(){this.matchPattern(h)},remaining:function(){return this.str.substring(this.pos)},nextChar:function(){return this.str.charAt(this.pos)}},f.extend=function(a){var d,e,g=this;d=function(a,b){f.call(this,a,b)},d.prototype=b(g.prototype);for(e in a)c.call(a,e)&&(d.prototype[e]=a[e]);return d.extend=f.extend,d},a.Parser=f,f}(e,S,f,uc,vc),xc=function(a,b,c){function d(a){var b,d,e;return a.allowWhitespace(),(b=c(a))?(e={key:b},a.allowWhitespace(),a.matchString(":")?(a.allowWhitespace(),(d=a.read())?(e.value=d.v,e):null):null):null}var e,f,g,h,i,j,k;return f={"true":!0,"false":!1,undefined:void 0,"null":null},g=new RegExp("^(?:"+Object.keys(f).join("|")+")"),h=/^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/,i=/\$\{([^\}]+)\}/g,j=/^\$\{([^\}]+)\}/,k=/^\s*$/,e=a.extend({init:function(a,b){this.values=b.values,this.allowWhitespace()},postProcess:function(a){return 1===a.length&&k.test(this.leftover)?{value:a[0].v}:null},converters:[function(a){var b;return a.values?(b=a.matchPattern(j),b&&a.values.hasOwnProperty(b)?{v:a.values[b]}:void 0):null},function(a){var b;return(b=a.matchPattern(g))?{v:f[b]}:void 0},function(a){var b;return(b=a.matchPattern(h))?{v:+b}:void 0},function(a){var c,d=b(a);return d&&(c=a.values)?{v:d.v.replace(i,function(a,b){return b in c?c[b]:b})}:d},function(a){var b,c;if(!a.matchString("{"))return null;if(b={},a.allowWhitespace(),a.matchString("}"))return{v:b};for(;c=d(a);){if(b[c.key]=c.value,a.allowWhitespace(),a.matchString("}"))return{v:b};if(!a.matchString(","))return null}return null},function(a){var b,c;if(!a.matchString("["))return null;if(b=[],a.allowWhitespace(),a.matchString("]"))return{v:b};for(;c=a.read();){if(b.push(c.v),a.allowWhitespace(),a.matchString("]"))return{v:b};if(!a.matchString(","))return null;a.allowWhitespace()}return null}]}),function(a,b){var c=new e(a,{values:b});return c.result}}(wc,ec,gc),yc=function(a){function b(a,c,d,e){return e=e||0,a.map(function(a){var f,g,h;return a.text?a.text:a.fragments?a.fragments.map(function(a){return b(a.items,c,d,e)}).join(""):(f=d+"-"+e++,h=(g=a.root.viewmodel.wrapped[a.keypath])?g.value:a.getValue(),c[f]=h,"${"+f+"}")}).join("")}var c,d={};return c=function(){var c=arguments[0];void 0===c&&(c=d);var e,f,g,h,i,j,k;return e=c.args,i=e?"argsList":"value",j=e?"dirtyArgs":"dirtyValue",this[j]&&(g=b(this.items,f={},this.root._guid),h=a(e?"["+g+"]":g,f),k=h?h.value:e?[this.toString()]:this.toString(),this[i]=k,this[j]=!1),this[i]}}(xc),zc=function(){var a=/</g,b=/>/g,c=/&/g;return function(d){return d.replace(c,"&amp;").replace(a,"&lt;").replace(b,"&gt;")}}(),Ac=function(a){return a&&a.parentNode&&a.parentNode.removeChild(a),a},Bc=function(a){return function(){return a(this.node)}}(Ac),Cc=function(a,b,c){var d=function(b){this.type=a.TEXT,this.text=b.template};return d.prototype={detach:c,firstNode:function(){return this.node},render:function(){return this.node||(this.node=document.createTextNode(this.text)),this.node},toString:function(a){return a?b(this.text):this.text},unrender:function(a){return a?this.detach():void 0}},d}(Zb,zc,Bc),Dc=function(){this.registered&&this.root.viewmodel.unregister(this.keypath,this),this.resolver&&this.resolver.unbind()},Ec=function(){return this.value},Fc=function(a,b){return a&&b&&a.substr(0,b.length+1)===b+"."},Gc=function(a){return function(b,c,d){return b===c?void 0!==d?d:null:a(b,c)?null===d?d:b.replace(c+".",d+"."):void 0}}(Fc),Hc=function(a,b,c){var d=function(c,d,e){var f;this.ref=d,this.resolved=!1,this.root=c.root,this.parentFragment=c.parentFragment,this.callback=e,f=b(c.root,d,c.parentFragment),void 0!==f?this.resolve(f):a.addUnresolved(this)};return d.prototype={resolve:function(a){this.resolved=!0,this.keypath=a,this.callback(a)},forceResolution:function(){this.resolve(this.ref)},rebind:function(a,b,d,e){var f;void 0!==this.keypath&&(f=c(this.keypath,d,e),void 0!==f&&this.resolve(f))},unbind:function(){this.resolved||a.removeUnresolved(this)}},d}(x,v,Gc),Ic=function(){var a=function(a,b,c){this.parentFragment=a.parentFragment,this.ref=b,this.callback=c,this.rebind()};return a.prototype={rebind:function(){var a=this.ref,b=this.parentFragment;if("@keypath"===a)for(;b;){if(b.context)return this.callback("@"+b.context);b=b.parent}if("@index"===a||"@key"===a)for(;b;){if(void 0!==b.index)return this.callback("@"+b.index);b=b.parent}throw new Error('Unknown special reference "'+a+'" - valid references are @index, @key and @keypath')},unbind:function(){}},a}(),Jc=function(){var a=function(a,b,c){this.parentFragment=a.parentFragment,this.ref=b,this.callback=c,this.rebind()};return a.prototype={rebind:function(){var a=this.ref,b=this.parentFragment.indexRefs,c=b[a];void 0!==c&&this.callback("@"+c)},unbind:function(){}},a}(),Kc=function(a,b,c){return function(d,e,f){var g,h;return"@"===e.charAt(0)?new b(d,e,f):(g=d.parentFragment.indexRefs,g&&void 0!==(h=g[e])?new c(d,e,f):new a(d,e,f))}}(Hc,Ic,Jc),Lc=function(){var a={};return function(b,c){var d,e;if(a[b])return a[b];for(e=[];c--;)e[c]="_"+c;return d=new Function(e.join(","),"return("+b+")"),a[b]=d,d}}(),Mc=function(a,b,c,d){function e(a){return a.call()}function f(a,c){return a.replace(/_([0-9]+)/g,function(a,d){var e,f;return e=c[d],void 0===e?"undefined":"@"===e[0]?(f=e.slice(1),b(f)?f:'"'+f+'"'):e})}function g(a){return"${"+a.replace(/[\.\[\]]/g,"-")+"}"}function h(a){return void 0!==a&&"@"!==a[0]}function i(b,c){var d,e,f;if(b._noWrap)return b;if(e="__ractive_"+c._guid,d=b[e])return d;if(/this/.test(b.toString())){a(b,e,{value:l.call(b,c)});for(f in b)b.hasOwnProperty(f)&&(b[e][f]=b[f]);return b[e]}return a(b,"__ractive_nowrap",{value:b}),b.__ractive_nowrap}var j,k,l=Function.prototype.bind;return k=function(a,b,d,e){var f,g,h=this;f=a.root,h.root=f,h.parentFragment=b,h.callback=e,h.owner=a,h.str=d.s,h.keypaths=[],g=b.indexRefs,h.pending=d.r.length,h.refResolvers=d.r.map(function(a,b){return c(h,a,function(a){h.resolve(b,a)})}),h.ready=!0,h.bubble()},k.prototype={bubble:function(){this.ready&&(this.uniqueString=f(this.str,this.keypaths),this.keypath=g(this.uniqueString),this.createEvaluator(),this.callback(this.keypath))},unbind:function(){for(var a;a=this.refResolvers.pop();)a.unbind()},resolve:function(a,b){this.keypaths[a]=b,this.bubble()},createEvaluator:function(){var a,c,f,g,j=this,k=this;a=this.root.viewmodel.computations[this.keypath],a?this.root.viewmodel.mark(this.keypath):(g=d(this.str,this.refResolvers.length),c=this.keypaths.map(function(a){var c;return"undefined"===a?function(){return void 0}:"@"===a[0]?(c=a.slice(1),b(c)?function(){return+c}:function(){return c}):function(){var b=j.root.viewmodel.get(a);return"function"==typeof b&&(b=i(b,k.root)),b}}),f={deps:this.keypaths.filter(h),get:function(){var a=c.map(e);return g.apply(null,a)}},a=this.root.viewmodel.compute(this.keypath,f))},rebind:function(a,b,c,d){this.refResolvers.forEach(function(e){return e.rebind(a,b,c,d)})}},j=k}(E,i,Kc,Lc,T),Nc=function(a,b,c){var d=function(d,e,f){var g=this;g.resolver=e,g.root=e.root,g.parentFragment=f,g.viewmodel=e.root.viewmodel,"string"==typeof d?g.value=d:d.t===a.REFERENCE?g.refResolver=b(this,d.n,function(a){g.resolve(a)}):new c(e,f,d,function(a){g.resolve(a)})};return d.prototype={resolve:function(a){this.keypath&&this.viewmodel.unregister(this.keypath,this),this.keypath=a,this.value=this.viewmodel.get(a),this.bind(),this.resolver.bubble()},bind:function(){this.viewmodel.register(this.keypath,this)},rebind:function(a,b,c,d){this.refResolver&&this.refResolver.rebind(a,b,c,d)},setValue:function(a){this.value=a,this.resolver.bubble()},unbind:function(){this.keypath&&this.viewmodel.unregister(this.keypath,this),this.unresolved&&this.unresolved.unbind()},forceResolution:function(){this.refResolver&&this.refResolver.forceResolution()}},d}(Zb,Kc,Mc),Oc=function(a,b,c){function d(a){return a.value}function e(a){return void 0!=a}function f(a){a.unbind()}var g=function(d,e,f){var g,h,i,j,k=this,l=this;l.parentFragment=j=d.parentFragment,l.root=g=d.root,l.mustache=d,l.ref=h=e.r,l.callback=f,l.unresolved=[],(i=a(g,h,j))?l.base=i:l.baseResolver=new b(this,h,function(a){l.base=a,l.baseResolver=null,l.bubble()}),l.members=e.m.map(function(a){return new c(a,k,j)}),l.ready=!0,l.bubble()};return g.prototype={getKeypath:function(){var a=this.members.map(d);return!a.every(e)||this.baseResolver?null:this.base+"."+a.join(".")},bubble:function(){this.ready&&!this.baseResolver&&this.callback(this.getKeypath())},unbind:function(){this.members.forEach(f)},rebind:function(a,b,c,d){var e;this.members.forEach(function(f){f.rebind(a,b,c,d)&&(e=!0)}),e&&this.bubble()},forceResolution:function(){this.baseResolver&&(this.base=this.ref,this.baseResolver.unbind(),this.baseResolver=null),this.members.forEach(function(a){return a.forceResolution()}),this.bubble()}},g}(v,Hc,Nc),Pc=function(a,b,c,d){return function(e,f){function g(a){e.resolve(a)}function h(a){var b=e.keypath;a!==b&&(e.resolve(a),void 0!==b&&e.fragments&&e.fragments.forEach(function(c){c.rebind(null,null,b,a)}))}var i,j,k;j=f.parentFragment,k=f.template,e.root=j.root,e.parentFragment=j,e.pElement=j.pElement,e.template=f.template,e.index=f.index||0,e.isStatic=f.template.s,e.type=f.template.t,e.registered=!1,(i=k.r)&&(e.resolver=new b(e,i,g)),f.template.x&&(e.resolver=new d(e,j,f.template.x,h)),f.template.rx&&(e.resolver=new c(e,f.template.rx,h)),e.template.n!==a.SECTION_UNLESS||e.hasOwnProperty("value")||e.setValue(void 0)}}(Zb,Kc,Oc,Mc),Qc=function(a){return function(b){var c,d,e;return b&&"@"===b[0]?(d=b.slice(1),a(d)&&(d=+d),this.keypath=b,void this.setValue(d)):(this.registered&&(this.root.viewmodel.unregister(this.keypath,this),this.registered=!1,c=!0),this.keypath=b,void 0!=b&&(d=this.root.viewmodel.get(b),this.root.viewmodel.register(b,this),this.registered=!0),this.setValue(d),void(c&&(e=this.twowayBinding)&&e.rebound()))}}(i),Rc=function(a,b,c,d){this.fragments&&this.fragments.forEach(function(e){return e.rebind(a,b,c,d)}),this.resolver&&this.resolver.rebind(a,b,c,d)},Sc=function(a,b,c,d){return{getValue:a,init:b,resolve:c,rebind:d}}(Ec,Pc,Qc,Rc),Tc=function(a,b,c,d,e,f,g,h){var i=function(b){this.type=a.INTERPOLATOR,g.init(this,b)};return i.prototype={update:function(){this.node.data=void 0==this.value?"":this.value},resolve:g.resolve,rebind:g.rebind,detach:h,unbind:f,render:function(){return this.node||(this.node=document.createTextNode(void 0!=this.value?this.value:"")),this.node},unrender:function(a){a&&d(this.node)},getValue:g.getValue,setValue:function(a){var c;(c=this.root.viewmodel.wrapped[this.keypath])&&(a=c.get()),e(a,this.value)||(this.value=a,this.parentFragment.bubble(),this.node&&b.addView(this))},firstNode:function(){return this.node},toString:function(a){var b=void 0!=this.value?""+this.value:"";return a?c(b):b}},i}(Zb,x,zc,Ac,t,Dc,Sc,Bc),Uc=function(){this.parentFragment.bubble()},Vc=function(){var a;return 1===this.fragments.length?this.fragments[0].detach():(a=document.createDocumentFragment(),this.fragments.forEach(function(b){a.appendChild(b.detach())}),a)},Wc=function(a){var b,c,d;for(c=this.fragments.length,b=0;c>b;b+=1)if(d=this.fragments[b].find(a))return d;return null},Xc=function(a,b){var c,d;for(d=this.fragments.length,c=0;d>c;c+=1)this.fragments[c].findAll(a,b)},Yc=function(a,b){var c,d;for(d=this.fragments.length,c=0;d>c;c+=1)this.fragments[c].findAllComponents(a,b)},Zc=function(a){var b,c,d;for(c=this.fragments.length,b=0;c>b;b+=1)if(d=this.fragments[b].findComponent(a))return d;return null},$c=function(a){return this.fragments[a.index+1]?this.fragments[a.index+1].firstNode():this.parentFragment.findNextNode(this)},_c=function(){var a,b,c;if(a=this.fragments.length)for(b=0;a>b;b+=1)if(c=this.fragments[b].firstNode())return c;return this.parentFragment.findNextNode(this)},ad=function(a,b,c){var d;return c.push(function(){d=c.Fragment}),function(c){var d,e,f,g,h,i,j,k=this,l=this;if(!(this.shuffling||this.unbound||this.subtype&&this.subtype!==a.SECTION_EACH)){if(this.shuffling=!0,b.scheduleTask(function(){return k.shuffling=!1}),d=this.parentFragment,h=[],c.forEach(function(a,b){var c,d,f,g;return a===b?void(h[a]=l.fragments[b]):(c=l.fragments[b],void 0===e&&(e=b),-1===a?(l.fragmentsToUnrender.push(c),void c.unbind()):(d=a-b,f=l.keypath+"."+b,g=l.keypath+"."+a,c.rebind(l.template.i,a,f,g),c.index=a,void(h[a]=c)))}),g=this.root.get(this.keypath).length,void 0===e){if(this.length===g)return;e=this.length}for(this.length=this.fragments.length=g,this.rendered&&b.addView(this),i={template:this.template.f,root:this.root,owner:this},this.template.i&&(i.indexRef=this.template.i),f=e;g>f;f+=1)j=h[f],j||this.fragmentsToCreate.push(f),this.fragments[f]=j}}}(Zb,x,e),bd=function(){var a;return a=this.docFrag=document.createDocumentFragment(),this.update(),this.rendered=!0,a},cd=function(){var a=/^\[object (?:Array|FileList)\]$/,b=Object.prototype.toString;return function(c){return a.test(b.call(c))}}(),dd=function(a,b,c,d,e){function f(d,e){var f={template:d.template.f,root:d.root,pElement:d.parentFragment.pElement,owner:d};if(d.subtype)switch(d.subtype){case a.SECTION_IF:return k(d,e,!1,f);case a.SECTION_UNLESS:return k(d,e,!0,f);case a.SECTION_WITH:return j(d,f);case a.SECTION_IF_WITH:return i(d,e,f);case a.SECTION_EACH:if(c(e))return h(d,e,f)}return d.ordered=!!b(e),d.ordered?g(d,e,f):c(e)||"function"==typeof e?d.template.i?h(d,e,f):j(d,f):k(d,e,!1,f)}function g(a,b,c){var d,e,f;if(e=b.length,e===a.length)return!1;if(e<a.length)a.fragmentsToUnrender=a.fragments.splice(e,a.length-e),a.fragmentsToUnrender.forEach(m);else if(e>a.length)for(d=a.length;e>d;d+=1)c.context=a.keypath+"."+d,c.index=d,a.template.i&&(c.indexRef=a.template.i),f=new p(c),a.fragmentsToRender.push(a.fragments[d]=f);return a.length=e,!0}function h(a,b,c){var d,e,f,g,h;for(f=a.hasKey||(a.hasKey={}),e=a.fragments.length;e--;)g=a.fragments[e],g.index in b||(h=!0,g.unbind(),a.fragmentsToUnrender.push(g),a.fragments.splice(e,1),f[g.index]=!1);for(d in b)f[d]||(h=!0,c.context=a.keypath+"."+d,c.index=d,a.template.i&&(c.indexRef=a.template.i),g=new p(c),a.fragmentsToRender.push(g),a.fragments.push(g),f[d]=!0);return a.length=a.fragments.length,h}function i(a,b,c){return b?j(a,c):l(a)}function j(a,b){var c;return a.length?void 0:(b.context=a.keypath,b.index=0,c=new p(b),a.fragmentsToRender.push(a.fragments[0]=c),a.length=1,!0)
}function k(a,d,e,f){var g,h,i,j,k;if(h=b(d)&&0===d.length,i=!1,!b(d)&&c(d)){i=!0;for(k in d){i=!1;break}}return g=e?h||i||!d:d&&!h&&!i,g?a.length?a.length>1?(a.fragmentsToUnrender=a.fragments.splice(1),a.fragmentsToUnrender.forEach(m),!0):void 0:(f.index=0,j=new p(f),a.fragmentsToRender.push(a.fragments[0]=j),a.length=1,!0):l(a)}function l(a){return a.length?(a.fragmentsToUnrender=a.fragments.splice(0,a.fragments.length).filter(n),a.fragmentsToUnrender.forEach(m),a.length=a.fragmentsToRender.length=0,!0):void 0}function m(a){a.unbind()}function n(a){return a.rendered}var o,p;return e.push(function(){p=e.Fragment}),o=function(a){var b,c,e=this;this.updating||(this.updating=!0,(b=this.root.viewmodel.wrapped[this.keypath])&&(a=b.get()),this.fragmentsToCreate.length?(c={template:this.template.f,root:this.root,pElement:this.pElement,owner:this,indexRef:this.template.i},this.fragmentsToCreate.forEach(function(a){var b;c.context=e.keypath+"."+a,c.index=a,b=new p(c),e.fragmentsToRender.push(e.fragments[a]=b)}),this.fragmentsToCreate.length=0):f(this,a)&&(this.bubble(),this.rendered&&d.addView(this)),this.value=a,this.updating=!1)}}(Zb,cd,h,x,e),ed=function(a){var b,c,d;for(b="",c=0,d=this.length,c=0;d>c;c+=1)b+=this.fragments[c].toString(a);return b},fd=function(a){function b(a){a.unbind()}var c;return c=function(){this.fragments.forEach(b),a.call(this),this.length=0,this.unbound=!0}}(Dc),gd=function(){function a(a){a.unrender(!0)}function b(a){a.unrender(!1)}var c;return c=function(c){this.fragments.forEach(c?a:b)}}(),hd=function(){var a,b,c,d,e,f,g;for(c=this.renderedFragments;a=this.fragmentsToUnrender.pop();)a.unrender(!0),c.splice(c.indexOf(a),1);for(;a=this.fragmentsToRender.shift();)a.render();for(this.rendered&&(e=this.parentFragment.getNode()),g=this.fragments.length,f=0;g>f;f+=1)a=this.fragments[f],b=c.indexOf(a,f),b!==f?(this.docFrag.appendChild(a.detach()),-1!==b&&c.splice(b,1),c.splice(f,0,a)):this.docFrag.childNodes.length&&(d=a.firstNode(),e.insertBefore(this.docFrag,d));this.rendered&&this.docFrag.childNodes.length&&(d=this.parentFragment.findNextNode(this),e.insertBefore(this.docFrag,d)),this.renderedFragments=this.fragments.slice()},id=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r=function(c){this.type=a.SECTION,this.subtype=c.template.n,this.inverted=this.subtype===a.SECTION_UNLESS,this.pElement=c.pElement,this.fragments=[],this.fragmentsToCreate=[],this.fragmentsToRender=[],this.fragmentsToUnrender=[],this.renderedFragments=[],this.length=0,b.init(this,c)};return r.prototype={bubble:c,detach:d,find:e,findAll:f,findAllComponents:g,findComponent:h,findNextNode:i,firstNode:j,getValue:b.getValue,shuffle:k,rebind:b.rebind,render:l,resolve:b.resolve,setValue:m,toString:n,unbind:o,unrender:p,update:q},r}(Zb,Sc,Uc,Vc,Wc,Xc,Yc,Zc,$c,_c,ad,bd,dd,ed,fd,gd,hd),jd=function(){var a,b;if(this.docFrag){for(a=this.nodes.length,b=0;a>b;b+=1)this.docFrag.appendChild(this.nodes[b]);return this.docFrag}},kd=function(a){return function(b){var c,d,e,f;for(d=this.nodes.length,c=0;d>c;c+=1)if(e=this.nodes[c],1===e.nodeType){if(a(e,b))return e;if(f=e.querySelector(b))return f}return null}}(hb),ld=function(a){return function(b,c){var d,e,f,g,h,i;for(e=this.nodes.length,d=0;e>d;d+=1)if(f=this.nodes[d],1===f.nodeType&&(a(f,b)&&c.push(f),g=f.querySelectorAll(b)))for(h=g.length,i=0;h>i;i+=1)c.push(g[i])}}(hb),md=function(){return this.rendered&&this.nodes[0]?this.nodes[0]:this.parentFragment.findNextNode(this)},nd=function(a,b){function c(a){return g[a]||(g[a]=b(a))}var d,e,f,g={};try{b("table").innerHTML="foo"}catch(h){e=!0,f={TABLE:['<table class="x">',"</table>"],THEAD:['<table><thead class="x">',"</thead></table>"],TBODY:['<table><tbody class="x">',"</tbody></table>"],TR:['<table><tr class="x">',"</tr></table>"],SELECT:['<select class="x">',"</select>"]}}return d=function(b,d,g){var h,i,j,k,l,m=[];if(null!=b&&""!==b){for(e&&(i=f[d.tagName])?(h=c("DIV"),h.innerHTML=i[0]+b+i[1],h=h.querySelector(".x"),"SELECT"===h.tagName&&(j=h.options[h.selectedIndex])):d.namespaceURI===a.svg?(h=c("DIV"),h.innerHTML='<svg class="x">'+b+"</svg>",h=h.querySelector(".x")):(h=c(d.tagName),h.innerHTML=b,"SELECT"===h.tagName&&(j=h.options[h.selectedIndex]));k=h.firstChild;)m.push(k),g.appendChild(k);if("SELECT"===d.tagName)for(l=m.length;l--;)m[l]!==j&&(m[l].selected=!1)}return m}}(B,C),od=function(a){for(var b=[],c=a.length;c--;)b[c]=a[c];return b},pd=function(a){function b(a){return a.selected}var c;return c=function(c){var d,e,f;c&&"select"===c.name&&c.binding&&(d=a(c.node.options).filter(b),c.getAttribute("multiple")?f=d.map(function(a){return a.value}):(e=d[0])&&(f=e.value),void 0!==f&&c.binding.setValue(f),c.bubble())}}(od),qd=function(a,b){return function(){if(this.rendered)throw new Error("Attempted to render an item that was already rendered");return this.docFrag=document.createDocumentFragment(),this.nodes=a(this.value,this.parentFragment.getNode(),this.docFrag),b(this.pElement),this.rendered=!0,this.docFrag}}(nd,pd),rd=function(a){return function(b){var c;(c=this.root.viewmodel.wrapped[this.keypath])&&(b=c.get()),b!==this.value&&(this.value=b,this.parentFragment.bubble(),this.rendered&&a.addView(this))}}(x),sd=function(){function a(a){return a?10===a?32:128>a?a:159>=a?d[a-128]:55296>a?a:57343>=a?65533:65535>=a?a:65533:65533}var b,c,d,e;return c={quot:34,amp:38,apos:39,lt:60,gt:62,nbsp:160,iexcl:161,cent:162,pound:163,curren:164,yen:165,brvbar:166,sect:167,uml:168,copy:169,ordf:170,laquo:171,not:172,shy:173,reg:174,macr:175,deg:176,plusmn:177,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,sup1:185,ordm:186,raquo:187,frac14:188,frac12:189,frac34:190,iquest:191,Agrave:192,Aacute:193,Acirc:194,Atilde:195,Auml:196,Aring:197,AElig:198,Ccedil:199,Egrave:200,Eacute:201,Ecirc:202,Euml:203,Igrave:204,Iacute:205,Icirc:206,Iuml:207,ETH:208,Ntilde:209,Ograve:210,Oacute:211,Ocirc:212,Otilde:213,Ouml:214,times:215,Oslash:216,Ugrave:217,Uacute:218,Ucirc:219,Uuml:220,Yacute:221,THORN:222,szlig:223,agrave:224,aacute:225,acirc:226,atilde:227,auml:228,aring:229,aelig:230,ccedil:231,egrave:232,eacute:233,ecirc:234,euml:235,igrave:236,iacute:237,icirc:238,iuml:239,eth:240,ntilde:241,ograve:242,oacute:243,ocirc:244,otilde:245,ouml:246,divide:247,oslash:248,ugrave:249,uacute:250,ucirc:251,uuml:252,yacute:253,thorn:254,yuml:255,OElig:338,oelig:339,Scaron:352,scaron:353,Yuml:376,fnof:402,circ:710,tilde:732,Alpha:913,Beta:914,Gamma:915,Delta:916,Epsilon:917,Zeta:918,Eta:919,Theta:920,Iota:921,Kappa:922,Lambda:923,Mu:924,Nu:925,Xi:926,Omicron:927,Pi:928,Rho:929,Sigma:931,Tau:932,Upsilon:933,Phi:934,Chi:935,Psi:936,Omega:937,alpha:945,beta:946,gamma:947,delta:948,epsilon:949,zeta:950,eta:951,theta:952,iota:953,kappa:954,lambda:955,mu:956,nu:957,xi:958,omicron:959,pi:960,rho:961,sigmaf:962,sigma:963,tau:964,upsilon:965,phi:966,chi:967,psi:968,omega:969,thetasym:977,upsih:978,piv:982,ensp:8194,emsp:8195,thinsp:8201,zwnj:8204,zwj:8205,lrm:8206,rlm:8207,ndash:8211,mdash:8212,lsquo:8216,rsquo:8217,sbquo:8218,ldquo:8220,rdquo:8221,bdquo:8222,dagger:8224,Dagger:8225,bull:8226,hellip:8230,permil:8240,prime:8242,Prime:8243,lsaquo:8249,rsaquo:8250,oline:8254,frasl:8260,euro:8364,image:8465,weierp:8472,real:8476,trade:8482,alefsym:8501,larr:8592,uarr:8593,rarr:8594,darr:8595,harr:8596,crarr:8629,lArr:8656,uArr:8657,rArr:8658,dArr:8659,hArr:8660,forall:8704,part:8706,exist:8707,empty:8709,nabla:8711,isin:8712,notin:8713,ni:8715,prod:8719,sum:8721,minus:8722,lowast:8727,radic:8730,prop:8733,infin:8734,ang:8736,and:8743,or:8744,cap:8745,cup:8746,"int":8747,there4:8756,sim:8764,cong:8773,asymp:8776,ne:8800,equiv:8801,le:8804,ge:8805,sub:8834,sup:8835,nsub:8836,sube:8838,supe:8839,oplus:8853,otimes:8855,perp:8869,sdot:8901,lceil:8968,rceil:8969,lfloor:8970,rfloor:8971,lang:9001,rang:9002,loz:9674,spades:9824,clubs:9827,hearts:9829,diams:9830},d=[8364,129,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,141,381,143,144,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,157,382,376],e=new RegExp("&(#?(?:x[\\w\\d]+|\\d+|"+Object.keys(c).join("|")+"));?","g"),b=function(b){return b.replace(e,function(b,d){var e;return e="#"!==d[0]?c[d]:"x"===d[1]?parseInt(d.substring(2),16):parseInt(d.substring(1),10),e?String.fromCharCode(a(e)):b})}}(T),td=function(a){return function(){return void 0!=this.value?a(""+this.value):""}}(sd),ud=function(a){return function(b){this.rendered&&b&&(this.nodes.forEach(a),this.rendered=!1)}}(Ac),vd=function(a,b){return function(){var c,d;if(this.rendered){for(;this.nodes&&this.nodes.length;)c=this.nodes.pop(),c.parentNode.removeChild(c);d=this.parentFragment.getNode(),this.nodes=a(this.value,d,this.docFrag),d.insertBefore(this.docFrag,this.parentFragment.findNextNode(this)),b(this.pElement)}}}(nd,pd),wd=function(a,b,c,d,e,f,g,h,i,j,k,l){var m=function(c){this.type=a.TRIPLE,b.init(this,c)};return m.prototype={detach:c,find:d,findAll:e,firstNode:f,getValue:b.getValue,rebind:b.rebind,render:g,resolve:b.resolve,setValue:h,toString:i,unbind:l,unrender:j,update:k},m}(Zb,Sc,jd,kd,ld,md,qd,rd,td,ud,vd,Dc),xd=function(){this.parentFragment.bubble()},yd=function(){var a,b=this.node;return b?((a=b.parentNode)&&a.removeChild(b),b):void 0},zd=function(a){return function(b){return a(this.node,b)?this.node:this.fragment&&this.fragment.find?this.fragment.find(b):void 0}}(hb),Ad=function(a,b){b._test(this,!0)&&b.live&&(this.liveQueries||(this.liveQueries=[])).push(b),this.fragment&&this.fragment.findAll(a,b)},Bd=function(a,b){this.fragment&&this.fragment.findAllComponents(a,b)},Cd=function(a){return this.fragment?this.fragment.findComponent(a):void 0},Dd=function(){return null},Ed=function(){return this.node},Fd=function(a){return this.attributes&&this.attributes[a]?this.attributes[a].value:void 0},Gd=function(){var a,b,c,d;return a="altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath vkern".split(" "),b="attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef gradientTransform gradientUnits kernelMatrix kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent spreadMethod startOffset stdDeviation stitchTiles surfaceScale systemLanguage tableValues targetX targetY textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan".split(" "),c=function(a){for(var b={},c=a.length;c--;)b[a[c].toLowerCase()]=a[c];return b},d=c(a.concat(b)),function(a){var b=a.toLowerCase();return d[b]||b}}(),Hd=function(a,b){return function(){var c=this.fragment.getValue();b(c,this.value)||("id"===this.name&&this.value&&delete this.root.nodes[this.value],this.value=c,"value"===this.name&&this.node&&(this.node._ractive.value=c),this.rendered&&a.addView(this))}}(x,t),Id=function(){var a=/^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|draggable|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;return a}(),Jd=function(a,b){return function(c,d){var e,f;if(e=d.indexOf(":"),-1===e||(f=d.substr(0,e),"xmlns"===f))c.name=c.element.namespace!==a.html?b(d):d;else if(d=d.substring(e+1),c.name=b(d),c.namespace=a[f.toLowerCase()],c.namespacePrefix=f,!c.namespace)throw'Unknown namespace ("'+f+'")'}}(B,Gd),Kd=function(a){return function(b){var c=b.fragment.items;if(1===c.length)return c[0].type===a.INTERPOLATOR?c[0]:void 0}}(Zb),Ld=function(a,b){var c={"accept-charset":"acceptCharset",accesskey:"accessKey",bgcolor:"bgColor","class":"className",codebase:"codeBase",colspan:"colSpan",contenteditable:"contentEditable",datetime:"dateTime",dirname:"dirName","for":"htmlFor","http-equiv":"httpEquiv",ismap:"isMap",maxlength:"maxLength",novalidate:"noValidate",pubdate:"pubDate",readonly:"readOnly",rowspan:"rowSpan",tabindex:"tabIndex",usemap:"useMap"};return function(d,e){var f;!d.pNode||d.namespace||e.pNode.namespaceURI&&e.pNode.namespaceURI!==a.html||(f=c[d.name]||d.name,void 0!==e.pNode[f]&&(d.propertyName=f),(b.test(f)||"value"===f)&&(d.useProperty=!0))}}(B,Id),Md=function(a,b,c,d,e,f){var g;return f.push(function(){g=f.Fragment}),function(f){return this.type=a.ATTRIBUTE,this.element=f.element,this.root=f.root,c(this,f.name),f.value&&"string"!=typeof f.value?(this.parentFragment=this.element.parentFragment,this.fragment=new g({template:f.value,root:this.root,owner:this}),this.value=this.fragment.getValue(),this.interpolator=d(this),this.isBindable=!!this.interpolator&&!this.interpolator.isStatic,e(this,f),void(this.ready=!0)):void(this.value=b.test(this.name)?!0:f.value||"")}}(Zb,Id,Jd,Kd,Ld,e),Nd=function(a,b,c,d){this.fragment&&this.fragment.rebind(a,b,c,d)},Od=function(a,b){var c={"accept-charset":"acceptCharset",accesskey:"accessKey",bgcolor:"bgColor","class":"className",codebase:"codeBase",colspan:"colSpan",contenteditable:"contentEditable",datetime:"dateTime",dirname:"dirName","for":"htmlFor","http-equiv":"httpEquiv",ismap:"isMap",maxlength:"maxLength",novalidate:"noValidate",pubdate:"pubDate",readonly:"readOnly",rowspan:"rowSpan",tabindex:"tabIndex",usemap:"useMap"};return function(d){var e;this.node=d,d.namespaceURI&&d.namespaceURI!==a.html||(e=c[this.name]||this.name,void 0!==d[e]&&(this.propertyName=e),(b.test(e)||"value"===e)&&(this.useProperty=!0),"value"===e&&(this.useProperty=!0,d._ractive.value=this.value)),this.rendered=!0,this.update()}}(B,Id),Pd=function(a){function b(a){return a.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}var c;return c=function(){var c=(g=this).name,d=g.namespacePrefix,e=g.value,f=g.interpolator,g=g.fragment;if(("value"!==c||"select"!==this.element.name&&"textarea"!==this.element.name)&&("value"!==c||void 0===this.element.getAttribute("contenteditable")))return"name"===c&&"input"===this.element.name&&f?"name={{"+(f.keypath||f.ref)+"}}":a.test(c)?e?c:"":(g&&(e=g.toString()),d&&(c=d+":"+c),e?c+'="'+b(e)+'"':c)}}(Id),Qd=function(){this.fragment&&this.fragment.unbind(),"id"===this.name&&delete this.root.nodes[this.value]},Rd=function(){var a,b,c,d,e=this.value;if(!this.locked)for(this.node._ractive.value=e,a=this.node.options,d=a.length;d--;)if(b=a[d],c=b._ractive?b._ractive.value:b.value,c==e){b.selected=!0;break}},Sd=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]==b)return!0;return!1},Td=function(a,b){return function(){var c,d,e,f,g=this.value;for(b(g)||(g=[g]),c=this.node.options,d=c.length;d--;)e=c[d],f=e._ractive?e._ractive.value:e.value,e.selected=a(g,f)}}(Sd,g),Ud=function(){var a=(b=this).node,b=b.value;a.checked=b==a._ractive.value},Vd=function(a){return function(){var b,c,d,e,f=this.node;if(b=f.checked,f.value=this.element.getAttribute("value"),f.checked=this.element.getAttribute("value")===this.element.getAttribute("name"),b&&!f.checked&&this.element.binding&&(d=this.element.binding.siblings,e=d.length)){for(;e--;){if(c=d[e],!c.element.node)return;if(c.element.node.checked)return a.addViewmodel(c.root.viewmodel),c.handleChange()}a.addViewmodel(c.root.viewmodel),this.root.viewmodel.set(c.keypath,void 0)}}}(x),Wd=function(a){return function(){var b,c,d=(f=this).element,e=f.node,f=f.value;if(b=d.getAttribute("value"),a(f)){for(c=f.length;c--;)if(b==f[c])return void(e.checked=!0);e.checked=!1}else e.checked=f==b}}(g),Xd=function(){var a,b;a=this.node,b=this.value,void 0===b&&(b=""),a.className=b},Yd=function(){var a=(b=this).node,b=b.value;this.root.nodes[b]=a,a.id=b},Zd=function(){var a,b;a=this.node,b=this.value,void 0===b&&(b=""),a.style.setAttribute("cssText",b)},$d=function(){var a=this.value;void 0===a&&(a=""),this.locked||(this.node.innerHTML=a)},_d=function(){var a=(b=this).node,b=b.value;a._ractive.value=b,this.locked||(a.value=void 0==b?"":b)},ae=function(){this.locked||(this.node[this.propertyName]=this.value)},be=function(a){return function(){var b=(f=this).node,c=f.namespace,d=f.name,e=f.value,f=f.fragment;c?b.setAttributeNS(c,d,(f||e).toString()):a.test(d)?e?b.setAttribute(d,""):b.removeAttribute(d):b.setAttribute(d,(f||e).toString())}}(Id),ce=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){return function(){var o,p,q=(s=this).name,r=s.element,s=s.node;"id"===q?p=i:"value"===q?"select"===r.name&&"value"===q?p=r.getAttribute("multiple")?d:c:"textarea"===r.name?p=l:null!=r.getAttribute("contenteditable")?p=k:"input"===r.name&&(o=r.getAttribute("type"),p="file"===o?b:"radio"===o&&r.binding&&"name"===r.binding.name?f:l):this.twoway&&"name"===q?"radio"===s.type?p=e:"checkbox"===s.type&&(p=g):"style"===q&&s.style.setAttribute?p=j:"class"!==q||s.namespaceURI&&s.namespaceURI!==a.html?this.useProperty&&(p=m):p=h,p||(p=n),this.update=p,this.update()}}(B,$,Rd,Td,Ud,Vd,Wd,Xd,Yd,Zd,$d,_d,ae,be),de=function(a,b,c,d,e,f,g){var h=function(a){this.init(a)};return h.prototype={bubble:a,init:b,rebind:c,render:d,toString:e,unbind:f,update:g},h}(Hd,Md,Nd,Od,Pd,Qd,ce),ee=function(a){return function(b,c){var d,e,f=[];for(d in c)c.hasOwnProperty(d)&&(e=new a({element:b,name:d,value:c[d],root:b.root}),f.push(f[d]=e));return f}}(de),fe=function(a,b,c,d){function e(a,b){var c=b?"svg":"div";return i.innerHTML="<"+c+" "+a+"></"+c+">",d(i.childNodes[0].attributes)}function f(a,b){for(var c=a.length;c--;)if(a[c].name===b.name)return!1;return!0}var g,h,i;"undefined"!=typeof document&&(i=c("div")),a.push(function(){h=a.Fragment});var j=function(a,b){this.element=a,this.root=a.root,this.parentFragment=a.parentFragment,this.attributes=[],this.fragment=new h({root:a.root,owner:this,template:[b]})};return j.prototype={bubble:function(){this.node&&this.update(),this.element.bubble()},rebind:function(a,b,c,d){this.fragment.rebind(a,b,c,d)},render:function(a){this.node=a,this.isSvg=a.namespaceURI===b.svg,this.update()},unbind:function(){this.fragment.unbind()},update:function(){var a,b,c=this;a=this.fragment.toString(),b=e(a,this.isSvg),this.attributes.filter(function(a){return f(b,a)}).forEach(function(a){c.node.removeAttribute(a.name)}),b.forEach(function(a){c.node.setAttribute(a.name,a.value)}),this.attributes=b},toString:function(){return this.fragment.toString()}},g=j}(e,B,C,od),ge=function(a){return function(b,c){return c?c.map(function(c){return new a(b,c)}):[]}}(fe),he=function(a){for(var b,c,d=Array.prototype.slice,e=d.call(arguments,1);c=e.shift();)for(b in c)c.hasOwnProperty(b)&&(a[b]=c[b]);return a},ie=function(a,b,c,d,e){var f=function(a){var c,d,e;return this.element=a,this.root=a.root,this.attribute=a.attributes[this.name||"value"],c=this.attribute.interpolator,c.twowayBinding=this,c.keypath&&"${"===c.keypath.substr(0,2)?(b("Two-way binding does not work with expressions (`"+c.keypath.slice(2,-1)+"`)"),!1):(c.keypath||c.resolver.forceResolution(),this.keypath=d=c.keypath,void(void 0===this.root.viewmodel.get(d)&&this.getInitialValue&&(e=this.getInitialValue(),void 0!==e&&this.root.viewmodel.set(d,e))))};return f.prototype={handleChange:function(){var b=this;a.start(this.root),this.attribute.locked=!0,this.root.viewmodel.set(this.keypath,this.getValue()),a.scheduleTask(function(){return b.attribute.locked=!1}),a.end()},rebound:function(){var a,b,c;b=this.keypath,c=this.attribute.interpolator.keypath,b!==c&&(e(this.root._twowayBindings[b],this),this.keypath=c,a=this.root._twowayBindings[c]||(this.root._twowayBindings[c]=[]),a.push(this))},unbind:function(){}},f.extend=function(a){var b,e=this;return b=function(a){f.call(this,a),this.init&&this.init()},b.prototype=c(e.prototype),d(b.prototype,a),b.extend=f.extend,b},f}(x,l,S,he,p),je=function(){this._ractive.binding.handleChange()},ke=function(a,b){var c=a.extend({getInitialValue:function(){return this.element.fragment?this.element.fragment.toString():""},render:function(){var a=this.element.node;a.addEventListener("change",b,!1),this.root.lazy||(a.addEventListener("input",b,!1),a.attachEvent&&a.addEventListener("keyup",b,!1))},unrender:function(){var a=this.element.node;a.removeEventListener("change",b,!1),a.removeEventListener("input",b,!1),a.removeEventListener("keyup",b,!1)},getValue:function(){return this.element.node.innerHTML}});return c}(ie,je),le=function(){var a={};return function(b,c,d){var e=b+c+d;return a[e]||(a[e]=[])}}(),me=function(a,b,c,d,e){var f=c.extend({name:"checked",init:function(){this.siblings=d(this.root._guid,"radio",this.element.getAttribute("name")),this.siblings.push(this)},render:function(){var a=this.element.node;a.addEventListener("change",e,!1),a.attachEvent&&a.addEventListener("click",e,!1)},unrender:function(){var a=this.element.node;a.removeEventListener("change",e,!1),a.removeEventListener("click",e,!1)},handleChange:function(){a.start(this.root),this.siblings.forEach(function(a){a.root.viewmodel.set(a.keypath,a.getValue())}),a.end()},getValue:function(){return this.element.node.checked},unbind:function(){b(this.siblings,this)}});return f}(x,p,ie,le,je),ne=function(a,b,c,d){var e=b.extend({name:"name",init:function(){this.siblings=d(this.root._guid,"radioname",this.keypath),this.siblings.push(this),this.radioName=!0,this.attribute.twoway=!0},getInitialValue:function(){return this.element.getAttribute("checked")?this.element.getAttribute("value"):void 0},render:function(){var a=this.element.node;a.name="{{"+this.keypath+"}}",a.checked=this.root.viewmodel.get(this.keypath)==this.element.getAttribute("value"),a.addEventListener("change",c,!1),a.attachEvent&&a.addEventListener("click",c,!1)},unrender:function(){var a=this.element.node;a.removeEventListener("change",c,!1),a.removeEventListener("click",c,!1)},getValue:function(){var a=this.element.node;return a._ractive?a._ractive.value:a.value},handleChange:function(){this.element.node.checked&&b.prototype.handleChange.call(this)},rebound:function(a,c,d,e){var f;b.prototype.rebound.call(this,a,c,d,e),(f=this.element.node)&&(f.name="{{"+this.keypath+"}}")},unbind:function(){a(this.siblings,this)}});return e}(p,ie,je,le),oe=function(a,b,c,d,e,f){function g(a){return a.isChecked}function h(a){return a.element.getAttribute("value")}var i=d.extend({name:"name",getInitialValue:function(){return this.noInitialValue=!0,[]},init:function(){var a,b;this.checkboxName=!0,this.attribute.twoway=!0,this.siblings=e(this.root._guid,"checkboxes",this.keypath),this.siblings.push(this),this.noInitialValue&&(this.siblings.noInitialValue=!0),this.siblings.noInitialValue&&this.element.getAttribute("checked")&&(a=this.root.viewmodel.get(this.keypath),b=this.element.getAttribute("value"),a.push(b))},unbind:function(){c(this.siblings,this)},render:function(){var c,d,e=this.element.node;c=this.root.viewmodel.get(this.keypath),d=this.element.getAttribute("value"),this.isChecked=a(c)?b(c,d):c==d,e.name="{{"+this.keypath+"}}",e.checked=this.isChecked,e.addEventListener("change",f,!1),e.attachEvent&&e.addEventListener("click",f,!1)},unrender:function(){var a=this.element.node;a.removeEventListener("change",f,!1),a.removeEventListener("click",f,!1)},changed:function(){var a=!!this.isChecked;return this.isChecked=this.element.node.checked,this.isChecked===a},handleChange:function(){this.isChecked=this.element.node.checked,d.prototype.handleChange.call(this)},getValue:function(){return this.siblings.filter(g).map(h)}});return i}(g,Sd,p,ie,le,je),pe=function(a,b){var c=a.extend({name:"checked",render:function(){var a=this.element.node;a.addEventListener("change",b,!1),a.attachEvent&&a.addEventListener("click",b,!1)},unrender:function(){var a=this.element.node;a.removeEventListener("change",b,!1),a.removeEventListener("click",b,!1)},getValue:function(){return this.element.node.checked}});return c}(ie,je),qe=function(a,b,c){var d=b.extend({getInitialValue:function(){var a,b,c,d,e=this.element.options;if(void 0===this.element.getAttribute("value")&&(b=a=e.length,a)){for(;b--;)if(e[b].getAttribute("selected")){c=e[b].getAttribute("value"),d=!0;break}if(!d)for(;++b<a;)if(!e[b].getAttribute("disabled")){c=e[b].getAttribute("value");break}return void 0!==c&&(this.element.attributes.value.value=c),c}},render:function(){this.element.node.addEventListener("change",c,!1)},unrender:function(){this.element.node.removeEventListener("change",c,!1)},setValue:function(b){a.addViewmodel(this.root.viewmodel),this.root.viewmodel.set(this.keypath,b)},getValue:function(){var a,b,c,d,e;for(a=this.element.node.options,c=a.length,b=0;c>b;b+=1)if(d=a[b],a[b].selected)return e=d._ractive?d._ractive.value:d.value},forceUpdate:function(){var b=this,c=this.getValue();void 0!==c&&(this.attribute.locked=!0,a.addViewmodel(this.root.viewmodel),a.scheduleTask(function(){return b.attribute.locked=!1}),this.root.viewmodel.set(this.keypath,c))}});return d}(x,ie,je),re=function(a){return function(b,c){var d;if(!a(b)||!a(c))return!1;if(b.length!==c.length)return!1;for(d=b.length;d--;)if(b[d]!==c[d])return!1;return!0}}(g),se=function(a,b,c,d){var e=c.extend({getInitialValue:function(){return this.element.options.filter(function(a){return a.getAttribute("selected")}).map(function(a){return a.getAttribute("value")})},render:function(){var a;this.element.node.addEventListener("change",d,!1),a=this.root.viewmodel.get(this.keypath),void 0===a&&this.handleChange()},unrender:function(){this.element.node.removeEventListener("change",d,!1)},setValue:function(){throw new Error("TODO not implemented yet")},getValue:function(){var a,b,c,d,e,f;for(a=[],b=this.element.node.options,d=b.length,c=0;d>c;c+=1)e=b[c],e.selected&&(f=e._ractive?e._ractive.value:e.value,a.push(f));return a},handleChange:function(){var a,d,e;return a=this.attribute,d=a.value,e=this.getValue(),void 0!==d&&b(e,d)||c.prototype.handleChange.call(this),this},forceUpdate:function(){var b=this,c=this.getValue();void 0!==c&&(this.attribute.locked=!0,a.addViewmodel(this.root.viewmodel),a.scheduleTask(function(){return b.attribute.locked=!1}),this.root.viewmodel.set(this.keypath,c))},updateModel:function(){void 0!==this.attribute.value&&this.attribute.value.length||this.root.viewmodel.set(this.keypath,this.initialValue)}});return e}(x,re,qe,je),te=function(a,b){var c=a.extend({render:function(){this.element.node.addEventListener("change",b,!1)},unrender:function(){this.element.node.removeEventListener("change",b,!1)},getValue:function(){return this.element.node.files}});return c}(ie,je),ue=function(a,b){function c(){var a;b.call(this),a=this._ractive.root.viewmodel.get(this._ractive.binding.keypath,f),this.value=void 0==a?"":a}var d,e,f;return f={evaluateWrapped:!0},e=a.extend({getInitialValue:function(){return""},getValue:function(){return this.element.node.value},render:function(){var a=this.element.node;a.addEventListener("change",b,!1),this.root.lazy||(a.addEventListener("input",b,!1),a.attachEvent&&a.addEventListener("keyup",b,!1)),a.addEventListener("blur",c,!1)},unrender:function(){var a=this.element.node;a.removeEventListener("change",b,!1),a.removeEventListener("input",b,!1),a.removeEventListener("keyup",b,!1),a.removeEventListener("blur",c,!1)}}),d=e}(ie,je),ve=function(a){return a.extend({getInitialValue:function(){return void 0},getValue:function(){var a=parseFloat(this.element.node.value);return isNaN(a)?void 0:a}})}(ue),we=function(a,b,c,d,e,f,g,h,i,j,k){function l(a){return a&&a.isBindable}var m;return m=function(m){var n,o,p,q,r=m.attributes;return m.binding&&(m.binding.teardown(),m.binding=null),(m.getAttribute("contenteditable")||r.contenteditable&&l(r.contenteditable))&&l(r.value)?o=b:"input"===m.name?(n=m.getAttribute("type"),"radio"===n||"checkbox"===n?(p=l(r.name),q=l(r.checked),p&&q&&a.error({message:"badRadioInputBinding"}),p?o="radio"===n?d:e:q&&(o="radio"===n?c:f)):"file"===n&&l(r.value)?o=i:l(r.value)&&(o="number"===n||"range"===n?j:k)):"select"===m.name&&l(r.value)?o=m.getAttribute("multiple")?h:g:"textarea"===m.name&&l(r.value)&&(o=k),o?new o(m):void 0}}(n,ke,me,ne,oe,pe,qe,se,te,ve,ue),xe=function(){var a=this.getAction();a&&!this.hasListener?this.listen():!a&&this.hasListener&&this.unrender()},ye=function(a){return function(b){a(this.root,this.getAction(),{event:b})}}(ub),ze=function(){return this.action.toString().trim()},Ae=function(a,b,c,d,e){function f(a){var b,c,d;if(b=this.root,"function"!=typeof b[this.method])throw new Error('Attempted to call a non-existent method ("'+this.method+'")');c=this.keypaths.map(function(c){var d,e,f;if(void 0===c)return void 0;if(c.eventObject){if(d=a,e=c.refinements.length)for(f=0;e>f;f+=1)d=d[c.refinements[f]]}else d=b.viewmodel.get(c);return d}),b.event=a,d=this.fn.apply(null,c),b[this.method].apply(b,d),delete b.event}function g(a){d(this.root,this.getAction(),{event:a,args:this.params})}function h(a){var b=this.dynamicParams.getValue(k);"string"==typeof b&&(b=b.substr(1,b.length-2)),d(this.root,this.getAction(),{event:a,args:b})}var i,j,k={args:!0},l=/^event(?:\.(.+))?/;return c.push(function(){j=c.Fragment}),i=function(c,d,i){var k,m,n,o=this;o.element=c,o.root=c.root,o.name=d,-1!==d.indexOf("*")&&(e.error({debug:this.root.debug,message:"noElementProxyEventWildcards",args:{element:c.tagName,event:d}}),this.invalid=!0),i.m?(m=i.a.r,o.method=i.m,o.keypaths=[],o.fn=a(i.a.s,m.length),o.parentFragment=c.parentFragment,n=o.root,o.refResolvers=m.map(function(a,c){var d;return(d=l.exec(a))?(o.keypaths[c]={eventObject:!0,refinements:d[1]?d[1].split("."):[]},null):b(o,a,function(a){o.resolve(c,a)})}),this.fire=f):(k=i.n||i,"string"!=typeof k&&(k=new j({template:k,root:this.root,owner:this})),this.action=k,i.d?(this.dynamicParams=new j({template:i.d,root:this.root,owner:this.element}),this.fire=h):i.a&&(this.params=i.a,this.fire=g))}}(Lc,Kc,e,ub,n),Be=function(a){var b,c;b=this._ractive,c=b.events[a.type],c.fire({node:this,original:a,index:b.index,keypath:b.keypath,context:b.root.get(b.keypath)})},Ce=function(a,b,c){function d(a){return f[a]||(f[a]=function(b){var c=b.node._ractive;b.index=c.index,b.keypath=c.keypath,b.context=c.root.get(c.keypath),c.events[a].fire(b)}),f[a]}var e,f={},g={touchstart:!0,touchmove:!0,touchend:!0,touchcancel:!0,touchleave:!0};return e=function(){var e,f=this.name;if(!this.invalid){if(e=a.registries.events.find(this.root,f))this.custom=e(this.node,d(f));else{if(!("on"+f in this.node||window&&"on"+f in window))return void(g[f]||c.error({debug:this.root.debug,message:"missingPlugin",args:{plugin:"event",name:f}}));this.node.addEventListener(f,b,!1)}this.hasListener=!0}}}(bb,Be,n),De=function(a,b,c,d){function e(e){e&&e.rebind(a,b,c,d)}var f;return this.method?(f=this.element.parentFragment,void this.refResolvers.forEach(e)):("string"!=typeof this.action&&e(this.action),void(this.dynamicParams&&e(this.dynamicParams)))},Ee=function(){this.node=this.element.node,this.node._ractive.events[this.name]=this,(this.method||this.getAction())&&this.listen()},Fe=function(a,b){this.keypaths[a]=b},Ge=function(){function a(a){a.unbind()}var b;return b=function(){return this.method?void this.refResolvers.forEach(a):("string"!=typeof this.action&&this.action.unbind(),void(this.dynamicParams&&this.dynamicParams.unbind()))}}(),He=function(a){return function(){this.custom?this.custom.teardown():this.node.removeEventListener(this.name,a,!1),this.hasListener=!1}}(Be),Ie=function(a,b,c,d,e,f,g,h,i,j){var k=function(a,b,c){this.init(a,b,c)};return k.prototype={bubble:a,fire:b,getAction:c,init:d,listen:e,rebind:f,render:g,resolve:h,unbind:i,unrender:j},k
}(xe,ye,ze,Ae,Ce,De,Ee,Fe,Ge,He),Je=function(a){return function(b,c){var d,e,f,g,h=[];for(e in c)if(c.hasOwnProperty(e))for(f=e.split("-"),d=f.length;d--;)g=new a(b,f[d],c[e]),h.push(g);return h}}(Ie),Ke=function(a,b,c){var d,e,f;return b.push(function(){d=b.Fragment}),e={args:!0},f=function(b,f){var g,h,i,j=this;j.element=b,j.root=g=b.root,h=f.n||f,"string"!=typeof h&&(i=new d({template:h,root:g,owner:b}),h=i.toString(),i.unbind()),f.a?j.params=f.a:f.d&&(j.fragment=new d({template:f.d,root:g,owner:b}),j.params=j.fragment.getValue(e),j.fragment.bubble=function(){this.dirtyArgs=this.dirtyValue=!0,j.params=this.getValue(e),j.ready&&j.update()}),j.fn=c.registries.decorators.find(g,h),j.fn||a.error({debug:g.debug,message:"missingPlugin",args:{plugin:"decorator",name:h}})},f.prototype={init:function(){var a,b,c,d=this;if(a=d.element.node,d.params?(c=[a].concat(d.params),b=d.fn.apply(d.root,c)):b=d.fn.call(d.root,a),!b||!b.teardown)throw new Error("Decorator definition must return an object with a teardown method");d.actual=b,d.ready=!0},update:function(){this.actual.update?this.actual.update.apply(this.root,this.params):(this.actual.teardown(!0),this.init())},rebind:function(a,b,c,d){this.fragment&&this.fragment.rebind(a,b,c,d)},teardown:function(a){this.actual.teardown(),!a&&this.fragment&&this.fragment.unbind()}},f}(n,e,bb),Le=function(a){function b(a,b){for(var c=a.length;c--;)if(a[c]==b)return!0}var c;return c=function(c){var d,e,f,g,h;d=c.node,d&&(g=a(d.options),e=c.getAttribute("value"),f=c.getAttribute("multiple"),void 0!==e?(g.forEach(function(a){var c,d;c=a._ractive?a._ractive.value:a.value,d=f?b(e,c):e==c,d&&(h=!0),a.selected=d}),h||(g[0]&&(g[0].selected=!0),c.binding&&c.binding.forceUpdate())):c.binding&&c.binding.forceUpdate())}}(od),Me=function(a,b){return function(){var c=this;this.dirty||(this.dirty=!0,a.scheduleTask(function(){b(c),c.dirty=!1})),this.parentFragment.bubble()}}(x,Le),Ne=function(a){do if("select"===a.name)return a;while(a=a.parent)},Oe=function(a){return function(b,c){b.select=a(b.parent),b.select&&(b.select.options.push(b),c.a||(c.a={}),void 0!==c.a.value||c.a.hasOwnProperty("disabled")||(c.a.value=c.f),"selected"in c.a&&void 0!==b.select.getAttribute("value")&&delete c.a.selected)}}(Ne),Pe=function(a,b,c,d,e,f,g,h,i,j){var k;return j.push(function(){k=j.Fragment}),function(j){var l,m,n,o,p;this.type=a.ELEMENT,l=this.parentFragment=j.parentFragment,m=this.template=j.template,this.parent=j.pElement||l.pElement,this.root=n=l.root,this.index=j.index,this.name=b(m.e),"option"===this.name&&i(this,m),"select"===this.name&&(this.options=[],this.bubble=h),this.attributes=c(this,m.a),this.conditionalAttributes=d(this,m.m),m.f&&(this.fragment=new k({template:m.f,root:n,owner:this,pElement:this})),n.twoway&&(o=e(this,m.a))&&(this.binding=o,p=this.root._twowayBindings[o.keypath]||(this.root._twowayBindings[o.keypath]=[]),p.push(o)),m.v&&(this.eventHandlers=f(this,m.v)),m.o&&(this.decorator=new g(this,m.o)),this.intro=m.t0||m.t1,this.outro=m.t0||m.t2}}(Zb,Gd,ee,ge,we,Je,Ke,Me,Oe,e),Qe=function(a){return function(b,c){return b===c||a(b,c)}}(Fc),Re=function(a,b){return function(c,d,e,f){var g=c[d];g&&!a(g,f)&&a(g,e)&&(c[d]=b(g,e,f))}}(Qe,Gc),Se=function(a){return function(b,c,d,e){function f(a){a.rebind(b,c,d,e)}var g,h,i,j;if(this.attributes&&this.attributes.forEach(f),this.conditionalAttributes&&this.conditionalAttributes.forEach(f),this.eventHandlers&&this.eventHandlers.forEach(f),this.decorator&&f(this.decorator),this.fragment&&f(this.fragment),i=this.liveQueries)for(j=this.root,g=i.length;g--;)i[g]._makeDirty();this.node&&(h=this.node._ractive)&&(a(h,"keypath",d,e),void 0!=b&&(h.index[b]=c))}}(Re),Te=function(a){var b;(a.attributes.width||a.attributes.height)&&a.node.addEventListener("load",b=function(){var c=a.getAttribute("width"),d=a.getAttribute("height");void 0!==c&&a.node.setAttribute("width",c),void 0!==d&&a.node.setAttribute("height",d),a.node.removeEventListener("load",b,!1)},!1)},Ue=function(a,b,c){var d,e={};return c.push(function(){d=c.Fragment}),function(c,f,g){var h,i,j,k=this;return k.element=c,k.root=h=c.root,k.isIntro=g,i=f.n||f,"string"!=typeof i&&(j=new d({template:i,root:h,owner:c}),i=j.toString(),j.unbind()),k.name=i,f.a?k.params=f.a:f.d&&(j=new d({template:f.d,root:h,owner:c}),k.params=j.getValue(e),j.unbind()),k._fn=b.registries.transitions.find(h,i),k._fn?void 0:void a.error({debug:h.debug,message:"missingPlugin",args:{plugin:"transition",name:i}})}}(n,bb,e),Ve=function(a){return a.replace(/-([a-zA-Z])/g,function(a,b){return b.toUpperCase()})},We=function(a,b,c,d){var e,f,g;return a?(f={},g=c("div").style,e=function(a){var c,e,h;if(a=d(a),!f[a])if(void 0!==g[a])f[a]=a;else for(h=a.charAt(0).toUpperCase()+a.substring(1),c=b.length;c--;)if(e=b[c],void 0!==g[e+h]){f[a]=e+h;break}return f[a]}):e=null,e}(D,J,C,Ve),Xe=function(a,b,c,d){var e,f;return b?(f=window.getComputedStyle||a.getComputedStyle,e=function(a){var b,e,g,h,i;if(b=f(this.node),"string"==typeof a)return i=b[d(a)],"0px"===i&&(i=0),i;if(!c(a))throw new Error("Transition$getStyle must be passed a string, or an array of strings representing CSS properties");for(e={},g=a.length;g--;)h=a[g],i=b[d(h)],"0px"===i&&(i=0),e[h]=i;return e}):e=null,e}(T,D,g,We),Ye=function(a){return function(b,c){var d;if("string"==typeof b)this.node.style[a(b)]=c;else for(d in b)b.hasOwnProperty(d)&&(this.node.style[a(d)]=b[d]);return this}}(We),Ze=function(a,b,c){function d(a){return a}var e,f=function(e){var f;this.duration=e.duration,this.step=e.step,this.complete=e.complete,"string"==typeof e.easing?(f=e.root.easing[e.easing],f||(a('Missing easing function ("'+e.easing+'"). You may need to download a plugin from [TODO]'),f=d)):f="function"==typeof e.easing?e.easing:d,this.easing=f,this.start=b(),this.end=this.start+this.duration,this.running=!0,c.add(this)};return f.prototype={tick:function(a){var b,c;return this.running?a>this.end?(this.step&&this.step(1),this.complete&&this.complete(1),!1):(b=a-this.start,c=this.easing(b/this.duration),this.step&&this.step(c),!0):!1},stop:function(){this.abort&&this.abort(),this.running=!1}},e=f}(l,L,M),$e=function(a){var b=new RegExp("^-(?:"+a.join("|")+")-");return function(a){return a.replace(b,"")}}(J),_e=function(a){var b=new RegExp("^(?:"+a.join("|")+")([A-Z])");return function(a){var c;return a?(b.test(a)&&(a="-"+a),c=a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})):""}}(J),af=function(a,b,c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r={},s={};return a?(k=c("div").style,function(){void 0!==k.transition?(l="transition",m="transitionend",n=!0):void 0!==k.webkitTransition?(l="webkitTransition",m="webkitTransitionEnd",n=!0):n=!1}(),l&&(o=l+"Duration",p=l+"Property",q=l+"TimingFunction"),j=function(a,c,j,k,l){setTimeout(function(){var t,u,v,w,x;w=function(){u&&v&&(a.root.fire(a.name+":end",a.node,a.isIntro),l())},t=(a.node.namespaceURI||"")+a.node.tagName,a.node.style[p]=k.map(g).map(i).join(","),a.node.style[q]=i(j.easing||"linear"),a.node.style[o]=j.duration/1e3+"s",x=function(b){var c;c=k.indexOf(d(h(b.propertyName))),-1!==c&&k.splice(c,1),k.length||(a.node.removeEventListener(m,x,!1),v=!0,w())},a.node.addEventListener(m,x,!1),setTimeout(function(){for(var h,i,l,o,p,q=k.length,y=[];q--;)o=k[q],h=t+o,n&&!s[h]&&(a.node.style[g(o)]=c[o],r[h]||(i=a.getStyle(o),r[h]=a.getStyle(o)!=c[o],s[h]=!r[h],s[h]&&(a.node.style[g(o)]=i))),(!n||s[h])&&(void 0===i&&(i=a.getStyle(o)),l=k.indexOf(o),-1===l?b("Something very strange happened with transitions. If you see this message, please let @RactiveJS know. Thanks!"):k.splice(l,1),p=/[^\d]*$/.exec(c[o])[0],y.push({name:g(o),interpolator:e(parseFloat(i),parseFloat(c[o])),suffix:p}));y.length?new f({root:a.root,duration:j.duration,easing:d(j.easing||""),step:function(b){var c,d;for(d=y.length;d--;)c=y[d],a.node.style[c.name]=c.interpolator(b)+c.suffix},complete:function(){u=!0,w()}}):u=!0,k.length||(a.node.removeEventListener(m,x,!1),v=!0,w())},0)},j.delay||0)}):j=null,j}(D,l,C,Ve,cb,Ze,We,$e,_e),bf=function(a){function b(){i.hidden=document[e]}function c(){i.hidden=!0}function d(){i.hidden=!1}var e,f,g,h,i;if("undefined"!=typeof document){if(e="hidden",i={},e in document)g="";else for(h=a.length;h--;)f=a[h],e=f+"Hidden",e in document&&(g=f);void 0!==g?(document.addEventListener(g+"visibilitychange",b),b()):("onfocusout"in document?(document.addEventListener("focusout",c),document.addEventListener("focusin",d)):(window.addEventListener("pagehide",c),window.addEventListener("blur",c),window.addEventListener("pageshow",d),window.addEventListener("focus",d)),i.hidden=!1)}return i}(J),cf=function(a,b,c,d,e,f,g){var h,i,j;return b?(i=window.getComputedStyle||a.getComputedStyle,h=function(a,b,h,k){var l,m=this;if(g.hidden)return this.setStyle(a,b),j||(j=d.resolve());"string"==typeof a?(l={},l[a]=b):(l=a,k=h,h=b),h||(c('The "'+m.name+'" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340'),h=m,k=m.complete);var n=new d(function(a){var b,c,d,g,j,k,n;if(!h.duration)return m.setStyle(l),void a();for(b=Object.keys(l),c=[],d=i(m.node),j={},k=b.length;k--;)n=b[k],g=d[e(n)],"0px"===g&&(g=0),g!=l[n]&&(c.push(n),m.node.style[e(n)]=g);return c.length?void f(m,l,h,c,a):void a()});return k&&(c("t.animateStyle returns a Promise as of 0.4.0. Transition authors should do t.animateStyle(...).then(callback)"),n.then(k)),n}):h=null,h}(T,D,l,q,We,af,bf),df=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);return c.forEach(function(b){for(var c in b)!b.hasOwnProperty(c)||c in a||(a[c]=b[c])}),a},ef=function(a){return function(b,c){return"number"==typeof b?b={duration:b}:"string"==typeof b?b="slow"===b?{duration:600}:"fast"===b?{duration:200}:{duration:400}:b||(b={}),a({},b,c)}}(df),ff=function(){function a(a,b){b?a.setAttribute("style",b):(a.getAttribute("style"),a.removeAttribute("style"))}var b;return b=function(){var b,c,d,e=this;return b=e.node=e.element.node,c=b.getAttribute("style"),e.complete=function(f){d||(!f&&e.isIntro&&a(b,c),b._ractive.transition=null,e._manager.remove(e),d=!0)},e._fn?void e._fn.apply(e.root,[e].concat(e.params)):void e.complete()}}(),gf=function(a,b,c,d,e,f,g){var h,i;return g.push(function(){h=g.Fragment}),i=function(a,b,c){this.init(a,b,c)},i.prototype={init:a,start:f,getStyle:b,setStyle:c,animateStyle:d,processParams:e},i}(Ue,Xe,Ye,cf,ef,ff,e),hf=function(a,b,c,d,e,f,g,h,i,j,k){function l(b){var c,d,e;return c=(d=b.getAttribute("xmlns"))?d:"svg"===b.name?a.svg:(e=b.parent)?"foreignObject"===e.name?a.html:e.node.namespaceURI:b.root.el.namespaceURI}function m(a){var c,d,e;if(a.select&&(d=a.select.getAttribute("value"),void 0!==d))if(c=a.getAttribute("value"),a.select.node.multiple&&b(d)){for(e=d.length;e--;)if(c==d[e]){a.node.selected=!0;break}}else a.node.selected=c==d}function n(a){var b,c,d,e,f;b=a.root;do for(c=b._liveQueries,d=c.length;d--;)e=c[d],f=c["_"+e],f._test(a)&&(a.liveQueries||(a.liveQueries=[])).push(f);while(b=b._parent)}var o,p,q;return p=function(){var a=this.node,b=this.fragment.toString(!1);if(window&&window.appearsToBeIELessEqual8&&(a.type="text/css"),a.styleSheet)a.styleSheet.cssText=b;else{for(;a.hasChildNodes();)a.removeChild(a.firstChild);a.appendChild(document.createTextNode(b))}},q=function(){this.node.type&&"text/javascript"!==this.node.type||c("Script tag was updated. This does not cause the code to be re-evaluated!"),this.node.text=this.fragment.toString(!1)},o=function(){var a,b,c=this,o=this.root;if(a=l(this),b=this.node=e(this.name,a),o.constructor.css&&this.parentFragment.getNode()===o.el&&this.node.setAttribute("data-rvcguid",o.constructor._guid),f(this.node,"_ractive",{value:{proxy:this,keypath:i(this.parentFragment),index:this.parentFragment.indexRefs,events:d(null),root:o}}),this.attributes.forEach(function(a){return a.render(b)}),this.conditionalAttributes.forEach(function(a){return a.render(b)}),this.fragment&&("script"===this.name?(this.bubble=q,this.node.text=this.fragment.toString(!1),this.fragment.unrender=g):"style"===this.name?(this.bubble=p,this.bubble(),this.fragment.unrender=g):this.binding&&this.getAttribute("contenteditable")?this.fragment.unrender=g:this.node.appendChild(this.fragment.render())),this.eventHandlers&&this.eventHandlers.forEach(function(a){return a.render()}),this.binding&&(this.binding.render(),this.node._ractive.binding=this.binding),"img"===this.name&&j(this),this.decorator&&this.decorator.fn&&h.scheduleTask(function(){return c.decorator.init()},!0),o.transitionsEnabled&&this.intro){var r=new k(this,this.intro,!0);h.registerTransition(r),h.scheduleTask(function(){return r.start()},!0),this.transition=r}return"option"===this.name&&m(this),this.node.autofocus&&h.scheduleTask(function(){return c.node.focus()},!0),n(this),this.node}}(B,g,l,S,C,E,$,x,s,Te,gf),jf=function(){var a=/^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;return a}(),kf=function(a,b,c){function d(a){var c,d,e;if(c=a.getAttribute("value"),void 0===c||!a.select)return!1;if(d=a.select.getAttribute("value"),d==c)return!0;if(a.select.getAttribute("multiple")&&b(d))for(e=d.length;e--;)if(d[e]==c)return!0}function e(a){var b,c,d,e;return b=a.attributes,c=b.type,d=b.value,e=b.name,c&&"radio"===c.value&&d&&e.interpolator&&d.value===e.interpolator.value?!0:void 0}function f(a){var b=a.toString();return b?" "+b:""}var g;return g=function(){var b,g;return b="<"+(this.template.y?"!DOCTYPE":this.template.e),b+=this.attributes.map(f).join("")+this.conditionalAttributes.map(f).join(""),"option"===this.name&&d(this)&&(b+=" selected"),"input"===this.name&&e(this)&&(b+=" checked"),b+=">","textarea"===this.name&&void 0!==this.getAttribute("value")?b+=c(this.getAttribute("value")):void 0!==this.getAttribute("contenteditable")&&(b+=this.getAttribute("value")),this.fragment&&(g="script"!==this.name&&"style"!==this.name,b+=this.fragment.toString(g)),a.test(this.template.e)||(b+="</"+this.template.e+">"),b}}(jf,g,zc),lf=function(a){return function(b){b.select&&a(b.select.options,b)}}(p),mf=function(a){function b(a){a.unbind()}var c;return c=function(){this.fragment&&this.fragment.unbind(),this.binding&&this.binding.unbind(),this.eventHandlers&&this.eventHandlers.forEach(b),"option"===this.name&&a(this),this.attributes.forEach(b),this.conditionalAttributes.forEach(b)}}(lf),nf=function(a,b){function c(a){var b,c,d;for(d=a.liveQueries.length;d--;)b=a.liveQueries[d],c=b.selector,b._remove(a.node)}var d;return d=function(d){var e,f;if(this.transition&&this.transition.complete(),"option"===this.name?this.detach():d&&a.detachWhenReady(this),this.fragment&&this.fragment.unrender(!1),(e=this.binding)&&(this.binding.unrender(),this.node._ractive.binding=null,f=this.root._twowayBindings[e.keypath],f.splice(f.indexOf(e),1)),this.eventHandlers&&this.eventHandlers.forEach(function(a){return a.unrender()}),this.decorator&&this.decorator.teardown(),this.root.transitionsEnabled&&this.outro){var g=new b(this,this.outro,!1);a.registerTransition(g),a.scheduleTask(function(){return g.start()})}this.liveQueries&&c(this)}}(x,gf),of=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p=function(a){this.init(a)};return p.prototype={bubble:a,detach:b,find:c,findAll:d,findAllComponents:e,findComponent:f,findNextNode:g,firstNode:h,getAttribute:i,init:j,rebind:k,render:l,toString:m,unbind:n,unrender:o},p}(xd,yd,zd,Ad,Bd,Cd,Dd,Ed,Fd,Pe,Se,hf,kf,mf,nf),pf=function(){function a(a,b){var c=d.exec(b)[0];return null===a||c.length<a.length?c:a}var b,c=/^\s*$/,d=/^\s*/;return b=function(b){var d,e,f,g;return d=b.split("\n"),e=d[0],void 0!==e&&c.test(e)&&d.shift(),f=d[d.length-1],void 0!==f&&c.test(f)&&d.pop(),g=d.reduce(a,null),g&&(b=d.map(function(a){return a.replace(g,"")}).join("\n")),b}}(),qf=function(a,b,c,d){function e(d,e){var f=b.registries.partials,g=f.findInstance(d,e);if(g){var h,i=g.partials[e];if("function"==typeof i&&(h=i.bind(g),h.isOwner=g.partials.hasOwnProperty(e),i=h(g.data,c)),!i)return void a.warn({debug:d.debug,message:"noRegistryFunctionReturn",args:{registry:"partial",name:e}});if(!c.isParsed(i)){var j=c.parse(i,c.getParseOptions(g));j.p&&a.warn({debug:d.debug,message:"noNestedPartials",args:{rname:e}});var k=h?g:f.findOwner(g,e);k.partials[e]=i=j.t}return h&&(i._fn=h),i.v?i.t:i}}var f;return f=function(a,b){var f;if(f=e(a,b))return f;if(f=c.fromId(b,{noThrow:!0})){f=d(f);var g=c.parse(f,c.getParseOptions(a));return a.partials[b]=g.t}}}(n,bb,W,pf),rf=function(a,b){var c;return b?c=a.split("\n").map(function(a,c){return c?b+a:a}).join("\n"):a},sf=function(a,b,c,d,e,f,g,h,i){var j,k;return e.push(function(){k=e.Fragment}),j=function(a){var d,e;d=this.parentFragment=a.parentFragment,this.root=d.root,this.type=b.PARTIAL,this.index=a.index,this.name=a.template.r,this.fragment=this.fragmentToRender=this.fragmentToUnrender=null,g.init(this,a),!this.keypath&&(e=c(this.root,this.name))&&(i.call(this),this.isNamed=!0,this.setTemplate(e))},j.prototype={bubble:function(){this.parentFragment.bubble()},detach:function(){return this.fragment.detach()},find:function(a){return this.fragment.find(a)},findAll:function(a,b){return this.fragment.findAll(a,b)},findComponent:function(a){return this.fragment.findComponent(a)},findAllComponents:function(a,b){return this.fragment.findAllComponents(a,b)},firstNode:function(){return this.fragment.firstNode()},findNextNode:function(){return this.parentFragment.findNextNode(this)},getValue:function(){return this.fragment.getValue()},rebind:function(a,b,c,d){h.call(this,a,b,c,d),this.fragment.rebind(a,b,c,d)},render:function(){return this.docFrag=document.createDocumentFragment(),this.update(),this.rendered=!0,this.docFrag},resolve:g.resolve,setValue:function(b){var d;(void 0===b||b!==this.value)&&(d=c(this.root,""+b),!d&&this.name&&(d=c(this.root,this.name))&&(i.call(this),this.isNamed=!0),d||a.error({debug:this.root.debug,message:"noTemplateForPartial",args:{name:this.name}}),this.setTemplate(d||[]),this.value=b,this.bubble(),this.rendered&&f.addView(this))},setTemplate:function(a){this.fragment&&(this.fragment.unbind(),this.fragmentToUnrender=this.fragment),this.fragment=new k({template:a,root:this.root,owner:this,pElement:this.parentFragment.pElement}),this.fragmentToRender=this.fragment},toString:function(a){var c,e,f,g;return c=this.fragment.toString(a),e=this.parentFragment.items[this.index-1],e&&e.type===b.TEXT?(f=e.text.split("\n").pop(),(g=/^\s+$/.exec(f))?d(c,g[0]):c):c},unbind:function(){this.isNamed||i.call(this),this.fragment&&this.fragment.unbind()},unrender:function(a){this.rendered&&(this.fragment&&this.fragment.unrender(a),this.rendered=!1)},update:function(){var a,b;this.fragmentToUnrender&&(this.fragmentToUnrender.unrender(!0),this.fragmentToUnrender=null),this.fragmentToRender&&(this.docFrag.appendChild(this.fragmentToRender.render()),this.fragmentToRender=null),this.rendered&&(a=this.parentFragment.getNode(),b=this.parentFragment.findNextNode(this),a.insertBefore(this.docFrag,b))}},j}(n,Zb,qf,rf,e,x,Sc,Rc,Dc),tf=function(a,b,c){var d;return c.push(function(){d=c.Ractive}),function e(c,d){var f,g=a.registries.components.findInstance(c,d);if(g&&(f=g.components[d],!f._parent)){var h=f.bind(g);if(h.isOwner=g.components.hasOwnProperty(d),f=h(g.data),!f)return void b.warn({debug:c.debug,message:"noRegistryFunctionReturn",args:{registry:"component",name:d}});"string"==typeof f&&(f=e(c,f)),f._fn=h,g.components[d]=f}return f}}(bb,n,e),uf=function(a){var b=new a("detach");return function(){var a=this.instance.fragment.detach();return b.fire(this.instance),a}}(o),vf=function(a){return this.instance.fragment.find(a)},wf=function(a,b){return this.instance.fragment.findAll(a,b)},xf=function(a,b){b._test(this,!0),this.instance.fragment&&this.instance.fragment.findAllComponents(a,b)},yf=function(a){return a&&a!==this.name?this.instance.fragment?this.instance.fragment.findComponent(a):null:this.instance},zf=function(){return this.parentFragment.findNextNode(this)},Af=function(){return this.rendered?this.instance.fragment.firstNode():null},Bf=function(a,b){var c,d;return b.push(function(){c=b.Fragment}),d=function(a,b,d){this.parentFragment=a.parentFragment,this.component=a,this.key=b,this.fragment=new c({template:d,root:a.root,owner:this}),this.value=this.fragment.getValue()},d.prototype={bubble:function(){this.dirty||(this.dirty=!0,a.addView(this))},update:function(){var b=this.fragment.getValue();this.component.instance.viewmodel.set(this.key,b),a.addViewmodel(this.component.instance.viewmodel),this.value=b,this.dirty=!1},rebind:function(a,b,c,d){this.fragment.rebind(a,b,c,d)},unbind:function(){this.fragment.unbind()}},d}(x,e),Cf=function(a,b){var c=function(c,d,e,f){var g=this;this.root=c.root,this.parentFragment=c.parentFragment,this.ready=!1,this.hash=null,this.resolver=new a(this,e,function(a){g.binding||(g.binding=c.bindings[g.hash])?(c.bindings[g.hash]=null,g.binding.rebind(a),g.hash=a+"="+d,c.bindings[g.hash]):g.ready?b(c,c.root,a,d):f.push({childKeypath:d,parentKeypath:a}),g.value=c.root.viewmodel.get(a)})};return c.prototype={rebind:function(a,b,c,d){this.resolver.rebind(a,b,c,d)},unbind:function(){this.resolver.unbind()}},c}(Oc,u),Df=function(a,b,c,d,e){function f(f,g,h,i){var j,k,l,m,n,o;if(l=f.root,m=f.parentFragment,"string"==typeof h)return k=b(h),k?k.value:h;if(null===h)return!0;if(1===h.length&&h[0].t===a.INTERPOLATOR){if(h[0].r)return m.indexRefs&&void 0!==m.indexRefs[o=h[0].r]?(f.indexRefBindings[o]=g,m.indexRefs[o]):(n=c(l,h[0].r,m)||h[0].r,i.push({childKeypath:g,parentKeypath:n}),l.viewmodel.get(n));if(h[0].rx)return j=new e(f,g,h[0].rx,i),f.complexParameters.push(j),j.ready=!0,j.value}return j=new d(f,g,h),f.complexParameters.push(j),j.value}var g;return g=function(a,b,c,d){var e,g,h={};a.complexParameters=[];for(e in c)c.hasOwnProperty(e)&&(g=f(a,e,c[e],d),(void 0!==g||void 0===b[e])&&(h[e]=g));return h}}(Zb,xc,v,Bf,Cf),Ef=function(a){return function(b,c,d,e){var f,g,h,i;return g=b.parentFragment,i=b.root,h={content:e||[]},c.defaults.el&&a.warn({debug:i.debug,message:"defaultElSpecified",args:{name:b.name}}),f=new c({el:null,append:!0,data:d,partials:h,magic:i.magic||c.defaults.magic,modifyArrays:i.modifyArrays,_parent:i,_component:b,adapt:i.adapt,"yield":{template:e,instance:i}})}}(n),Ff=function(a){return function(b,c){c.forEach(function(c){var d,e;a(b,b.root,c.parentKeypath,c.childKeypath),d=b.instance.viewmodel.get(c.childKeypath),e=b.root.viewmodel.get(c.parentKeypath),void 0!==d&&void 0===e&&b.root.viewmodel.set(c.parentKeypath,d)})}}(u),Gf=function(a,b,c){function d(a,d,e,f){"string"!=typeof f&&c.error({debug:d.debug,message:"noComponentEventArguments"}),a.on(e,function(){var a,c;return arguments.length&&arguments[0]&&arguments[0].node&&(a=Array.prototype.shift.call(arguments)),c=Array.prototype.slice.call(arguments),b(d,f,{event:a,args:c}),!1})}var e,f;return a.push(function(){f=a.Fragment}),e=function(a,b){var c;for(c in b)b.hasOwnProperty(c)&&d(a.instance,a.root,c,b[c])}}(e,ub,n),Hf=function(a){var b,c;for(b=a.root;b;)(c=b._liveComponentQueries["_"+a.name])&&c.push(a.instance),b=b._parent},If=function(a,b,c,d,e,f,g){return function(h,i){var j,k,l,m;if(j=this.parentFragment=h.parentFragment,k=j.root,this.root=k,this.type=a.COMPONENT,this.name=h.template.e,this.index=h.index,this.indexRefBindings={},this.bindings=[],this.yielders=[],!i)throw new Error('Component "'+this.name+'" not found');m=[],l=c(this,i.defaults.data||{},h.template.a,m),d(this,i,l,h.template.f),e(this,m),f(this,h.template.v),(h.template.t1||h.template.t2||h.template.o)&&b('The "intro", "outro" and "decorator" directives have no effect on components'),g(this)}}(Zb,l,Df,Ef,Ff,Gf,Hf),Jf=function(a,b){return function(c,d,e,f){function g(a){a.rebind(c,d,e,f)}var h,i,j=this.instance,k=j._parent;this.bindings.forEach(function(a){var c;a.root===k&&(c=b(a.keypath,e,f))&&a.rebind(c)}),this.complexParameters.forEach(g),this.yielders[0]&&g(this.yielders[0]),(h=this.indexRefBindings[c])&&(a.addViewmodel(j.viewmodel),j.viewmodel.set(h,d)),(i=this.root._liveComponentQueries["_"+this.name])&&i._makeDirty()}}(x,Gc),Kf=function(){var a=this.instance;return a.render(this.parentFragment.getNode()),this.rendered=!0,a.fragment.detach()},Lf=function(){return this.instance.fragment.toString()},Mf=function(a,b){function c(a){a.unbind()}function d(a){var b,c;b=a.root;do(c=b._liveComponentQueries["_"+a.name])&&c._remove(a);while(b=b._parent)}var e,f=new a("teardown");return e=function(){var a=this.instance;this.complexParameters.forEach(c),this.bindings.forEach(c),d(this),a.fragment.unbind(),a.viewmodel.teardown(),a.fragment.rendered&&a.el.__ractive_instances__&&b(a.el.__ractive_instances__,a),f.fire(a)}}(o,p),Nf=function(a){this.shouldDestroy=a,this.instance.unrender()},Of=function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=function(a,b){this.init(a,b)};return n.prototype={detach:a,find:b,findAll:c,findAllComponents:d,findComponent:e,findNextNode:f,firstNode:g,init:h,rebind:i,render:j,toString:k,unbind:l,unrender:m},n}(uf,vf,wf,xf,yf,zf,Af,If,Jf,Kf,Lf,Mf,Nf),Pf=function(a,b){var c=function(b){this.type=a.COMMENT,this.value=b.template.c};return c.prototype={detach:b,firstNode:function(){return this.node},render:function(){return this.node||(this.node=document.createComment(this.value)),this.node},toString:function(){return"<!--"+this.value+"-->"},unrender:function(a){a&&this.node.parentNode.removeChild(this.node)}},c}(Zb,Bc),Qf=function(a,b,c){var d;c.push(function(){d=c.Fragment});var e=function(b){var c,e;c=b.parentFragment.root,this.component=e=c.component,this.surrogateParent=b.parentFragment,this.parentFragment=e.parentFragment,this.fragment=new d({owner:this,root:c.yield.instance,template:c.yield.template,pElement:this.surrogateParent.pElement}),e.yielders.push(this),a.scheduleTask(function(){if(e.yielders.length>1)throw new Error("A component template can only have one {{yield}} declaration at a time")})};return e.prototype={detach:function(){return this.fragment.detach()},find:function(a){return this.fragment.find(a)},findAll:function(a,b){return this.fragment.findAll(a,b)},findComponent:function(a){return this.fragment.findComponent(a)},findAllComponents:function(a,b){return this.fragment.findAllComponents(a,b)},findNextNode:function(){return this.surrogateParent.findNextNode(this)},firstNode:function(){return this.fragment.firstNode()},getValue:function(a){return this.fragment.getValue(a)},render:function(){return this.fragment.render()},unbind:function(){this.fragment.unbind()},unrender:function(a){this.fragment.unrender(a),b(this.component.yielders,this)},rebind:function(a,b,c,d){this.fragment.rebind(a,b,c,d)},toString:function(){return this.fragment.toString()}},e}(x,p,e),Rf=function(a,b,c,d,e,f,g,h,i,j,k){return function(l){if("string"==typeof l.template)return new b(l);switch(l.template.t){case a.INTERPOLATOR:return"yield"===l.template.r?new k(l):new c(l);case a.SECTION:return new d(l);case a.TRIPLE:return new e(l);case a.ELEMENT:var m;return(m=h(l.parentFragment.root,l.template.e))?new i(l,m):new f(l);case a.PARTIAL:return new g(l);case a.COMMENT:return new j(l);default:throw new Error("Something very strange happened. Please file an issue at https://github.com/ractivejs/ractive/issues. Thanks!")}}}(Zb,Cc,Tc,id,wd,of,sf,tf,Of,Pf,Qf),Sf=function(a,b,c){return function(d){var e,f,g,h=this;if(this.owner=d.owner,e=this.parent=this.owner.parentFragment,this.root=d.root,this.pElement=d.pElement,this.context=d.context,this.owner.type===a.SECTION&&(this.index=d.index),e&&(f=e.indexRefs)){this.indexRefs=b(null);for(g in f)this.indexRefs[g]=f[g]}d.indexRef&&(this.indexRefs||(this.indexRefs={}),this.indexRefs[d.indexRef]=d.index),"string"==typeof d.template?d.template=[d.template]:d.template||(d.template=[]),this.items=d.template.map(function(a,b){return c({parentFragment:h,pElement:d.pElement,template:a,index:b})}),this.value=this.argsList=null,this.dirtyArgs=this.dirtyValue=!0,this.bound=!0}}(Zb,S,Rf),Tf=function(a){return function(b,c,d,e){this.index=c,a(this,"context",d,e),this.indexRefs&&void 0!==this.indexRefs[b]&&(this.indexRefs[b]=c),this.items.forEach(function(a){a.rebind&&a.rebind(b,c,d,e)})}}(Re),Uf=function(){var a;return 1===this.items.length?a=this.items[0].render():(a=document.createDocumentFragment(),this.items.forEach(function(b){a.appendChild(b.render())})),this.rendered=!0,a},Vf=function(a){return this.items?this.items.map(function(b){return b.toString(a)}).join(""):""},Wf=function(){function a(a){a.unbind&&a.unbind()}var b;return b=function(){this.bound&&(this.items.forEach(a),this.bound=!1)}}(),Xf=function(a){if(!this.rendered)throw new Error("Attempted to unrender a fragment that was not rendered");this.items.forEach(function(b){return b.unrender(a)}),this.rendered=!1},Yf=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r=function(a){this.init(a)};return r.prototype={bubble:a,detach:b,find:c,findAll:d,findAllComponents:e,findComponent:f,findNextNode:g,firstNode:h,getNode:i,getValue:j,init:k,rebind:l,render:m,toString:n,unbind:o,unrender:p},q.Fragment=r,r}(Qb,Rb,Sb,Tb,Ub,Vb,Wb,Xb,Yb,yc,Sf,Tf,Uf,Vf,Wf,Xf,e),Zf=function(a,b,c,d){var e=["template","partials","components","decorators","events"],f=new a("reset");return function(a,g){var h,i,j,k,l;if("function"!=typeof a||g?a=a||{}:(g=a,a={}),"object"!=typeof a)throw new Error("The reset method takes either no arguments, or an object containing new data");for((i=this.viewmodel.wrapped[""])&&i.reset?i.reset(a)===!1&&(this.data=a):this.data=a,j=d.reset(this),k=j.length;k--;)if(e.indexOf(j[k])>-1){l=!0;break}if(l){var m;this.viewmodel.mark(""),(m=this.component)&&(m.shouldDestroy=!0),this.unrender(),m&&(m.shouldDestroy=!1),this.fragment.template!==this.template&&(this.fragment.unbind(),this.fragment=new c({template:this.template,root:this,owner:this})),h=this.render(this.el,this.anchor)}else h=b.start(this,!0),this.viewmodel.mark(""),b.end();return f.fire(this,a),g&&h.then(g),h}}(o,x,Yf,bb),$f=function(a,b){return function(c){var d,e;a.template.init(null,this,{template:c}),d=this.transitionsEnabled,this.transitionsEnabled=!1,(e=this.component)&&(e.shouldDestroy=!0),this.unrender(),e&&(e.shouldDestroy=!1),this.fragment.unbind(),this.fragment=new b({template:this.template,root:this,owner:this}),this.render(this.el,this.anchor),this.transitionsEnabled=d}}(bb,Yf),_f=function(a){return a("reverse")}(Lb),ag=function(a,b,c,d){var e=/\*/;return function(f,g,h){var i,j,k=this;if(j=a.start(this,!0),b(f)){i=f,h=g;for(f in i)i.hasOwnProperty(f)&&(g=i[f],f=c(f),this.viewmodel.set(f,g))}else f=c(f),e.test(f)?d(this,f).forEach(function(a){k.viewmodel.set(a,g)}):this.viewmodel.set(f,g);return a.end(),h&&j.then(h.bind(this)),j}}(x,h,I,Bb),bg=function(a){return a("shift")}(Lb),cg=function(a){return a("sort")}(Lb),dg=function(a){return a("splice")}(Lb),eg=function(a){return function(b,c){return a(this,b,void 0===c?-1:-c)}}(G),fg=function(a,b,c){var d=new a("teardown");return function(a){var e;return this.fragment.unbind(),this.viewmodel.teardown(),this.fragment.rendered&&this.el.__ractive_instances__&&c(this.el.__ractive_instances__,this),this.shouldDestroy=!0,e=this.fragment.rendered?this.unrender():b.resolve(),d.fire(this),a&&e.then(a.bind(this)),e}}(o,q,p),gg=function(a){return function(b,c){var d;return"string"!=typeof b&&a.errorOnly({debug:this.debug,messsage:"badArguments",arg:{arguments:b}}),d=this.get(b),this.set(b,!d,c)}}(n),hg=function(){return this.fragment.toString(!0)},ig=function(a,b,c,d,e,f){var g=new b("unrender");return function(){var b,h,i=this;if(!this.fragment.rendered)return c.warn({debug:this.debug,message:"ractive.unrender() was called on a Ractive instance that was not rendered"}),d.resolve();for(b=f.start(this,!0),h=!this.component||this.component.shouldDestroy||this.shouldDestroy,this.constructor.css&&b.then(function(){a.remove(i.constructor)});this._animations[0];)this._animations[0].stop();return this.fragment.unrender(h),e(this.el.__ractive_instances__,this),g.fire(this),f.end(),b}}(Ob,o,n,q,p,x),jg=function(a){return a("unshift")
}(Lb),kg=function(a,b){var c=new a("update");return function(a,d){var e;return"function"==typeof a?(d=a,a=""):a=a||"",e=b.start(this,!0),this.viewmodel.mark(a),b.end(),c.fire(this,a),d&&e.then(d.bind(this)),e}}(o,x),lg=function(a,b){function c(d,e,f,g){var h,i,j,k,l,m,n=[];if(h=d._twowayBindings[e],h&&(j=h.length))for(;j--;)k=h[j],(!k.radioName||k.element.node.checked)&&(k.checkboxName?n[k.keypath]||k.changed()||(n.push(k.keypath),n[k.keypath]=k):(l=k.attribute.value,m=k.getValue(),a(l,m)||b(l,m)||(f[e]=m)));if(n.length&&n.forEach(function(b){var c,d,e;c=n[b],d=c.attribute.value,e=c.getValue(),a(d,e)||(f[b]=e)}),g&&(i=d.viewmodel.depsMap["default"][e]))for(j=i.length;j--;)c(d,i[j],f,g)}var d;return d=function(a,b){var d;return"string"!=typeof a&&(a="",b=!0),c(this,a,d={},b),this.set(d)}}(re,t),mg=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F){return{add:a,animate:b,detach:c,find:d,findAll:e,findAllComponents:f,findComponent:g,fire:h,get:i,insert:j,merge:k,observe:l,off:m,on:n,pop:o,push:p,render:q,reset:r,resetTemplate:s,reverse:t,set:u,shift:v,sort:w,splice:x,subtract:y,teardown:z,toggle:A,toHTML:B,unrender:C,unshift:D,update:E,updateModel:F}}(H,eb,fb,gb,qb,rb,sb,vb,wb,yb,zb,Fb,Ib,Jb,Mb,Nb,Pb,Zf,$f,_f,ag,bg,cg,dg,eg,fg,gg,hg,ig,jg,kg,lg),ng=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b,c;return b=16*Math.random()|0,c="x"==a?b:3&b|8,c.toString(16)})},og=function(){var a=0;return function(){return"r-"+a++}}(),pg=function(a){function b(b){this.hook=new a(b),this.inProcess={},this.queue={}}function c(a,b){return a[b._guid]||(a[b._guid]=[])}function d(a,b){var e=c(a.queue,b);for(a.hook.fire(b);e.length;)d(a,e.shift());delete a.queue[b._guid]}return b.prototype={constructor:b,begin:function(a){this.inProcess[a._guid]=!0},end:function(a){var b=a._parent;b&&this.inProcess[b._guid]?c(this.queue,b).push(a):d(this,a),delete this.inProcess[a._guid]}},b}(o),qg=function(a,b,c,d){var e=a.root,f=a.keypath;return"sort"===c||"reverse"===c?void e.viewmodel.set(f,b):void e.viewmodel.smartUpdate(f,b,d)},rg=function(a,b,c,d){var e,f,g,h=[],i=["pop","push","reverse","shift","sort","splice","unshift"];return i.forEach(function(e){var f=function(){var b,f,g,h,i=Array.prototype.slice,j=i.call(arguments,0);for(b=c(this,e,j),f=Array.prototype[e].apply(this,arguments),a.start(),this._ractive.setting=!0,h=this._ractive.wrappers.length;h--;)g=this._ractive.wrappers[h],a.addViewmodel(g.root.viewmodel),d(g,this,e,b);return a.end(),this._ractive.setting=!1,f};b(h,e,{value:f})}),e={},e.__proto__?(f=function(a){a.__proto__=h},g=function(a){a.__proto__=Array.prototype}):(f=function(a){var c,d;for(c=i.length;c--;)d=i[c],b(a,d,{value:h[d],configurable:!0})},g=function(a){var b;for(b=i.length;b--;)delete a[i[b]]}),f.unpatch=g,f}(x,E,Kb,qg),sg=function(a,b,c){var d,e,f;return d={filter:function(a){return b(a)&&(!a._ractive||!a._ractive.setting)},wrap:function(a,b,c){return new e(a,b,c)}},e=function(b,d,e){this.root=b,this.value=d,this.keypath=e,d._ractive||(a(d,"_ractive",{value:{wrappers:[],instances:[],setting:!1},configurable:!0}),c(d)),d._ractive.instances[b._guid]||(d._ractive.instances[b._guid]=0,d._ractive.instances.push(b)),d._ractive.instances[b._guid]+=1,d._ractive.wrappers.push(this)},e.prototype={get:function(){return this.value},teardown:function(){var a,b,d,e,g;if(a=this.value,b=a._ractive,d=b.wrappers,e=b.instances,b.setting)return!1;if(g=d.indexOf(this),-1===g)throw new Error(f);if(d.splice(g,1),d.length){if(e[this.root._guid]-=1,!e[this.root._guid]){if(g=e.indexOf(this.root),-1===g)throw new Error(f);e.splice(g,1)}}else delete a._ractive,c.unpatch(this.value)}},f="Something went wrong in a rather interesting way",d}(E,g,rg),tg=function(a,b){var c,d;return a&&(c={filter:function(c,d,e){return a.filter(c,d,e)&&b.filter(c)},wrap:function(a,b,c){return new d(a,b,c)}},d=function(c,d,e){this.value=d,this.magic=!0,this.magicWrapper=a.wrap(c,d,e),this.arrayWrapper=b.wrap(c,d,e)},d.prototype={get:function(){return this.value},teardown:function(){this.arrayWrapper.teardown(),this.magicWrapper.teardown()},reset:function(a){return this.magicWrapper.reset(a)}}),c}(z,sg),ug=function(a,b,c,d,e){function f(a,b){var c,d={};if(!b)return a;b+=".";for(c in a)a.hasOwnProperty(c)&&(d[b+c]=a[c]);return d}function g(a){var b;return i[a]||(b=a?a+".":"",i[a]=function(c,d){var e;return"string"==typeof c?(e={},e[b+c]=d,e):"object"==typeof c?b?f(c,a):c:void 0}),i[a]}var h,i={};return h=function(f,h){var i,j,k,l,m=this.ractive;for(i=m.adapt.length,j=0;i>j;j+=1){if(k=m.adapt[j],"string"==typeof k){var n=a.registries.adaptors.find(m,k);if(!n)return c.critical({debug:m.debug,message:"missingPlugin",args:{plugin:"adaptor",name:k}});k=m.adapt[j]=n}if(k.filter(h,f,m))return l=this.wrapped[f]=k.wrap(m,h,f,g(f)),l.value=h,h}return m.magic?e.filter(h,f,m)?this.wrapped[f]=e.wrap(m,h,f):d.filter(h,f,m)&&(this.wrapped[f]=d.wrap(m,h,f)):m.modifyArrays&&b.filter(h,f,m)&&(this.wrapped[f]=b.wrap(m,h,f)),h}}(bb,sg,n,z,tg),vg=function(a){var b,c,d,e,f=[""];for(b=a.length;b--;)for(c=a[b],d=c.split(".");d.length>1;)d.pop(),e=d.join("."),-1===f.indexOf(e)&&f.push(e);return f},wg=function(){function a(a){var b,d,e,f,g,h="";if(!c[a]){for(e=[];h.length<a;)h+=1;for(b=parseInt(h,2),f=function(a){return"1"===a},g=0;b>=g;g+=1){for(d=g.toString(2);d.length<a;)d="0"+d;e[g]=Array.prototype.map.call(d,f)}c[a]=e}return c[a]}var b,c={};return b=function(b){var c,d,e,f;return c=b.split("."),d=a(c.length),e=function(a,b){return a?"*":c[b]},f=d.map(function(a){return a.map(e).join(".")})}}(),xg=function(a){function b(b,e,f){var g;d(b,e),f||(g=a(e),g.forEach(function(a){c(b,a,e)}))}function c(a,b,e){var g,h,i;g=a.depsMap.patternObservers,h=g[b],h&&h.forEach(function(b){var g=f.exec(b)[0];i=e?e+"."+g:g,d(a,i),c(a,b,i)})}function d(a,b){a.patternObservers.forEach(function(a){a.regex.test(b)&&a.update(b)})}var e,f=/[^\.]+$/;return e=b}(wg),yg=function(a,b){function c(a){a.invalidate()}function d(a){return a.key}function e(a,b,c,d){var e,f;(e=h(a,c,d))&&(f=a.get(c),e.forEach(function(a){b&&a.refineValue?b.push(a):a.setValue(f)}))}function f(a,b,c){b.forEach(function(b){for(var d=!1,e=0,f=c.length,g=[];f>e;){var h=c[e];if(h===b.keypath){d=!0;break}h.slice(0,b.keypath.length)===b.keypath&&g.push(h),e++}d&&b.setValue(a.get(b.keypath)),g.length&&b.refineValue(g)})}function g(a,b,c){function d(a){a.forEach(e),a.forEach(f)}function e(b){var d=h(a,b,c);d&&i.push({keypath:b,deps:d})}function f(b){var e;(e=a.depsMap[c][b])&&d(e)}function g(b){var c=a.get(b.keypath);b.deps.forEach(function(a){return a.setValue(c)})}var i=[];d(b),i.forEach(g)}function h(a,b,c){var d=a.deps[c];return d?d[b]:null}var i;return i=function(){function h(a){var b,e,f;m.noCascade.hasOwnProperty(a)||((e=m.deps.computed[a])&&(e.forEach(c),f=e.map(d),f.forEach(i),f.forEach(h)),(b=m.depsMap.computed[a])&&b.forEach(h))}function i(a){m.mark(a)}var j,k,l=this,m=this,n={};if(j=this.changes,j.length){if(j.forEach(h),k=a(j),k.forEach(function(a){var b,e;(b=m.deps.computed[a])&&(b.forEach(c),e=b.map(d),e.forEach(i),e.forEach(h))}),this.changes=[],this.patternObservers.length&&(k.forEach(function(a){return b(l,a,!0)}),j.forEach(function(a){return b(l,a)})),this.deps.observers&&(k.forEach(function(a){return e(l,null,a,"observers")}),g(this,j,"observers")),this.deps["default"]){var o=[];k.forEach(function(a){return e(l,o,a,"default")}),o.length&&f(this,o,j),g(this,j,"default")}return j.forEach(function(a){n[a]=l.get(a)}),this.implicitChanges={},this.noCascade={},n}}}(vg,xg),zg=function(){this.captureGroups.push([])},Ag=function(a,b){var c,d;if(b||(d=this.wrapped[a])&&d.teardown()!==!1&&(this.wrapped[a]=null),this.cache[a]=void 0,c=this.cacheMap[a])for(;c.length;)this.clearCache(c.pop())},Bg=function(){function a(a){var b="var __ractive=this;return("+a.replace(c,function(a,b){return'__ractive.get("'+b+'")'})+")";return new Function(b)}var b,c=/\$\{([^\}]+)\}/g;return b=function(b){return"function"==typeof b?{get:b}:"string"==typeof b?{get:a(b)}:("object"==typeof b&&"string"==typeof b.get&&(b={get:a(b.get),set:b.set}),b)}}(),Cg=function(a,b){var c=function(a,b,c){var d=this;this.ractive=a,this.viewmodel=a.viewmodel,this.key=b,this.getter=c.get,this.setter=c.set,this.hardDeps=c.deps||[],this.softDeps=[],this.depValues={},this.hardDeps&&this.hardDeps.forEach(function(b){return a.viewmodel.register(b,d,"computed")}),this._dirty=this._firstRun=!0};return c.prototype={constructor:c,init:function(){var a;this.bypass=!0,a=this.ractive.viewmodel.get(this.key),this.ractive.viewmodel.clearCache(this.key),this.bypass=!1,this.setter&&void 0!==a&&this.set(a)},invalidate:function(){this._dirty=!0},get:function(){var c,d,e,f=this,g=!1;if(!this.getting){if(this.getting=!0,this._dirty){if(c=this.ractive,this._firstRun||!this.hardDeps.length&&!this.softDeps.length?g=!0:[this.hardDeps,this.softDeps].forEach(function(a){var d,e,h;if(!g)for(h=a.length;h--;)if(d=a[h],e=c.viewmodel.get(d),!b(e,f.depValues[d]))return f.depValues[d]=e,void(g=!0)}),g){c.viewmodel.capture();try{this.value=this.getter.call(c)}catch(h){a.warn({debug:c.debug,message:"failedComputation",args:{key:this.key,err:h.message||h}}),this.value=void 0}d=c.viewmodel.release(),e=this.updateDependencies(d),e&&[this.hardDeps,this.softDeps].forEach(function(a){a.forEach(function(a){f.depValues[a]=c.viewmodel.get(a)})})}this._dirty=!1}return this.getting=this._firstRun=!1,this.value}},set:function(a){if(this.setting)return void(this.value=a);if(!this.setter)throw new Error("Computed properties without setters are read-only. (This may change in a future version of Ractive!)");this.setter.call(this.ractive,a)},updateDependencies:function(a){var b,c,d,e;for(c=this.softDeps,b=c.length;b--;)d=c[b],-1===a.indexOf(d)&&(e=!0,this.viewmodel.unregister(d,this,"computed"));for(b=a.length;b--;)d=a[b],-1!==c.indexOf(d)||this.hardDeps&&-1!==this.hardDeps.indexOf(d)||(e=!0,this.viewmodel.register(d,this,"computed"));return e&&(this.softDeps=a.slice()),e}},c}(n,t),Dg=function(a,b){return function(c,d){return d=a(d),this.computations[c]=new b(this.ractive,c,d)}}(Bg,Cg),Eg={FAILED_LOOKUP:!0},Fg=function(a,b){var c={},d=function(a,d){this.viewmodel=a,this.root=a.ractive,this.ref=d,this.parentFragment=c,a.unresolvedImplicitDependencies[d]=!0,a.unresolvedImplicitDependencies.push(this),b.addUnresolved(this)};return d.prototype={resolve:function(){this.viewmodel.mark(this.ref),this.viewmodel.unresolvedImplicitDependencies[this.ref]=!1,a(this.viewmodel.unresolvedImplicitDependencies,this)},teardown:function(){b.removeUnresolved(this)}},d}(p,x),Gg=function(a,b,c){function d(a,c){var d,e,f,g,h,i,j;return d=c.split("."),e=d.pop(),f=d.join("."),g=a.get(f),(j=a.wrapped[f])&&(g=j.get()),null!==g&&void 0!==g?((h=a.cacheMap[f])?-1===h.indexOf(c)&&h.push(c):a.cacheMap[f]=[c],"object"!=typeof g||e in g?(i=g[e],a.adapt(c,i,!1),a.cache[c]=i,i):a.cache[c]=b):void 0}var e,f={};return e=function(e){var g=arguments[1];void 0===g&&(g=f);var h,i,j,k,l=this.ractive,m=this.cache;return"@"===e[0]?(h=e.slice(1),a(h)?+h:h):(void 0===m[e]?((i=this.computations[e])&&!i.bypass?(h=i.get(),this.adapt(e,h)):(j=this.wrapped[e])?h=j.value:e?h=d(this,e):(this.adapt("",l.data),h=l.data),m[e]=h):h=m[e],g.evaluateWrapped&&(j=this.wrapped[e])&&(h=j.get()),g.capture&&(k=this.captureGroups[this.captureGroups.length-1])&&(~k.indexOf(e)||(k.push(e),h===b&&this.unresolvedImplicitDependencies[e]!==!0&&new c(this,e))),h===b?void 0:h)}}(i,Eg,Fg),Hg=function(){function a(a){a.init()}var b;return b=function(){var b,c,d=[];for(b in this.ractive.computed)c=this.compute(b,this.ractive.computed[b]),d.push(c);d.forEach(a)}}(),Ig=function(a,b){var c;b&&(b.implicit&&(this.implicitChanges[a]=!0),b.noCascade&&(this.noCascade[a]=!0)),(c=this.computations[a])&&c.invalidate(),-1===this.changes.indexOf(a)&&this.changes.push(a),this.clearCache(a)},Jg=function(a,b){var c,d,e,f;return c={},d=0,e=a.map(function(a,e){var g,h,i;h=d,i=b.length;do{if(g=b.indexOf(a,h),-1===g)return f=!0,-1;h=g+1}while(c[g]&&i>h);return g===d&&(d+=1),g!==e&&(f=!0),c[g]=!0,g})},Kg=function(a,b){function c(a){return JSON.stringify(a)}function d(a){if(a===!0)return c;if("string"==typeof a)return f[a]||(f[a]=function(b){return b[a]}),f[a];if("function"==typeof a)return a;throw new Error("The `compare` option must be a function, or a string representing an identifying field (or `true` to use JSON.stringify)")}var e,f={};return e=function(c,e,f,g){var h,i,j,k;if(this.mark(c),g&&g.compare){j=d(g.compare);try{h=e.map(j),i=f.map(j)}catch(l){if(this.debug)throw l;a("Merge operation: comparison failed. Falling back to identity checking"),h=e,i=f}}else h=e,i=f;k=b(h,i),this.smartUpdate(c,f,k,e.length!==f.length)}}(l,Jg),Lg=function(){function a(a,b,c){var d,e,f,g;for(d=b.split(".");d.length;)d.pop(),e=d.join("."),f=a.depsMap[c]||(a.depsMap[c]={}),g=f[e]||(f[e]=[]),void 0===g[b]&&(g[b]=0,g.push(b)),g[b]+=1,b=e}var b;return b=function(b,c){var d=arguments[2];void 0===d&&(d="default");var e,f;c.isStatic||(e=this.deps[d]||(this.deps[d]={}),f=e[b]||(e[b]=[]),f.push(c),b&&a(this,b,d))}}(),Mg=function(){return this.captureGroups.pop()},Ng=function(a,b){function c(a,c,d){var e,f,g,h,i,j,k;j=function(){h.set?h.set(f,d):(i=h.get(),k())},k=function(){i||(i=b(f),a.set(g,i,!0)),i[f]=d},e=c.split("."),f=e.pop(),g=e.join("."),h=a.wrapped[g],h?j():(i=a.get(g),(h=a.wrapped[g])?j():k())}var d;return d=function(b,d,e){var f,g,h;if(f=this.computations[b]){if(f.setting)return;f.set(d),d=f.get()}a(this.cache[b],d)||(g=this.wrapped[b],g&&g.reset&&(h=g.reset(d)!==!1,h&&(d=g.get())),f||h||c(this,b,d),e?this.clearCache(b):this.mark(b))}}(t,y),Og=function(){function a(a){return"function"==typeof a.shuffle}var b,c={implicit:!0},d={noCascade:!0};return b=function(b,e,f){var g,h,i=this;if(h=f.length,f.forEach(function(a,c){-1===a&&i.mark(b+"."+c,d)}),this.set(b,e,!0),(g=this.deps["default"][b])&&g.filter(a).forEach(function(a){return a.shuffle(f,e)}),h!==e.length){this.mark(b+".length",c);for(var j=h;j<e.length;j+=1)this.mark(b+"."+j);for(var k=e.length;h>k;k+=1)this.mark(b+"."+k,d)}}}(),Pg=function(){var a,b=this;for(Object.keys(this.cache).forEach(function(a){return b.clearCache(a)});a=this.unresolvedImplicitDependencies.pop();)a.teardown()},Qg=function(){function a(a,b,c){var d,e,f,g;for(d=b.split(".");d.length;)d.pop(),e=d.join("."),f=a.depsMap[c],g=f[e],g[b]-=1,g[b]||(g.splice(g.indexOf(b),1),g[b]=void 0),b=e}var b;return b=function(b,c){var d=arguments[2];void 0===d&&(d="default");var e,f;if(!c.isStatic){if(e=this.deps[d][b],f=e.indexOf(c),-1===f)throw new Error("Attempted to remove a dependant that was no longer registered! This should not happen. If you are seeing this bug in development please raise an issue at https://github.com/RactiveJS/Ractive/issues - thanks");e.splice(f,1),b&&a(this,b,d)}}}(),Rg=function(){function a(a){return"string"==typeof a&&(a=[a]),a}var b={lookup:function(a,b){var c,d=a.adapt;if(!d||!d.length)return d;if(b&&Object.keys(b).length&&(c=d.length))for(;c--;){var e=d[c];"string"==typeof e&&(d[c]=b[e]||e)}return d},combine:function(b,c){return b=a(b),c=a(c),b&&b.length?c&&c.length?(b.forEach(function(a){-1===c.indexOf(a)&&c.push(a)}),c):b.slice():c}};return b}(),Sg=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r;try{Object.defineProperty({},"test",{value:0})}catch(s){r=!0}var t=function(b){this.ractive=b,t.extend(b.constructor,b),this.cache={},this.cacheMap=a(null),this.deps={computed:{},"default":{}},this.depsMap={computed:{},"default":{}},this.patternObservers=[],this.wrapped=a(null),this.computations=a(null),this.captureGroups=[],this.unresolvedImplicitDependencies=[],this.changes=[],this.implicitChanges={},this.noCascade={}};return t.extend=function(a,b){if(b.magic&&r)throw new Error("Getters and setters (magic mode) are not supported in this browser");b.adapt=q.combine(a.prototype.adapt,b.adapt)||[],b.adapt=q.lookup(b,b.adaptors)},t.prototype={adapt:b,applyChanges:c,capture:d,clearCache:e,compute:f,get:g,init:h,mark:i,merge:j,register:k,release:l,set:m,smartUpdate:n,teardown:o,unregister:p},t}(S,ug,yg,zg,Ag,Dg,Gg,Hg,Ig,Kg,Lg,Mg,Ng,Og,Pg,Qg,Rg),Tg=function(a,b,c,d,e,f,g,h){function i(a,c){a._guid=e(),a._subs=b(null),a._config={},a._twowayBindings=b(null),a._animations=[],a.nodes={},a._liveQueries=[],a._liveComponentQueries=[],c._parent&&c._component&&(a._parent=c._parent,a.component=c._component,c._component.instance=a)}var j,k=new f("construct"),l=new f("config"),m=new g("init");return j=function(b){var e=arguments[1];void 0===e&&(e={});var f;if(i(b,e),k.fire(a.getConstructTarget(b,e),e),a.init(b.constructor,b,e),l.fire(b),(f=d(b.el))&&!b.append){if(f.__ractive_instances__)try{f.__ractive_instances__.splice(0,f.__ractive_instances__.length).forEach(function(a){return a.teardown()})}catch(g){}f.innerHTML=""}m.begin(b),b.viewmodel=new h(b),b.viewmodel.init(),b.template&&(b.fragment=new c({template:b.template,root:b,owner:b})),m.end(b),f&&b.render(f,b.append)}}(bb,S,Yf,xb,og,o,pg,Sg),Ug=function(a,b,c){function d(a,b,c){var d,e=Object.keys(a[c]);e.length&&((d=b[c])||(d=b[c]={}),e.filter(function(a){return!(a in d)}).forEach(function(b){return d[b]=a[c][b]}))}var e,f;return c.push(function(){f=c.Ractive}),e=function(c){if(!(c.prototype instanceof f))return c;for(var e={};c;)b.registries.forEach(function(a){d(a.useDefaults?c.prototype:c,e,a.name)}),Object.keys(c.prototype).forEach(function(b){if("computed"!==b){var d=c.prototype[b];if(b in e){if("function"==typeof e[b]&&"function"==typeof d&&e[b]._method){var f,g=d._method;g&&(d=d._method),f=a(e[b]._method,d),g&&(f._method=f),e[b]=f}}else e[b]=d._method?d._method:d}}),c=c._parent!==f?c._parent:!1;return e}}(P,bb,e),Vg=function(a,b,c,d,e,f,g){return function h(){var i=arguments[0];void 0===i&&(i={});var j,k,l,m=this;return i=g(i),j=function(a){e(this,a)},k=a(m.prototype),k.constructor=j,l={_guid:{value:c()},defaults:{value:k},extend:{value:h,writable:!0,configurable:!0},_parent:{value:m}},b(j,l),d.extend(m,k,i),f.extend(m,k),j.prototype=k,j}}(S,F,ng,bb,Tg,Sg,Ug),Wg=function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n,o;for(n=function(a){l(this,a)},o={extend:{value:j},parse:{value:k},Promise:{value:h},svg:{value:d},magic:{value:e},VERSION:{value:"0.6.1"},adaptors:{writable:!0,value:{}},components:{writable:!0,value:{}},decorators:{writable:!0,value:{}},easing:{writable:!0,value:b},events:{writable:!0,value:{}},interpolators:{writable:!0,value:c},partials:{writable:!0,value:{}},transitions:{writable:!0,value:{}}},f(n,o),n.prototype=i(g,a),n.prototype.constructor=n,n.defaults=n.prototype,m.Ractive=n;m.length;)m.pop()();var p="function";if(typeof Date.now!==p||typeof String.prototype.trim!==p||typeof Object.keys!==p||typeof Array.prototype.indexOf!==p||typeof Array.prototype.forEach!==p||typeof Array.prototype.map!==p||typeof Array.prototype.filter!==p||"undefined"!=typeof window&&typeof window.addEventListener!==p)throw new Error("It looks like you're attempting to use Ractive.js in an older browser. You'll need to use one of the 'legacy builds' in order to continue - see http://docs.ractivejs.org/latest/legacy-builds for more information.");return n}(c,d,j,k,A,F,mg,q,he,Vg,R,Tg,e);"undefined"!=typeof module&&module.exports?module.exports=Wg:"function"==typeof define&&define.amd&&define(function(){return Wg}),a.Ractive=Wg,Wg.noConflict=function(){return a.Ractive=b,Wg}}("undefined"!=typeof window?window:this);
},{}]},{},[1]);
