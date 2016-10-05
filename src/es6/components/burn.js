'use strict';

var d3 = require('d3');
var chartPadding = { top: 0, right: 40, bottom: 40, left: 40 }

module.exports = {
	init(){
		d3.json('dist/data/burn_total.json', function(error, data) {
			// =================================== Variables		
			var chartWidth = document.getElementById('burnchart').clientWidth;
			console.log('chartWidth', chartWidth);
			var balanceMax = -Infinity;
			var balanceMin = Infinity;
			var burnMax = -Infinity;
			var burnMin = Infinity;
			var dateOldest = -Infinity; //?
			var dateNewest = Infinity; //?
			data.map(function(date){
				balanceMax = Math.max(date.balance, balanceMax);
				balanceMin = Math.min(date.balance, balanceMin);
				burnMax = Math.max(date.new, date.resolved, burnMax);
				burnMin = Math.min(date.new, date.resolved, burnMin);
				date.date = Date.parse(date.date);
				dateOldest = Math.min(date.date, dateOldest);
				dateNewest = Math.max(date.date, dateNewest);
				date.date = new Date(date.date);
			});


			// =================================== Scales
			var balanceScale = d3.scaleLinear()
				.domain([balanceMin, balanceMax])
				.range([0,250]);

			var parseDate = d3.timeParse("%d-%b-%y");
			var formatDate = d3.timeFormat('%e %B');
			var dateScale = d3.scaleTime()
				.domain([dateOldest, dateNewest])
				.range([0,chartWidth]);
			
			var burnScale = d3.scaleLinear()
				.domain([burnMin, burnMax])
				.range([0,250]);



			var newLine = d3.line()
				.x(function(d) { 
					console.log('date', d.date);
					console.log('scale', dateScale(d.date));
					console.log('---');
					return dateScale(d.date); 
				})
				.y(function(d) { return burnScale(d.new); });

			// =================================== Starting D3
			let svg = d3.select('#burnchart');
			svg.append("path")
				.datum(data)
				.attr("class", "line")
				.attr("d", newLine);

		});
	}
}