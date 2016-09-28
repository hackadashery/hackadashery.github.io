'use strict';

var d3 = require('d3');
var w = 300;
var h = 300;

module.exports = {
	init(){
		
		var scale = d3.scaleLinear()
			.domain([0,100]) //input max / min
			.range([0,300]); //output max / min


		d3.json('src/data/eg_dept_requests.json', function(error, data) {
			let svg = d3.select('.requests-barchart').append('svg').attr('width', w).attr('height', h);

			var bars = svg.selectAll("bar")
				.data(data)
				.enter()
				.append("rect")
				.attr('x', 0)
				.attr('width', function(d){	return scale(d.number_of_requests); })
				.attr('y', function(d, i){ return i * (h/data.length); })
				.attr('height', function(d, i){ return (h/data.length); })
				.attr('fill', function(d){ return "rgb(0," + (d.number_of_requests) + ", 0)"; });
				
				//This doesn't work in v4!! Unless we add the multi select module... somehow
				// .attrs({
				// 	'x': 0,
				// 	'width': function(d) { return scale(d.number_of_requests); },
				// 	'y': function(d, i) { return i * (h/data.length); },
				// 	'height': function(d, i) { return (h/data.length); },
				// 	'fill': function(d) { return "rgb(0," + (d.number_of_requests) + ", 0)"; }
				// });
		});
	}
}