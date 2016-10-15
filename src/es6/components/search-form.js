'use strict';

var eventManager = require('../utils/eventManager');
var urlParameter = require('../utils/urlParameter');
var $ = require('jquery');
var api = require('./api');

module.exports = {
	init(){
		//start listening!
		$('.js-search-form').on('keypress', function(e){
			if (e.keyCode == 13) {
				var searchId = $(this).find('.js-search-request-id').val();
				runSearch(searchId);
			}
		});

		$('.js-expand-adv-search').on('click', function(e){
			$(this).closest('.js-search-form').find('.js-search-advanced-section').slideToggle();
		});

		$('.js-search-submit').on('click', function(e){
			var searchId = $(this).closest('.js-search-form').find('.js-search-request-id').val();
			runSearch(searchId);
		});
	}
}

function runSearch(searchId){
	api.getIssueById(searchId).then(function(data){
		var res = data;
		eventManager.fire('get_issue_by_id_returned', { owner: 'searchform', data: res });
	});
}