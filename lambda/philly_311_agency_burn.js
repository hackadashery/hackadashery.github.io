'use strict';

var countObj = {
  "Streets Department": 0,
  "Community Life Improvement Program": 0,
  "Police Department": 0,
  "Philly311 Contact Center": 0,
  "City Commissioners Office": 0,
  "Mayor's Office": 0,
  "First Judicial District/Courts": 0,
  "Philadelphia Housing Development Corporation- PHDC": 0,
  "Prisons": 0,
  "Water Department (PWD)": 0,
  "Office of Human Resources- OHR": 0,
  "Managing Director's Office- MDO": 0,
  "License & Inspections": 0,
  "Office of Housing & Community Development- OHCD": 0,
  "Department of Public Health": 0,
  "Department of Records": 0,
  "Parks & Recreation": 0,
  "State/Federal Government Offices": 0,
  "District Attorney's Office": 0,
  "Revenue": 0,
  "Directory Assistance": 0,
  "Fair Housing Commission": 0,
  "Office of the Director of Finance": 0,
  "Probation/Parole": 0,
  "City Council": 0,
  "Department of Human Services- DHS": 0,
  "Office of Property Assessment- OPA": 0,
  "Law Department/ City Solicitor": 0,
  "Register of Wills/ Orphans Court": 0,
  "City Controller": 0,
  "Water Revenue": 0,
  "Office of Economic Opportunity- OEO": 0,
  "Sheriff's Department": 0,
  "Office of Homeless Services - OHS": 0,
  "Board of Revision of Taxes- BRT": 0,
  "Mayor's Office of Transportation and Utilities- MOTU": 0,
  "City Planning Commission": 0,
  "Office of the Inspector General": 0,
  "Fire Department": 0,
  "Commerce Department": 0,
  "City Representative": 0,
  "Philadelphia Housing Authority- PHA": 0,
  "Human Relations Commission": 0,
  "Philadelphia Redevelopment Authority- PRA": 0,
  "Behavioral Health and Intellectual Disability Services- DBHIDS": 0,
  "Office of Innovation and Technology- OIT": 0,
  "Ethics Board": 0,
  "Procurement Department": 0,
  "Free Library": 0,
  "Public Property": 0
}

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


      //3: count up the results!
      data = JSON.parse(buffer);
      data.map(function(req){
        countObj[req.agency_responsible] ++;
      });

      console.log('countObj', countObj)
    }); 
  }); 
    
//};
