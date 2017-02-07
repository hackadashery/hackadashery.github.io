'use strict';

var philadelphiaZipCodeList = [ 
	"19102", "19103", "19104", "19106", "19107", "19109", "19111", "19112", "19114", "19115", "19116", "19118", "19119", "19120", "19121", "19122", 
	"19123", "19124", "19125", "19126", "19127", "19128", "19129", "19130", "19131", "19132", "19133", "19134", "19135", "19136", "19137", "19138", 
	"19139", "19140", "19141", "19142", "19143", "19144", "19145", "19146", "19147", "19148", "19149", "19150", "19151", "19152", "19153", "19154"
]

module.exports = {
	init(){

		//The filter form
		$('.js-search-filter-form__form').on('submit', function(e){
			e.preventDefault();
			var $thisForm = $(this);
			var queryStringsArray = [];

			//get zip
			var zipCode = $thisForm.find('.js-search-form__zip').val();
			var zipQuery = '';
			if (zipCode.length > 0) {
				zipQuery = "zip='" + zipCode + "'";
				queryStringsArray.push(zipQuery);
			}

			//get req number
			var serviceNo = $thisForm.find('.js-search-form__service-type').val();
			var serviceQuery = '';
			if (serviceNo.length > 0) {
				serviceQuery = "service_code='" + serviceNo + "'";
				queryStringsArray.push(serviceQuery);
			}

			//requested_datetime
			var dateInput = $thisForm.find('.js-search-form__date-of-request').val();
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

			var agencyInput = $thisForm.find('.js-search-form__agency-responsible').val();
			var agencyQuery = '';
			if (agencyInput.length > 0){
				agencyQuery = "agency_responsible='" + agencyInput + "'";
				queryStringsArray.push(agencyQuery);
			}

			var queryString = queryStringsArray.join(' AND ') + "&$limit=1000";

			eventManager.fire('SEARCH_BY_FILTERS_FORM_SUBMITTED', queryString);
		});

		//The ID form
		$('.js-search-id-form__form').on('submit', function(e){
			e.preventDefault();
			var searchID = $(this).find('.js-search-form__id').val();
			console.log('submitting!');
			eventManager.fire('SEARCH_BY_ID_SUBMITTED', searchID);
		});

		//====================== now that the listners are all set up, check if we have any url params to deal with.

		//collect all the url params
		var searchParams = {
			search: urlParameter.get('search', true),
			id: urlParameter.get('id', true),
			zip: urlParameter.get('zip', true),
			serviceType: urlParameter.get('service-type', true),
			dateOfRequest: urlParameter.get('date-of-request', true),
			agencyResponsible: urlParameter.get('agency-responsible', true)
		}

		var idFormShouldSubmit = false;
		var filterFormShouldSubmit = false;

		//set them 
		if (searchParams.id) {                $('.js-search-form__id').val(searchParams.id);                                idFormShouldSubmit = true;     }
		if (searchParams.serviceType) {       $('.js-search-form__service-type').val(searchParams.serviceType);             filterFormShouldSubmit = true; }
		if (searchParams.dateOfRequest) {     $('.js-search-form__date-of-request').val(searchParams.dateOfRequest);        filterFormShouldSubmit = true; }
		if (searchParams.agencyResponsible) { $('.js-search-form__agency-responsible').val(searchParams.agencyResponsible); filterFormShouldSubmit = true; }
		if (searchParams.zip) {               $('.js-search-form__zip').val(searchParams.zip);                              filterFormShouldSubmit = true;
			if (!philadelphiaZipCodeList.includes(searchParams.zip)) {
				//do something about it not being a philly zip
				console.warn('Not a Philadelphia ZIP');
			}
		}

		//search is a special case - could be ZIP or Requiest ID
		if (searchParams.search){
			if (philadelphiaZipCodeList.includes(searchParams.search)) {
				$('.js-search-form__zip').val(searchParams.search);
				urlParameter.set('zip', searchParams.search);
			} else {
				//There's a search and it's not a ZIP. That means it's for an ID
				$('.js-search-form__id').val(searchParams.search, true);
				urlParameter.set('id', searchParams.search, true);
			}

			//no longer any need for the search param
			urlParameter.set('search', '');
		}

		if (idFormShouldSubmit) {     $('.js-search-id-form__submit').submit(); console.log('submitting id form'); }
		if (filterFormShouldSubmit) { $('.js-search-filter-form__submit').submit(); }
	}
}