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

        // get 311 data from API
        $.ajax({
            url: "https://data.phila.gov/resource/4t9v-rppq.json",
            type: "GET",
            data: {
              $where : "requested_datetime>=" + "'" + weekAgo + "'"
            }, 
            success: function(data){
                console.log(data);
                var i = 0;
                var j = 0;
                $.each(data, function(key, obj) {
                    if ( this.lat && this.lon ) {
                        var lat = Number(this.lat);
                        var lon = Number(this.lon);
                        new L.marker([lat, lon])
                        .addTo( map );
                        i++;
                        console.log("i: " + i);
                    } else {
                        j++;
                        console.log("j: " + j);
                    }
                });
            },
            error: function(){
                console.log('error');
            }
        });


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