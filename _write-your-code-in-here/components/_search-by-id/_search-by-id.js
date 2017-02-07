'use strict';

// var eventManager = require('../utils/eventManager');
// var $ = require('jquery');
//var api = require('./_api');
console.log('HIHIHI');
module.exports = {
	init(){
		console.log("initting search from");
		//start listening!
		$('.js-search-by-id-form').on('keypress', function(e){
			if (e.keyCode == 13) {
				var searchId = $(this).find('.js-search-by-id-input').val();
				runSearch(searchId);
			}
		});

		$('.js-search-by-id-button').on('click', function(e){
			var searchId = $(this).closest('.js-search-by-id-form').find('.js-search-by-id-input').val();
			runSearch(searchId);
		});


		$('.js-expand-adv-search').on('click', function(e){
			$(this).closest('.js-search-by-id-form').find('.js-search-advanced-section').slideToggle();
		});
	}
}

function runSearch(searchId){
	api.getIssueById(searchId).then(function(data){
		var res = data;
		eventManager.fire('get_issue_by_id_returned', { owner: 'searchform', data: res });
	});
}