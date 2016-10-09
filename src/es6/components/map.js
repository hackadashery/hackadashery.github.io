'use strict';

var $ = require("jquery");
require('mapbox.js');

module.exports = {
    init: function(){
        // Map variables
        var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });

        var map = L.map('map', {
            layers: [CartoDB_Positron]
        }).setView([39.952583, -75.165222], 12);

        var markersLayer = new L.LayerGroup();
        map.addLayer(markersLayer);

        var info = L.control();

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

        $('.js-id-request').off().on('click', function() {
            event.preventDefault();
            markersLayer.clearLayers();
            var id = $('.map__request').val();
            // 10646418
            getRequest(id); 
        });

        // get 311 data based on service request id
        var getRequest = function getRequest(id) {
            $.ajax({
                url: "https://data.phila.gov/resource/4t9v-rppq.json",
                type: "GET",
                data: {
                  $where : "service_request_id=" + "'" + id + "'"
                }, 
                success: function(data){
                    console.log(data);
                    $.each(data, function(key, obj) {

                        // add to map if lat and long are available
                        if ( this.lat && this.lon ) {
                            var lat = Number(this.lat);
                            var lon = Number(this.lon);
                            var options = "<p><b>Case ID</b><br>" + this.service_request_id + "<br>";
                                options += "<b>Request Type</b><br>" + this.service_name + "<br>";
                                options += "<b>Agency Responsible</b><br>" + this.agency_responsible + "<br>";
                                options += "<b>Address</b><br>" + this.address + "<br>";
                                options += "<b>Status</b><br>" + this.status + "<br></p>";
                            new L.marker([lat, lon])
                            .addTo( markersLayer ).bindPopup(options);
                            map.setView([lat, lon],16, {animate: true});
                        } else {
                            console.log("incomplete geographic info");
                        }

                        // add issues with same request type to map
                        if ( this.service_name ) {
                            var service = this.service_name;
                            getRelatedRequests(service);
                        } else {
                            console.log("can't get service type");
                        }
                    });
                },
                error: function(){
                    console.log('error');
                }
            });
        }

        // get 311 data based on service name for the last 7 days
        var getRelatedRequests = function getRelatedRequests(service) {
            $.ajax({
                url: "https://data.phila.gov/resource/4t9v-rppq.json",
                type: "GET",
                data: {
                  $where : "service_name=" + "'" + service + "' AND requested_datetime>=" + "'" + weekAgo + "'"
                }, 
                success: function(data){
                    console.log(data);
                    $.each(data, function(key, obj) {
                        // add to map if lat and long are available
                        if ( this.lat && this.lon ) {
                            var lat = Number(this.lat);
                            var lon = Number(this.lon);
                            var options = "<p><b>Case ID</b><br>" + this.service_request_id + "<br>";
                                options += "<b>Request Type</b><br>" + this.service_name + "<br>";
                                options += "<b>Agency Responsible</b><br>" + this.agency_responsible + "<br>";
                                options += "<b>Address</b><br>" + this.address + "<br>";
                                options += "<b>Status</b><br>" + this.status + "<br></p>";
                            new L.marker([lat, lon])
                            .addTo( markersLayer ).bindPopup(options);
                        } else {
                            console.log("incomplete geographic info");
                        }
                    });
                },
                error: function(){
                    console.log('error');
                }
            });
        }

        // info.onAdd = function (map) {
        //     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        //     this.update();
        //     return this._div;
        // };

        // // method to update the control based on feature properties passed
        // info.update = function (neighborhoods) {
        //     this._div.innerHTML = '<h3>Neighborhood Facts</h3>' + (neighborhoods ? '<h4>Name</h4>' +
        //         '<b>' + neighborhoods.listname + '</b><br /><br /><h4>Area</h4>' + neighborhoods.shape_area : 'Hover over a neighborhood</p>');
        // };

        // info.addTo(map);

    }
}