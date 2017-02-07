'use strict';

require('mapbox.js');

module.exports = {
    init: function(){
        buildChart();
    }
}

function buildChart(){

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

    var weekAgo = api.getTimeRange("week");

    // Function for request result date formatting
    function formatRequestDate(string) {
        let months = new Array(12);
        months[0] = "Jan";
        months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
        months[7] = "Aug";
        months[8] = "Sep";
        months[9] = "Oct";
        months[10] = "Nov";
        months[11] = "Dec";

        let date = new Date(string);
        let month_val = date.getMonth();
        let formatted_date = months[month_val] + ' ' + date.getDate() + ', ' + date.getFullYear();
        return formatted_date;
    }
    

    //Hello! I've set up an api.js module that'll get requests (for now only by ID but in the future it'll hopefully be able to do more)
    //I've also set up the search-form.js as it's own module which calls the api.js module.
   
   //this is the first time we get to use the event manager properly! The idea would be any module (map / chart / something else) would be able 
   //to subscribe to this event (get_issue_by_id_returned) and be notified whenever a new request is searched for (or more accuratly, when a search for a request returns)
   //It might actually be an idea to move the request details part into it's own module too and subscribe to this event there too.
    eventManager.subscribe('GET_ISSUE_BY_ID_RETURNED', function(event){
        $.each(event.data, function(key, obj) {
            markersLayer.clearLayers();

            // add to map if lat and long are available
            if ( this.lat && this.lon ) {
                let lat = Number(this.lat);
                let lon = Number(this.lon);
                let requested_date = formatRequestDate(this.requested_datetime);
                let expected_date = formatRequestDate(this.expected_datetime);
                let options = "<p class='search-results__item'><span class='search-results__item--key'>Case ID</span>" + this.service_request_id + "</p>";
                    options += "<p class='search-results__item'><span class='search-results__item--key'>Status</span>" + this.status + "</p>";
                    options += "<p class='search-results__item'><span class='search-results__item--key'>Date Requested</span>" + requested_date + "</p>";
                    options += "<p class='search-results__item'><span class='search-results__item--key'>Expected Resolution Date</span>" + expected_date + "</p>";
                    options += "<p class='search-results__item'><span class='search-results__item--key'>Request Type</span>" + this.service_name + "</p>";
                    options += "<p class='search-results__item'><span class='search-results__item--key'>Agency Responsible</span>" + this.agency_responsible + "</p>";
                    options += "<p class='search-results__item'><span class='search-results__item--key'>Address</span>" + this.address + "</p>";

                let popUp = "<p class='search-results__item'><span class='search-results__item--key'>Case ID</span>" + this.service_request_id + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Status</span>" + this.status + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Date Requested</span>" + requested_date + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Expected Resolution Date</span>" + expected_date + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Address</span>" + this.address + "</p>";

                let typeInfo = "<h3 class='map__title'>Recent 311 Requests</h3>";
                    typeInfo += "<p class='map__legend-item'>Your 311 request</p>";
                    typeInfo += "<p class='map__legend-item map__legend-item--related'>Other " + this.service_name + " requests opened within the last seven days</p>";

                new L.marker([lat, lon], {icon: yourRequestIcon})
                .addTo( markersLayer ).bindPopup(popUp);
                
                $('.js-request-details').empty().append(options);
                $('.map__legend').empty().addClass('open').append(typeInfo); 
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
                    let requested_date = formatRequestDate(this.requested_datetime);
                    let expected_date = formatRequestDate(this.expected_datetime);
                    let popUp = "<p class='search-results__item'><span class='search-results__item--key'>Case ID</span>" + this.service_request_id + "</p>";
                        popUp += "<p class='search-results__item'><span class='search-results__item--key'>Status</span>" + this.status + "</p>";
                        popUp += "<p class='search-results__item'><span class='search-results__item--key'>Date Requested</span>" + requested_date + "</p>";
                        popUp += "<p class='search-results__item'><span class='search-results__item--key'>Expected Resolution Date</span>" + expected_date + "</p>";
                        popUp += "<p class='search-results__item'><span class='search-results__item--key'>Address</span>" + this.address + "</p>";
                    
                    new L.marker([lat, lon], {icon: otherRequestsIcon})
                    .addTo( markersLayer ).bindPopup(popUp);
                } else {
                    console.log("incomplete geographic info");
                }
            });

            eventManager.fire('get_related_requests_returned', {owner:"map", data: { service, originalRequestID, data }});
        });
    }

    eventManager.subscribe('SEARCH_BY_FILTERS_API_RETURNED', function(event){
        $.each(event.data.results, function(key, obj) {
            // add to map if lat and long are available
            if ( this.lat && this.lon ) {
                var lat = Number(this.lat);
                var lon = Number(this.lon);
                let requested_date = formatRequestDate(this.requested_datetime);
                let expected_date = formatRequestDate(this.expected_datetime);
                let popUp = "<p class='search-results__item'><span class='search-results__item--key'>Case ID</span>" + this.service_request_id + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Status</span>" + this.status + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Date Requested</span>" + requested_date + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Expected Resolution Date</span>" + expected_date + "</p>";
                    popUp += "<p class='search-results__item'><span class='search-results__item--key'>Address</span>" + this.address + "</p>";
                
                new L.marker([lat, lon], {icon: otherRequestsIcon})
                .addTo( markersLayer ).bindPopup(popUp);
            } else {
                console.log("incomplete geographic info");
            }
        });
    });
}

