'use strict';

var eventManager = require('../utils/eventManager');
var urlParameter = require('../utils/urlParameter');
var $ = require('jquery');

//remember this and the last for the event manager
var previousSection = '';
var currentSection = '';

function runNavigation(navHref, navGroup){
	previousSection = currentSection;
	
	//hide and show
	$('.js-nav-section').each(function(){
		if ($(this).data('nav-group') == navGroup) {
			$(this).hide();
		}
	});

	$('#' + navHref).show();
	
	//Let everyone know
	eventManager.fire('section_opened', {owner:navGroup, data:{section: navHref}});
	eventManager.fire('section_closed', {owner:navGroup, data:{section: previousSection}});
	
	if (navGroup == 'main') {
		//update the url history!
		if (window.history) {
			var stateObj = null; //could be interesting...
			history.pushState(stateObj, navHref, "?p=" + navHref);
		}
	}

	ga('set', 'page', '/?p=' + navHref);
	ga('send', 'pageview');

	currentSection = navHref;
}

module.exports = {
	init(){
		var chartLoaded = false;
		//what's the URL we're on?
		var loadChart = urlParameter.getParameter('p');
		if (loadChart) {
			runNavigation(loadChart, 'main');
		} else {
			//load the search screen
			runNavigation('search', 'main');
		}

		//listen to the buttons for they shall speak to you
		$('.js-nav-button').on('click', function(){		
			var navHref = $(this).data('nav-href');
			var navGroup = $(this).data('nav-group');
			runNavigation(navHref, navGroup);
		});

		//Listen for going "back"
	}
}
