
function getCommitsHistory(response) {
	dataset = []
	for (var key in response) {
  			if (response.hasOwnProperty(key)) { 
  				debugger
  				var item = new Object();
					item.key = response[key][0];
					item.value = response[key][1];
					dataset.push(item);
  			};
  		}
	createChart(dataset)
}
function createChart(dataset){
	  // setup for the d3 chart
		// basic SVG setup
		var dataset = dataset;
		var margin = {top: 70, right: 20, bottom: 60, left: 100};           
		var w = 1000 - margin.left - margin.right;
		var h = 500 - margin.top - margin.bottom;

		//Create SVG element
		var svg = d3.select("div#chart")
	    .append("svg")
	    .attr("width", w + margin.left + margin.right)
	    .attr("height", h + margin.top + margin.bottom);

	  // define the x scale
		var xScale = d3.scale.ordinal()
	    .domain(dataset.map(function (d) {return d.key; }))
	    .rangeRoundBands([margin.left, w], 0.05);

		// define the x axis
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

		// define the y scale
		var yScale = d3.scale.linear()
	    .domain([0, d3.max(dataset, function(d) {return d.value; })])
	    .range([h,margin.top]);

		// define the y axis
		var yAxis = d3.svg.axis().scale(yScale).orient("left");

		// draw the x axis
		svg.append("g")
	    .attr("class", "xaxis")
	    .attr("transform", "translate(0," + h + ")")
	    .call(xAxis);

		// draw the y axis
		svg.append("g")
	    .attr("class", "yaxis")
	    .attr("transform","translate(" + margin.left + ",0)")
	    .call(yAxis);

		// add the x axis label
		svg.append("text")
			.attr("class", "x axis label")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (w / 2) + "," + (h + (margin.bottom / 2) + 10) + ")")
			.text("Date");

		// add the y axis label
		svg.append("text")
			.attr("class", "y axis label")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(15," + (h / 2) + ")rotate(-90)")
			.text("Number of commits");


		// add a title to the chart
		svg.append("text")
			.attr("class", "chartTitle")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (w / 2) + ",20)")
			.text("GitHub Repo");



// update the d3 chart

  		// update the x scale
			xScale.domain(dataset.map(function (d) {return d.key; }))
			  .rangeRoundBands([margin.left, w], 0.05);

			// update the y scale
			yScale.domain([0, d3.max(dataset, function(d) {return d.value; })])
			  .range([h,margin.top]);

			// update the x axis
			xAxis.scale(xScale).orient("bottom");

			// update the y axis
			yAxis.scale(yScale).orient("left");

			//Create bars and labels
		  bars = svg.selectAll("rect").data(dataset);
		  barLabels = svg.selectAll("text").data(dataset);

		  // add new bars
		  bars.enter()
	      .append("rect")
	      .attr("x", function(d, i) {
		      return xScale(d.key);
		    })
		    .attr("y", function(d) {
		      return yScale(d.value);
		    })
		    .attr("width", xScale.rangeBand())
		    .attr("height", function(d) {
		      return h - yScale(d.value);
		    })
		    .attr("fill", "red");

			// remove bars as necessary
			bars.exit()
	      .transition()
	      .duration(500)
	      .attr("x", w)
	      .remove();

		  // update the bars
			bars.transition()
		    .duration(750)
		    .attr("x", function(d,i) {
		      return xScale(d.key);
		    })
		    .attr("y", function(d) {
		      return yScale(d.value);
		    })
		    .attr("width", xScale.rangeBand())
		    .attr("height", function(d) {
		      return h - yScale(d.value);
		    });

		  // update the x axis
			svg.select(".xaxis")
				.transition()
				.duration(750)
		    .call(xAxis);

			// update the y axis
			svg.select(".yaxis")
				.transition()
				.duration(750)
				.call(yAxis);

			// update the title
			svg.select(".chartTitle")
				.text('repo');

			// add tooltip
			bars.on("mouseover",function(d){
				
				// add blank tooltip
				svg.append("text")
					.attr("id","tooltip");

				// get the x and y coords
				var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
				var yPosition = parseFloat(d3.select(this).attr("y")) + 18;

				// add the tooltip
				svg.select("#tooltip")
					.attr("x",xPosition)
					.attr("y",function(){
						// if value is less than 10% of max, show tooltip above bar
						var mx = d3.max(dataset, function(d) {return d.value; });
						if (d.value < 0.1 * mx) {
							return yPosition - 22;
						} else {
							return yPosition;
						};
					})
					.attr("text-anchor","middle")
					.attr("fill",function(){
						// if value is less than 10% of max, make tooltip black
						var mx = d3.max(dataset, function(d) {return d.value; });
						if (d.value < 0.1 * mx) {
							return "black";
						} else {
							return "white";
						};
					})
					.attr("font-family","sans-serif")
					.attr("font-size","12px")
					.text(d.value);

			})
			.on("mouseout",function(){
				d3.select("#tooltip").remove();
			});

}

