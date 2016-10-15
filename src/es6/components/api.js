'use strict';

var eventManager = require('../utils/eventManager');
var $ = require('jquery');

module.exports = {
	getIssueById(id){
		return $.get( "https://data.phila.gov/resource/4t9v-rppq.json?service_request_id=" + id);
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
	}
}