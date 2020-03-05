var margin = {top: 60, right: 20, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 365 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%b %Y");

var x = d3.scaleTime()
  .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rate); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/_assets/data/unemployment_2005_2015.csv", function(error, data) {
  if (error) throw error;
  console.log(data);

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.rate = +d.rate;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.rate; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Unemployment Rate (%)");

  // Start Animation on Click
  d3.select("#start").on("click", function() {
    var path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    // Variable to Hold Total Length
    var totalLength = path.node().getTotalLength();

    // Set Properties of Dash Array and Dash Offset and initiate Transition
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
     .transition() // Call Transition Method
      .duration(4000) // Set Duration timing (ms)
      .ease(d3.easeLinear) // Set Easing option
      .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
  });

  // Reset Animation
  d3.select("#reset").on("click", function() {
    d3.select(".line").remove();
  });

});

