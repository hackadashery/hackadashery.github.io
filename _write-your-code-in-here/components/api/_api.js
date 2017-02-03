"use strict";

/* Main role is to listen out for anything that would need stuff from the API
 * Secondary role is updating the little bit of UI that shows the status of the API calls
 */

module.exports = {
	init(){

        eventManager.subscribe('SEARCH_BY_FILTERS_FORM_SUBMITTED', function(queryString){

            $.ajax({
                url: "https://data.phila.gov/resource/4t9v-rppq.json?$where=" + queryString,
                type: "GET"
            }).done(function(data){
                console.log("returned!", arguments);
                eventManager.fire('general_request_search_returned', {owner:'general-search-form', data: {query: queryString, results: data}});
            });

        });
	}
}
