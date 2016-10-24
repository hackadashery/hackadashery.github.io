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

		$('.js-adv-search-submit').on('click', function(e){
			var $advForm = $(this).closest('.js-general-search-form');
			var queryStringsArray = [];

			//get req number
			var serviceNo = $advForm.find('.js-search-service-type').val();
			var serviceQuery = '';
			if (serviceNo.length > 0) {
				serviceQuery = "service_code='" + serviceNo + "'";
				queryStringsArray.push(serviceQuery);
			}

			//requested_datetime
			var dateInput = $advForm.find('.js-search-date-of-request').val();
			var dateQuery = '';
			if (dateInput.length > 0){
				var fromDate = new Date(dateInput);
				fromDate.setDate(fromDate.getDate() - 10);
				var toDate = new Date(dateInput);
				toDate.setDate(toDate.getDate() + 10);
				dateQuery = "requested_datetime between '" + fromDate.toISOString() + "' and '" + toDate.toISOString() + "'";
				queryStringsArray.push(dateQuery);
			}

			
			var queryString = queryStringsArray.join(' AND ');
			console.log('queryStringqueryStringqueryStringqueryString', queryString);
			api.getRequestsByQuery(queryString).then(function(data){
				console.log('==================requests found: ', data);
			});
		});
	}
}

function runSearch(searchId){
	api.getIssueById(searchId).then(function(data){
		var res = data;
		eventManager.fire('get_issue_by_id_returned', { owner: 'searchform', data: res });
	});
}