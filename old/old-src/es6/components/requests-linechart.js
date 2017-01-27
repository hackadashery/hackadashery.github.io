'use strict';

var $ = require("jquery");
var d3 = require('d3');
var eventManager = require('../utils/eventManager');
var api = require('./api');
var chartIsBuilt = false;

module.exports = {
	init(){
		eventManager.subscribe('section_opened', function(event){
			if (event.data.section == 'linebasic') {
				buildChart();
			}
		});
		eventManager.subscribe('section_closed', function(event){
			if (event.data.section == 'linebasic') {
				//unload the DOM elements
			}
		});
	}
}

function buildChart(){
	if (chartIsBuilt) { return; }
	chartIsBuilt = true;

	// ------------------------------------------------------------------------------
	// GET TIME RANGE AND SERVICE TYPE, BUILD URL
	// ------------------------------------------------------------------------------
	function createQuery() {
		var $advForm = $('.js-filter-form');
		var queryStringsArray = [];

		//get timerange
		var timeRng = $advForm.find('input:radio[name=time]:checked').val();
		var frmtTimeRng = api.getTimeRange(timeRng);
		var serviceQuery = '';
		if (frmtTimeRng.length > 0) {
			serviceQuery = "requested_datetime>='" + frmtTimeRng + "'";
			queryStringsArray.push(serviceQuery);
		}

		//get req number
		var serviceNo = $advForm.find('.js-service').val();
		var serviceQuery = '';
		if (serviceNo.length > 0) {
			serviceQuery = "service_code='" + serviceNo + "'";
			queryStringsArray.push(serviceQuery);
		}

		var queryString = queryStringsArray.join(' AND ');
		if (queryString.length > 0) {
			var url = api.getD3url(queryString);
			getd3(url);  
		}
	}
	createQuery();

	$('.js-filter-form').change(function() {
		createQuery();
	})
	

	// ------------------------------------------------------------------------------
	// BUILD SVG CHART AND GET DATA!
	// ------------------------------------------------------------------------------ 
	function getd3(url) {
		d3.select('.requests-linechart__graph').remove(); // if graph is there, clear it out before building another

		var svgWidth = document.getElementById('linebasic').clientWidth;
		var svgHeight = Math.min( (svgWidth * 0.5), (screen.height - 90) ); console.log('SCREEN HEIGHT', svgHeight);
		var chartPadding = { top: 80, right: 60, bottom: 60, left: 70 }
		var chartWidth = (-chartPadding.left) + svgWidth + (-chartPadding.right);
		var chartHeight = (-chartPadding.top) + svgHeight + (-chartPadding.bottom);

		// parse the date
		var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L");
		var parseDay = d3.timeParse("%Y-%m-%d");

		// style the date for tooltips
		var formatDate = d3.timeFormat('%a %b %e');

		// for aggregation
		var dayDate = d3.timeFormat("%Y-%m-%d");

		// scale the data to the size of the graph
		var x = d3.scaleTime().range([0,chartWidth]);
		var y = d3.scaleLinear().range([chartHeight,0]);

		// generate line path and set up strucure to put data into sets of x,y coordinates
		var valueline = d3.line()
			.x(function(d) { return x(d.day); })
			.y(function(d) { return y(d.sum); });

		// generate tooltop div element
		var div = d3.select('.requests-linechart')
			.append('div')
				.attr('class', 'line-basic__tooltip')
				.style('opacity', 0);

		// add SVG element to DOM as our line graph canvas and set its dimensions
		var svg = d3.select('.requests-linechart')
			.append('svg')
				.attr('width', svgWidth)
				.attr('height', svgHeight)
				.attr('class', 'requests-linechart__graph')
			.append('g')
				.attr('transform', 'translate(' + chartPadding.left + ',' + chartPadding.top + ')');

		// make horizontal grid lines for graph
		function make_y_axis() {
			return d3.axisLeft(y).ticks(5);
		}
		
		d3.json(url, function(error, data) {
			$.each(data, function(d) {
				 data[d].date = parseDate(data[d].requested_datetime);
				 data[d].dayFormat = dayDate(data[d].date);
			});

			var reqsPerDay = d3.nest()
				.key(function(d) { return d.dayFormat; }).sortKeys(d3.ascending)
				.key(function(d) { return d["service_name"]; })
				.rollup(function(v) { return {
					"count": v.length } 
				})
				.entries(data);
			// console.log(JSON.stringify(reqsPerDay));

			reqsPerDay.forEach(function(d) {
				d.sum = +d.values[0].value.count;
				d.day = parseDay(d.key);			
			});

			var requestTypes = d3.nest()
				.key(function(d) { return d["service_name"]; })
				.rollup(function(v) { return {
					"count": v.length } 
				})
				.entries(data);
				console.log(JSON.stringify(requestTypes));

			// define the scope of the data on x and y axes
			x.domain(d3.extent(data, function(d) {
				return d.date;
			}));

			y.domain([0, d3.max(reqsPerDay, function(d) {
				return d.sum;
			})]);

			// add graph grid
			svg.append('g')
				.attr('class', 'line-basic__grid')
				.call(make_y_axis()
					.tickSize(-chartWidth, 0, 0)
					.tickFormat("")
				)

			// add valueline path with data
			svg.append('path')
				.data([reqsPerDay])
				.attr('class', 'requests-linechart__line') 
				.attr('d', valueline);

			// add x-axis
			svg.append('g')
				.attr('transform', 'translate(0,' + chartHeight + ')')
				.attr('class', 'requests-linechart__axis requests-linechart__axis-x')
				.call(d3.axisBottom(x).ticks(5));

			// add y-axis
			svg.append('g')
				.attr('class', 'requests-linechart__axis requests-linechart__axis-y')
				.call(d3.axisLeft(y).ticks(5));

			// add graph title
			var title_type = $('.js-service :selected').text();
			console.log(title_type);
			svg.append('text')
				.attr('x', (chartWidth/2))
				.attr('y', -30)
				.attr('class', 'requests-linechart__title')
				.text(title_type + ' Requests Received'); 

			//add data points with tooltips
			svg.selectAll('dot')
					.data(reqsPerDay)
				.enter().append('circle')
					.attr('r', 5) 
					.attr('cx', function(d) {return x(d.day); })
					.attr('cy', function(d) { return y(d.sum); })
					.attr('class', 'requests-linechart__datapoint')
					.on('mouseover', function(d) {
						div.transition()
							.duration(200)
							.style('opacity', .9);
						div.html(formatDate(d.day) + '<br/>' + d.sum)
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
