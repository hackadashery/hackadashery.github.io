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
				fromDate.setDate(fromDate.getDate() - 1);
				var toDate = new Date(dateInput);
				toDate.setDate(toDate.getDate() + 1);
				//Wrong: $where=requested_datetime%20between%20%272016-09-25T00:00:00.000Z%27%20and%20%272016-10-15T00:00:00.000Z%27
				//Right: $where=requested_datetime%20between%20%272016-09-25T00:00:00%27%20and%20%272016-10-15T00:00:00%27
				dateQuery = "requested_datetime between '" + fromDate.toISOString().replace('.000Z', '') + "' and '" + toDate.toISOString().replace('.000Z', '') + "'";
				queryStringsArray.push(dateQuery);
			}

			
			var queryString = queryStringsArray.join(' AND ');
			if (queryString.length > 0) {
				api.getRequestsByQuery(queryString).then(function(data){
					console.log('==================requests found: ', data);
					eventManager.fire('general_request_search_returned', {owner:'general-search-form', data: {query: queryString, results: data}});
				});
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