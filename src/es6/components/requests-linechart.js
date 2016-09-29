'use strict';

var d3 = require('d3');

module.exports = {
	init: function(){

		var margin = {
			top: 30,
			right: 20,
			bottom: 30,
			left: 50
		},

			width = 500 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		// parse the date
		var parseDate = d3.timeParse("%d-%b-%y");

		// style the date for tooltips
		var formatDate = d3.timeFormat('%e %B');

		// scale the data to the size of the graph
		var x = d3.scaleTime().range([0,width]);
		var y = d3.scaleLinear().range([height,0]);

		// generate line path and set up strucure to put data into sets of x,y coordinates
		var valueline = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.close); });

		// generate tooltop div element
		var div = d3.select('.requests-linechart')
			.append('div')
				.attr('class', 'line-basic__tooltip')
				.style('opacity', 0);

		// add SVG element to DOM as our line graph canvas and set its dimensions
		var svg = d3.select('.requests-linechart')
			.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.attr('class', 'requests-linechart__graph')
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// make grid lines for graph
		function make_y_axis() {
			return d3.axisLeft(y).ticks(5);
		}

		// GET DATA!
		d3.json('data/line-basic-data.json', function(error, data) {
			data.forEach(function(d) {
				d.date = parseDate(d.date);
				d.close = +d.close; // '+' operator sets close to numeric value
			});

			// define the scope of the data on x and y axes
			x.domain(d3.extent(data, function(d) {
				return d.date;
			}));

			y.domain([0, d3.max(data, function(d) {
				return d.close;
			})]);

			// add graph grid
			svg.append('g')
				.attr('class', 'line-basic__grid')
				.call(make_y_axis()
					.tickSize(-width, 0, 0)
					.tickFormat("")
				)

			// add valueline path with data
			svg.append('path')
				.data([data])
				.attr('class', 'requests-linechart__line')
				.attr('d', valueline);

			// add x-axis
			svg.append('g')
				.attr('transform', 'translate(0,' + height + ')')
				.attr('class', 'requests-linechart__axis requests-linechart__axis-x')
				.call(d3.axisBottom(x).ticks(5));

			// add y-axis
			svg.append('g')
				.attr('class', 'requests-linechart__axis requests-linechart__axis-y')
				.call(d3.axisLeft(y).ticks(5));

			// add graph title
			svg.append('text')
				.attr('x', (width/2))
				.attr('y', 0 - (margin.top / 2))
				.attr('class', 'requests-linechart__title')
				.text('Requests Received');

			// add data points with tooltips
			svg.selectAll('dot')
					.data(data)
				.enter().append('circle')
					.attr('r', 5) 
					.attr('cx', function(d) {return x(d.date); })
					.attr('cy', function(d) { return y(d.close); })
					.attr('class', 'requests-linechart__datapoint')
					.on('mouseover', function(d) {
						div.transition()
							.duration(200)
							.style('opacity', .9);
						div.html(formatDate(d.date) + '<br/>' + d.close)
							.style('left', (d3.event.pageX) + 'px')
							.style('top', (d3.event.pageY - 28) + 'px');
					})
					.on('mouseout', function(d) {
						div.transition()
							.duration(500)
							.style('opacity', 0);
					});
		});
	}
}