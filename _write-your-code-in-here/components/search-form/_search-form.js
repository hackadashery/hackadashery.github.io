'use strict';

module.exports = {
	init(){
        
		console.log("Initting search by filters");
		$('.js-search-form__form').on('submit', function(e){
			e.preventDefault();

			var $advForm = $(this).closest('.js-search-form__form');
			var queryStringsArray = [];

			//get zip
			var zipCode = $advForm.find('.js-search-form__zip').val();
			var zipQuery = '';
			if (zipCode.length > 0) {
				zipQuery = "zip='" + zipCode + "'";
				queryStringsArray.push(zipQuery);
			}

			//get req number
			var serviceNo = $advForm.find('.js-search-form__service-type').val();
			var serviceQuery = '';
			if (serviceNo.length > 0) {
				serviceQuery = "service_code='" + serviceNo + "'";
				queryStringsArray.push(serviceQuery);
			}

			//requested_datetime
			var dateInput = $advForm.find('.js-search-form__date-of-request').val();
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

			var agencyInput = $advForm.find('.js-search-form__agency-responsible').val();
			var agencyQuery = '';
			if (agencyInput.length > 0){
				agencyQuery = "agency_responsible='" + agencyInput + "'";
				queryStringsArray.push(agencyQuery);
			}

			
			var queryString = queryStringsArray.join(' AND ') + "&$limit=1000";

			eventManager.fire('SEARCH_BY_FILTERS_FORM_SUBMITTED', queryString);
		});
	}
}

function runSearch(searchId){
	api.getIssueById(searchId).then(function(data){
		var res = data;
		eventManager.fire('get_issue_by_id_returned', { owner: 'searchform', data: res });
	});
}