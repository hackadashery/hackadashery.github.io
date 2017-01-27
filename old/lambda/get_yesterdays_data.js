'use strict';

//exports.handler = (event, context, callback) => {

  //1: build the query for all requests from yesterday
  var yesterday = new Date(); //actually - today
  yesterday.setDate(yesterday.getDate() - 1); //now it's yesterday
  var url = "http://data.phila.gov/resource/4t9v-rppq.json?$where=requested_datetime%3E=%27" + yesterday.toISOString().slice(0, -5) + "%27";

  //2: call it
  var http = require("http");
  var request = http.get(url, function (response) {
 
    var buffer = "", data, route;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {

      //3: save it!
      data = JSON.parse(buffer);

      console.log('countObj', countObj);
    }); 
  }); 
    
//};
