'use strict';

var d3 = require('d3');
var eventManager = require('../utils/eventManager');
var bargin = 5; //bar margin - :D
var minBarWidth = 30;

module.exports = {
	init(){
		eventManager.subscribe('section_opened', function(event){
			if (event.data.section == 'bluebar') {
				buildChart();
			}
		});
		eventManager.subscribe('section_closed', function(event){
			if (event.data.section == 'bluebar') {
				//unload the DOM elements
			}
		});

	}
}

function buildChart(){
	d3.json('dist/data/eg_dept_requests.json', function(error, data) {
		var w = document.getElementById('requests-barchart').clientWidth;
		var barHeight = 30;
		var outerBarHeight = barHeight + bargin + 2; //plus 2 for the bar stroke
		var barsHeight = (outerBarHeight * data.length) + (bargin) 
		let svg = d3.select('#requests-barchart')
			.attr('height', barsHeight + 50);
		
		//find the highest and lowest number of requests
		var highestRequestNumber = -Infinity;
		var lowestRequestNumber = Infinity;
		data.map(function(obj){
			if (obj.number_of_requests > highestRequestNumber) {
				highestRequestNumber = obj.number_of_requests;
			}
			if (obj.number_of_requests < lowestRequestNumber) {
				lowestRequestNumber = obj.number_of_requests;
			}
		});

		var chartWidthScale = d3.scaleLinear()
			.domain([0,highestRequestNumber]) //input max / min
			.range([0,(w-minBarWidth)]); //output max / min

		var colorScale = d3.scaleLinear()
			.domain([lowestRequestNumber,highestRequestNumber])
			.range([100,200]);


		// =================================== Starting D3
		var bar = svg.selectAll("bar")
			.data(data)
			.enter()
			.append("g")
				.attr('transform', function(d, i){ return "translate(0," + ((i * outerBarHeight)+bargin) + ")"; });
			
			//the bars
			bar.append("rect")
				.attr('class', 'requests-barchart__bar')
				.attr('width', function(d){	return chartWidthScale(d.number_of_requests); })
				.attr('height', barHeight)
				.attr('fill', function(d){ 
					var g = Math.ceil(colorScale(d.number_of_requests));
					return "rgb(20," + g + ", 213)"; 
				});

			//department name within the bar
			bar.append("text")
				.attr('class', 'requests-barchart__bar-label')
				.attr('x', bargin)
				.attr('y', (barHeight / 2) )
				.text(function(d){ return d.department_name; });

			//number of requests to the right of the bar
			bar.append("text")
				.attr('class', 'requests-barchart__bar-number')
				.attr('x', function(d){ return chartWidthScale(d.number_of_requests) + bargin; })
				.attr('y', (barHeight / 2) )
				.text(function(d){ return d.number_of_requests; });

			//The X axis
			svg.append('g')
				.attr('transform', 'translate(0,' + barsHeight + ')')
				.call(d3.axisBottom(chartWidthScale).ticks(10));
				//.attr('class', 'requests-linechart__axis requests-linechart__axis-x')

	});
}

