'use strict';

var d3 = require('d3');
var chartPadding = { top: 0, right: 40, bottom: 40, left: 40 }

module.exports = {
	init(){
		d3.json('dist/data/burn_total.json', function(error, data) {
			// =================================== Variables		
			var chartWidth = document.getElementById('burnchart').clientWidth;
			var chartHeight = chartWidth * 0.7;
			console.log('chartWidth', chartWidth);
			var balanceMax = -Infinity;
			var balanceMin = Infinity;
			var burnMax = -Infinity;
			var burnMin = Infinity;
			var dateOldest = Infinity; //?
			var dateNewest = -Infinity; //?
			data.map(function(date){
				balanceMax = Math.max(date.balance, balanceMax);
				balanceMin = Math.min(date.balance, balanceMin);
				burnMax = Math.max(date.new, date.resolved, burnMax);
				burnMin = Math.min(date.new, date.resolved, burnMin);
				date.date = Date.parse(date.date);
				dateOldest = Math.min(date.date, dateOldest);
				dateNewest = Math.max(date.date, dateNewest);
			});



			// =================================== Scales
			var balanceScale = d3.scaleLinear()
				.domain([balanceMin, balanceMax])
				.range([chartHeight, 0]);

			var parseDate = d3.timeParse("%d-%b-%y");
			var formatDate = d3.timeFormat('%e %B');
			var dateScale = d3.scaleTime()
				.domain([new Date(dateOldest), new Date(dateNewest)])
				.range([0,chartWidth]);
			
			var burnScale = d3.scaleLinear()
				.domain([burnMax+1, burnMin-1])
				.range([0,chartHeight]);



			var newLine = d3.line()
				.x(function(d) { return dateScale(d.date); })
				.y(function(d) { return burnScale(d.new); });
			var newArea = d3.area()
				.x(function(d) { return dateScale(d.date); })
				.y0(chartHeight)
				.y1(function(d) { return burnScale(d.new); });

			var resolvedLine = d3.line()
				.x(function(d) { return dateScale(d.date); })
				.y(function(d) { return burnScale(d.resolved); });
			var resolvedArea = d3.area()
				.x(function(d) { return dateScale(d.date); })
				.y0(chartHeight)
				.y1(function(d) { return burnScale(d.resolved); });

			var balanceLine = d3.line()
				.x(function(d) { return dateScale(d.date); })
				.y(function(d) { return balanceScale(d.balance); });

			// =================================== Starting D3
			let svg = d3.select('#burnchart')
				.attr('height', chartHeight);

			//new issues line
			svg.append("path")
				.datum(data)
				.attr("class", "burnchart__new-line")
				.attr("d", newLine);
			svg.append("path")
				.datum(data)
				.attr("class", "burnchart__new-area")
				.attr("d", newArea);

			//resolved issues line
			svg.append("path")
				.datum(data)
				.attr("class", "burnchart__resolved-line")
				.attr("d", resolvedLine);
			svg.append("path")
				.datum(data)
				.attr("class", "burnchart__resolved-area")
				.attr("d", resolvedArea);

			//total issues line
			svg.append("path")
				.datum(data)
				.attr("class", "burnchart__balance-line")
				.attr("d", balanceLine);
			

			//The dots
			svg.selectAll("point")
				.data(data)
				.enter().append("circle")
				.attr("r", 5)
				.attr("class", "burnchart__new-dot")
				.attr("cx", (d) => { return dateScale(d.date) })
				.attr("cy", (d) => { return burnScale(d.new) });
			svg.selectAll("point")
				.data(data)
				.enter().append("circle")
				.attr("r", 5)
				.attr("class", "burnchart__resolved-dot")
				.attr("cx", (d) => { return dateScale(d.date) })
				.attr("cy", (d) => { return burnScale(d.resolved) });
			svg.selectAll("point")
				.data(data)
				.enter().append("circle")
				.attr("r", 5)
				.attr("class", "burnchart__balance-dot")
				.attr("cx", (d) => { return dateScale(d.date) })
				.attr("cy", (d) => { return balanceScale(d.balance) });

		});
	}
}