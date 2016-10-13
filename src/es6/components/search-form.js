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
				runSearch();
			}
		});
		$('.js-search-submit').on('click', function(e){
			runSearch();
		});
	}
}

function runSearch(){
	console.log('running search');
	api.getIssueById('10895664').then(function(data){
		var res = data;
		eventManager.fire('get_issue_by_id_returned', { owner: 'searchform', data: res });
	});
}