'use strict';

var d3 = require('d3');
var w = 300;
var h = 300;
			var leftPad = 5;


module.exports = {
	init(){
		
		var scale = d3.scaleLinear()
			.domain([0,100]) //input max / min
			.range([0,300]); //output max / min


		d3.json('src/data/eg_dept_requests.json', function(error, data) {
			let svg = d3.select('.requests-barchart').append('svg').attr('width', w).attr('height', h);

			var bar = svg.selectAll("bar")
				.data(data)
				.enter()
				.append("g")
					.attr('transform', function(d, i){ return "translate(0," + i * (h/data.length) + ")"; });
				
				bar.append("rect")
					.attr('width', function(d){	return scale(d.number_of_requests); })
					.attr('height', function(d, i){ return (h/data.length); })
					.attr('fill', function(d){ return "rgb(20," + (d.number_of_requests) + ", 213)"; })
					.attr('class', "requests-barchart__bar");

				bar.append("text")
					.attr('x', leftPad)
					.attr('y', function(d, i){ return 20; })
					.attr('fill', "white")
					.text(function(d){ return d.department_name; });

				bar.append("text")
					.attr('x', function(d){ return scale(d.number_of_requests) + leftPad; })
					.attr('y', function(d, i){ return 20; })
					.text(function(d){ return d.number_of_requests; });

		});
	}
}