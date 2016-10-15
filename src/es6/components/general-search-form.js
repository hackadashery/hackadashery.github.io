'use strict';

var eventManager = require('../utils/eventManager');
var $ = require('jquery');
var api = require('./api');

module.exports = {
	init(){
		$('.js-general-search-form-toggle').on('click', function(e){
			if ($(this).hasClass('isToggled')) {
				$(this).removeClass('isToggled');
				$(this).closest('.js-general-search').find('.js-general-search-form').slideUp();
				$('.js-search-by-id-form').slideDown();
				$(this).html('Don\'t know your case ID?');
			} else {
				$(this).addClass('isToggled');
				$(this).closest('.js-general-search').find('.js-general-search-form').slideDown();
				$('.js-search-by-id-form').slideUp();
				$(this).html('Oh wait, yes I do know my case ID');
			}
		});
	}
}

function runSearch(searchId){
	api.getIssueById(searchId).then(function(data){
		var res = data;
		eventManager.fire('get_issue_by_id_returned', { owner: 'searchform', data: res });
	});
}