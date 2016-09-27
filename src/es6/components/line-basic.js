'use strict';

// ===================================================================================
// A HEAVILY ANNOTATED TUTORIAL FOR A LINE CHART
// source here: https://leanpub.com/D3-Tips-and-Tricks/read#leanpub-auto-introduction
// v4 updated code here: https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73
// simple local server: ruby -run -e httpd . -p 8000
// ===================================================================================

var d3 = require('d3');

module.exports = {
	init: function(){
		// define the margins of the graph element, and the width and height of the 
		// inner-container where the graph will live
		var margin = {
			top: 30,
			right: 20,
			bottom: 30,
			left: 50
		},

			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		// parse the date
		var parseDate = d3.timeParse("%d-%b-%y");

		// style the date for tooltips
		var formatDate = d3.timeFormat('%e %B');

		// scale the date to the size of the graph
		// the coordinates '0,0' originate in the top-left, so we need to reverse
		// the y-axis default so higher values are close to the '0,0' position
		var x = d3.scaleTime().range([0,width]);
		var y = d3.scaleLinear().range([height,0]);

		//generate area for line graph fill
		var area = d3.area()
			.x(function(d) { return x(d.date); })
			.y0(height)
			.y1(function(d) { return y(d.close); })

		// generate line path and set up strucure to put data into sets of x,y coordinates
		var valueline = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.close); });

		// generate tooltop div element
		var div = d3.select('.line-basic')
			.append('div')
				.attr('class', 'line-basic__tooltip')
				.style('opacity', 0);

		// add SVG element to DOM as our line graph canvas and set its dimensions
		// add a 'g' element, which will be a grouping element for our graph
		// move g element to top-left corner of the graph's inner-container
		var svg = d3.select('.line-basic')
			.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// make grid lines for graph
		function make_x_axis() {
			return d3.axisBottom(x).ticks(5);
		}

		function make_y_axis() {
			return d3.axisLeft(y).ticks(5);
		}

		// GET DATA!
		d3.json('src/data/line-basic-data.json', function(error, data) {
			data.forEach(function(d) {
				d.date = parseDate(d.date);
				d.close = +d.close; // '+' operator sets close to numeric value
			});

			// define the scope of the data on x and y axes
			// extent() grabs highest and lowest values
			// domain() defines those high/low values as the range
			x.domain(d3.extent(data, function(d) {
				return d.date;
			}));
			// for y, we find the max value and define the domain as  0 to max
			y.domain([0, d3.max(data, function(d) {
				return d.close;
			})]);

			// add area with data
			svg.append('path')
				.datum(data)
				.attr('class', 'line-basic__area')
				.attr('d', area);

			// add valueline path with data
			svg.append('path')
				.data([data])
				.attr('class', 'line-basic__line')
				.attr('d', valueline);

			// add x-axis
			svg.append('g')
				.attr('transform', 'translate(0,' + height + ')') // moves x axis from original position at top of graph to bottom
				.call(d3.axisBottom(x).ticks(5));

			// label x-axis, centering it using graph size variables
			svg.append('text')
				.attr('transform',
					'translate(' + (width/2) + ',' + (height + margin.bottom) + ')')
				.style('text-anchor', 'middle')
				.text('Date');

			// add y-axis
			svg.append('g')
				.call(d3.axisLeft(y).ticks(5));

			// label y-axis, centering and rotating it
			svg.append('text')
				.attr('transform', 'rotate(-90)') // puts reference point in bottom-left corner as 'y,x'
				.attr('y', 0 - margin.left) // moves text left the width of margin-left, off-canvas
				.attr('x', 0 - (height/2))  // moves text up to center it vertically
				.attr('dy', '1em') // nudges text right again by the height of the text
				.style('text-anchor', 'middle')
				.text('Value');

			// add graph title
			svg.append('text')
				.attr('x', (width/2))
				.attr('y', 0 - (margin.top / 2))
				.attr('text-anchor', 'middle')
				.style('font-size', '16px')
				.style('text-decoration', 'underline')
				.text('Simple Line Graph');

			// add graph grid
			svg.append('g')
				.attr('class', 'line-basic__grid')
				.attr('transform', 'translate(0,' + height + ')')
				.call(make_x_axis()
					.tickSize(-height, 0, 0)  // make the 'major' ticks the height of graph
					.tickFormat("") // disallows labels on these 'ticks'
				)

			svg.append('g')
				.attr('class', 'line-basic__grid')
				.call(make_y_axis()
					.tickSize(-width, 0, 0) // make the 'major' ticks the width of graph
					.tickFormat("")
				)

			// add data points with tooltips
			svg.selectAll('dot') // provides a grouping label for the elements to be added
					.data(data)
				.enter().append('circle')
					.attr('r', 5)  // declare radius
					.attr('cx', function(d) {return x(d.date); })  // assign x,y coordinates
					.attr('cy', function(d) { return y(d.close); })
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