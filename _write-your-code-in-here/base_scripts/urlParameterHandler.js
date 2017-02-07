'use strict';

//https://github.com/delphic-digital/urlParameter

/* Problem:
 * A bunch of different components want to update the url parameters
 * But they don't know about each other.
 * They add, they remove, they do it at crazy times.
 * So we get a long tail of url manipulation.
 *
 * Solution:
 * hold a 'virtual' query string.
 * let the various components update it as much as they want - go mad.
 * Try to push it to history but ... debounce it :D
 */

var urlParameter = require('./urlParameter');
var virtualQueryString = '';
var liveQueryString = '';
var debounceTime = 500;
if (typeof window != 'undefined'){
	var windowRef = window;
	virtualQueryString = windowRef.location.search;
	virtualQueryString = windowRef.location.search;
}

//Replace me with an import if you have debounce already!
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if ( !immediate ) {
				func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait || 200);
		if ( callNow ) { 
			func.apply(context, args);
		}
	};
};

var setHistroy = function(){
	if (typeof windowRef != 'undefined'){
		if (windowRef.history) {
			windowRef.history.pushState(null, '', windowRef.location.pathname + virtualQueryString);
			liveQueryString = virtualQueryString;
		} else {
			console.log('No window.history :(');
		}
	} else {
		console.log('No window to set histroy on :(');
	}
};

var updateUrl = debounce(setHistroy, debounceTime);

module.exports = {
	get(paramName, isEncoded){
		return urlParameter.get(paramName, virtualQueryString, isEncoded);
	},
	set(paramName, value, isEncoded){

		var newQueryString = urlParameter.set(paramName, value, virtualQueryString, isEncoded);

		virtualQueryString = newQueryString;
		updateUrl();

		return newQueryString;
	},
	config(options){
		if (options.hasOwnProperty('debounce')) { debounce = options.debounce; };
		if (options.hasOwnProperty('debounceTime')) { debounceTime = options.debounceTime; };
		if (options.hasOwnProperty('windowReplacement')) { windowRef = options.windowReplacement; };
		return true; //return false for err?
	},
	getLiveQueryString(){
		return liveQueryString;
	}
}