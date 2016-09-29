'use strict';

var d3 = require('d3');
var w = 300;
var h = 200;
var pad = 5;

module.exports = {
	init(){
		
		var scale = d3.scaleLinear()
			.domain([0,100]) //input max / min
			.range([0,300]); //output max / min


		d3.json('src/data/eg_dept_requests.json', function(error, data) {
			var barHeight = 30;
			var outerBarHeight = barHeight + pad + 2; //plus 2 for the bar stroke
			let svg = d3.select('.requests-barchart')
				.append('svg')
				.attr('width', w)
				.attr('height', ((outerBarHeight * data.length) + (pad) ));
			
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
			console.log('highestRequestNumber', highestRequestNumber);
			console.log('lowestRequestNumber', lowestRequestNumber);

			var colorScale = d3.scaleLinear()
				.domain([lowestRequestNumber,highestRequestNumber])
				.range([100,200])

			var bar = svg.selectAll("bar")
				.data(data)
				.enter()
				.append("g")
					.attr('transform', function(d, i){ return "translate(0," + ((i * outerBarHeight)+pad) + ")"; });
				
				bar.append("rect")
					.attr('class', 'requests-barchart__bar')
					.attr('width', function(d){	return scale(d.number_of_requests); })
					.attr('height', barHeight)
					.attr('fill', function(d){ 
						var g = Math.ceil(colorScale(d.number_of_requests));
						return "rgb(20," + g + ", 213)"; 
					});

				bar.append("text")
					.attr('class', 'requests-barchart__bar-label')
					.attr('x', pad)
					.attr('y', (barHeight / 2) )
					.text(function(d){ return d.department_name; });

				bar.append("text")
					.attr('class', 'requests-barchart__bar-number')
					.attr('x', function(d){ return scale(d.number_of_requests) + pad; })
					.attr('y', (barHeight / 2) )
					.text(function(d){ return d.number_of_requests; });

		});
	}
}