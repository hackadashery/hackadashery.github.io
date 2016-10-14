'use strict';

var eventManager = require('../utils/eventManager');
var urlParameter = require('../utils/urlParameter');
var $ = require('jquery');

//remember this and the last for the event manager
var previousSection = '';
var currentSection = '';

function runNavigation(newSection){
	previousSection = currentSection;
	
	//hide and show
	$('.js-nav-section').hide();
	$('#' + newSection).show();
	
	//Let everyone know
	eventManager.fire('section_opened', {owner:'main_nav', data:{section: newSection}});
	eventManager.fire('section_closed', {owner:'main_nav', data:{section: previousSection}});
	
	//update the url history!
	if (window.history) {
		var stateObj = null; //could be interesting...
		history.pushState(stateObj, newSection, "?chart=" + newSection);
	}

	currentSection = newSection;
}

module.exports = {
	init(){
		var chartLoaded = false;
		//what's the URL we're on?
		var loadChart = urlParameter.getParameter('chart');
		if (loadChart) {
			runNavigation(loadChart);
		} else {
			//load the search screen
			runNavigation('map');
		}

		//listen to the buttons for they shall speak to you
		$('.js-nav-button').on('click', function(){		
			var newSection = $(this).data('section');
			runNavigation(newSection);
		});

		//Listen for going "back"
	}
}
