'use strict';

var d3 = require('d3');
var chartPadding = { top: 10, right: 60, bottom: 40, left: 60 }

module.exports = {
	init(){
		d3.json('dist/data/burn_total.json', function(error, data) {
			// =================================== Variables	
			var svgWidth = document.getElementById('burnchart').clientWidth;
			var svgHeight = svgWidth * 0.7;
			var chartWidth = (-chartPadding.left) + svgWidth + (-chartPadding.right);
			var chartHeight = (-chartPadding.top) + svgHeight + (-chartPadding.bottom);
			var pxToChartTop = chartPadding.top;
			var pxToChartBottom = chartPadding.top + chartHeight;
			var pxToChartLeft = chartPadding.left;
			var pxToChartRight = chartPadding.left + chartWidth;

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
			//left vert
			var balanceScale = d3.scaleLinear()
				.domain([balanceMin, balanceMax])
				.range([pxToChartBottom, pxToChartTop]);

			//base horz
			var parseDate = d3.timeParse("%d-%b-%y");
			var formatDate = d3.timeFormat('%e %B');
			var dateScale = d3.scaleTime()
				.domain([new Date(dateOldest), new Date(dateNewest)])
				.range([pxToChartLeft,pxToChartRight]);
			
			//right vert
			var burnScale = d3.scaleLinear()
				.domain([burnMax+1, burnMin-1])
				.range([pxToChartTop, pxToChartBottom]);



			var newLine = d3.line()
				.x(function(d) { return dateScale(d.date); })
				.y(function(d) { return burnScale(d.new); });
			var newArea = d3.area()
				.x(function(d) { return dateScale(d.date); })
				.y0(pxToChartBottom)
				.y1(function(d) { return burnScale(d.new); });

			var resolvedLine = d3.line()
				.x(function(d) { return dateScale(d.date); })
				.y(function(d) { return burnScale(d.resolved); });
			var resolvedArea = d3.area()
				.x(function(d) { return dateScale(d.date); })
				.y0(pxToChartBottom)
				.y1(function(d) { return burnScale(d.resolved); });

			var balanceLine = d3.line()
				.x(function(d) { return dateScale(d.date); })
				.y(function(d) { return balanceScale(d.balance); });

			// =================================== Starting D3
			let svg = d3.select('#burnchart')
				.attr('height', svgHeight);

			//Left Y
			svg.append('g')
				.attr('transform', 'translate(' + pxToChartLeft + ',0)')
				.attr('class', 'burnchart__axis')
				.call(d3.axisLeft(balanceScale).ticks(10));

			//The X axis
			svg.append('g')
				.attr('transform', 'translate(0,' + pxToChartBottom + ')')
				.attr('class', 'burnchart__axis')
				.call(d3.axisBottom(dateScale).ticks(10));

			//Right Y
			svg.append('g')
				.attr('transform', 'translate(' + pxToChartRight + ',0)')
				.attr('class', 'burnchart__axis')
				.call(d3.axisRight(burnScale).ticks(10));

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

			var xChartCenter = pxToChartTop + (chartHeight/2);
			//Axis labels
			svg.append('text')
				.attr('y',0)
				.attr('transform', 'translate(18, ' + Number(xChartCenter) + ') rotate(-90)')
				.attr('class', 'burnchart__axis-label')
				.text('Balance');
			svg.append('line')
				.attr('x1', 25)
				.attr('y1', pxToChartTop)
				.attr('x2', 25)
				.attr('y2', pxToChartBottom)
				.attr("class", "burnchart__balance-line")

			svg.append('text')
				.attr('y',0)
				.attr('transform', 'translate(' + (svgWidth - 18) + ', ' + Number(xChartCenter) + ') rotate(90)')
				.attr('class', 'burnchart__axis-label')
				.text('New / Resolved');
			svg.append('line')
				.attr('x1', (svgWidth - 25))
				.attr('y1', pxToChartTop)
				.attr('x2', (svgWidth - 25))
				.attr('y2', xChartCenter)
				.attr("class", "burnchart__new-line")
			svg.append('line')
				.attr('x1', (svgWidth - 25))
				.attr('y1', xChartCenter)
				.attr('x2', (svgWidth - 25))
				.attr('y2', pxToChartBottom)
				.attr("class", "burnchart__resolved-line")

		});
	}
}