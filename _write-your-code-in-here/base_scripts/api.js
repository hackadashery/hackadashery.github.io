'use strict';

var eventManager = require('./eventManager');

module.exports = {
	getIssueById(id){
		return $.get( "https://data.phila.gov/resource/4t9v-rppq.json?service_request_id=" + id);
	},
	getRequestsByQuery(queryString){
		console.info('api:getRequestsByQuery', queryString);
		return $.ajax({
			url: "https://data.phila.gov/resource/4t9v-rppq.json?$where=" + queryString,
			type: "GET"
        });
	},
	getRelatedRequests(service_name, requested_datetime){
		console.info('api:getRelatedRequests', service_name, requested_datetime);
		return $.ajax({
			url: "https://data.phila.gov/resource/4t9v-rppq.json",
			type: "GET",
			data: {
				$where : "service_name=" + "'" + service_name + "' AND requested_datetime>=" + "'" + requested_datetime + "'"
			}
        });
	},
	getRequestTypes(){
		return $.ajax({
			url:"http://www.publicstuff.com/api/open311/services.json?jurisdiction_id=philadelphia-pa",
			type: "GET"
		});
	}, 
	getD3url(queryString){
		console.info('api:getD3url', queryString);
		let url = "https://data.phila.gov/resource/4t9v-rppq.json?$where=" + queryString;
		return url;
	},
	getTimeRange(range){
		// Creates time ranges (day, week, month, year) and formats dates for 311 API requests
		if (range == "day") {
			let day = new Date();
					day.setDate(day.getDate() - 1);
			range = formatRequestDate(day);
			return range; 
		} else if (range == "week") {
			let week = new Date();
	    		week.setDate(week.getDate() - 7);
			range = formatRequestDate(week);
			return range;
		} else if (range == "month") {
			let month = new Date();
					month.setDate(month.getDate() - 30);
			range = formatRequestDate(month);
			return range;
		} else if (range == "year") {
			let year = new Date();
					year.setDate(year.getDate() - 365);
			range = formatRequestDate(year);
			return range;
		} else { console.log('incorrect input in getTimeRange(): ' + range); }

		// helper function to format dates correctly for 311 API request
		function formatRequestDate(date){
			//add leading zero if month or day is less than 10
			function cleanDate(input) {
	      return (input < 10) ? '0' + input : input;
	    }
	    // Format date string that looks like 'YYYY-mm-dd'
	    let formatDate = date.getFullYear() + '-' 
	    + cleanDate((date.getMonth() + 1)) + '-' 
	    + cleanDate((date.getDate()));

	    return formatDate;
		}
	}
}