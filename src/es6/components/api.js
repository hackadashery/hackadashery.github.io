'use strict';

var eventManager = require('../utils/eventManager');
var $ = require('jquery');

module.exports = {
	getIssueById(id){
		return $.get( "https://data.phila.gov/resource/4t9v-rppq.json?service_request_id=" + id);
	}
}