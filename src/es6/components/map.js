'use strict';

var $ = require("jquery");
var eventManager = require('../utils/eventManager');
var api = require('./api');
require('mapbox.js');

var chartIsBuilt = false;

module.exports = {
    init: function(){
        eventManager.subscribe('section_opened', function(event){
            if (event.data.section == 'search') {
                buildChart();
            }
        });
        eventManager.subscribe('section_closed', function(event){
            if (event.data.section == 'search') {
                //unload the DOM elements
            }
        });

    }
}

function buildChart(){
    if (chartIsBuilt) { return; }
    chartIsBuilt = true;

    // Map variables
    var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });

    var map = L.map('map__view', {
        layers: [CartoDB_Positron]
    }).setView([39.952583, -75.165222], 12);

    var markersLayer = new L.LayerGroup();
    map.addLayer(markersLayer);

    var otherRequestsIcon = L.divIcon({className: 'map__round-icon'});
    var yourRequestIcon = L.divIcon({className: 'map__round-icon-single'});

    // Figure out what the date was 7 days ago
    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    //add leading zero if month or day is less than 10
    function cleanDate(input) {
        return (input < 10) ? '0' + input : input;
    }

    // Create date string for 7 days ago that looks like: YYYY-mm-dd
    weekAgo = weekAgo.getFullYear() + '-' 
    + cleanDate((weekAgo.getMonth() + 1)) + '-' 
    + cleanDate((weekAgo.getDate()));


    //Hello! I've set up an api.js module that'll get requests (for now only by ID but in the future it'll hopefully be able to do more)
    //I've also set up the search-form.js as it's own module which calls the api.js module.
   
   //this is the first time we get to use the event manager properly! The idea would be any module (map / chart / something else) would be able 
   //to subscribe to this event (get_issue_by_id_returned) and be notified whenever a new request is searched for (or more accuratly, when a search for a request returns)
   //It might actually be an idea to move the request details part into it's own module too and subscribe to this event there too.
    eventManager.subscribe('get_issue_by_id_returned', function(event){
        $.each(event.data, function(key, obj) {
            markersLayer.clearLayers();

            // add to map if lat and long are available
            if ( this.lat && this.lon ) {
                let lat = Number(this.lat);
                let lon = Number(this.lon);
                let options = "<p><b>Case ID</b><br>" + this.service_request_id + "<br>";
                    options += "<b>Status</b><br>" + this.status + "<br>";
                    options += "<b>Date Requested</b><br>" + this.requested_datetime + '<br>';
                    options += "<b>Expected Resolution Date</b><br>" + this.expected_datetime + '<br>';
                    options += "<b>Address</b><br>" + this.address + "<br></p>";
                let typeInfo = "<h2 class='sidebar__title sidebar__title--sub'>On the Map</h2>";
                    typeInfo += "<p>Type of Request<br>" + this.service_name + '</p>';
                    typeInfo += "<p>Agency Responsible<br>" + this.agency_responsible + "</p>";
                    typeInfo += "<p>The requests shown have been opened within the last week</p>"
                // let sidebarOptions = "";
                new L.marker([lat, lon], {icon: yourRequestIcon})
                .addTo( markersLayer ).bindPopup(options);
                
                $('.js-request-details').empty().append(options);
                $('.js-request-type').empty().append(typeInfo);
                map.setView([lat, lon],16, {animate: true});
            } else {
                console.log("incomplete geographic info");
            }

            // add issues with same request type to map
            if ( this.service_name ) {
                var service = this.service_name;
                getRelatedRequests(service, weekAgo, this.service_request_id);
            } else {
                console.log("can't get service type");
            }
        });
    });

    // get 311 data based on service name for the last 7 days
    function getRelatedRequests(service, date, originalRequestID) {
        api.getRelatedRequests(service, date).then(function(data){
            console.log(data);
            $.each(data, function(key, obj) {
                // add to map if lat and long are available
                if ( this.lat && this.lon ) {
                    if ( this.service_request_id == originalRequestID ) {
                        //don't plot if this is the one we already have
                        return;
                    }
                    var lat = Number(this.lat);
                    var lon = Number(this.lon);
                    var options = "<p><b>Case ID</b><br>" + this.service_request_id + "<br>";
                        options += "<b>Address</b><br>" + this.address + "<br>";
                        options += "<b>Status</b><br>" + this.status + "<br></p>";
                    new L.marker([lat, lon], {icon: otherRequestsIcon})
                    .addTo( markersLayer ).bindPopup(options);
                } else {
                    console.log("incomplete geographic info");
                }
            });

            eventManager.fire('get_related_requests_returned', {owner:"map", data: { service, originalRequestID, data }});
        });
    }
}

