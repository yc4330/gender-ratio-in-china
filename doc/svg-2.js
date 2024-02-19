// Set Dimensions
const margin = 40;
const xSize = 700; 
const ySize = 500;
const xMax = xSize-margin*2;
const yMax = ySize-margin*2;


// Append SVG Object to the Page
var svg = d3.select("#svg1")
  .append("svg")
  .append("g")
  .attr("transform","translate(" + margin + "," + margin + ")");

// X Axis
var xScale = d3.scaleLinear()
  .domain([0, 40000])
  .range([0, xMax]);

svg.append("g")
  .attr("transform", "translate(0," + yMax + ")")
  .call(d3.axisBottom(xScale))
  .attr("class", "x axis");

// Y Axis
var yScale = d3.scaleLinear()
  .domain([80, 130])
  .range([yMax,0]);

svg.append("g")
  .call(d3.axisLeft(yScale));

function fit_curve(x) {
  return 3471.15219/x+131.557136-2.08313543*Math.log(x);
}

/* 
var line = d3.line()
  .x(function(d) { return xScale(d[0]); })
  .y(function(d) { return yScale(3471.15219/d[0]+131.557136-2.08313543*Math.log(d[0])); });

//Line
svg.append("path")
  .datum(boundary) // binds data to the line 
  .attr("d", line) // calls the line generator 
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none");
*/

// Area, const data=boundary
var area = d3.area()
  .x(function(d) { return xScale(d[0]); })
  .y0(function(d) { return yScale(d[1]); })
  .y1(function(d) { return yScale(d[2]); })
  .curve(d3.curveBasis);

svg.append("path")
  .datum(boundary)
  .attr("fill", "gray")
  .attr("fill-opacity", 0.2)
  .attr("d", area);

// create a tooltip
var Tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .style("visibility", "visible")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("z-index", "10")
    .style("width", "auto")  // set width
    .style("height", "auto")
    .style("position", "absolute")   

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .attr("r", 10)
    d3.select("."+ d.District)
      .style("stroke", "black")
      .style("stroke-width", 2);
  }
var mousemove = function(d) {
    Tooltip
      .html(`District: ${d.District} <br> The second child: ${d.Number_2} <br> Gender Ratio: ${d.Ratio_2}`)
      .style("left", (d3.event.pageX+10) + "px")
      .style("top", (d3.event.pageY) + "px")
  }
var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this).attr("r", 5)
    d3.select("."+ d.District).style("stroke", "None");
  }

// Build color scale
var colorScale = d3.scaleLinear()
    .domain([0, 20])
    .range(["yellow", "red"]);

//Dots
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function (d) { return xScale(d.Number_2)} )
    .attr("cy", function (d) { return yScale(d.Ratio_2)} )
    .attr("r", 5)
    .attr("class", function(d){ return "dot-"+d.District; })
    .style("stroke", "black")

    //if dot is above line, fill the dot with color scale, else fill with green
    .style("fill", function(d) {
    if (yScale(d.Ratio_2) < yScale(fit_curve(d.Number_2)))
     {return colorScale(d.Ratio_2-fit_curve(d.Number_2));} 
    else {return d3.rgb("green").brighter(1); }
  })
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);
  
svg.append("text")             
    .attr("x", 450)             
    .attr("y", 410)    
    .style("text-anchor", "middle")  
    .text("Number of newborns in 2020 census year");

svg.append("text")             
    .attr("x", 80)             
    .attr("y", 0)    
    .style("text-anchor", "middle")  
    .text("Gender ratio / %");

/*
// Create the text labels
svg.selectAll(".text")
    .append("text")
    .attr("x", xScale(250))
    .attr("y", yScale(25))
    .text(`Gender Ratio/%`)
    .attr("font-size", "12px")
    //.attr("dx", "6px") // Offsets by 6px to the right of dot
    //.attr("dy", ".35em"); // Vertically centers text
*/

var svg2 = d3.select("#svg2").append("svg")
      .attr("width", 500)
      .attr("height", 500);
  
svg2.append("text")             
    .attr("x", 250)             
    .attr("y", 250)    
    .style("text-anchor", "middle")  
    .text("Gender ratio / %");

// Create a projection to convert from latitude and longitude to screen coordinates
//var projection = d3.geoMercator();
var projection = d3.geoEquirectangular()
    .center([104, 38]) // China
    .scale(500)
    .translate([250, 250]);

// Create a path generator using the projection
var geoGenerator = d3.geoPath()
    .projection(projection);

var mouseover2 = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
    // change style to stroke= black, thickness=2
      .style("stroke", "black")
      .style("stroke-width", 2)
    d3.select(".dot-"+d.properties.name).attr("r", 10)
  }
var mousemove2 = function(d) {
    Tooltip
      .html(`District: ${d.properties.name} <br> The second child: ${d.properties.Number_2}<br>Gender ratio: ${d.properties.Ratio_2}`)
      .style("left", (d3.event.pageX+10) + "px")
      .style("top", (d3.event.pageY) + "px")
  }
var mouseleave2 = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
    // change style back to original
        .style("stroke", "white")
        .style("stroke-width", 0.5)
    d3.select(".dot-"+d.properties.name).attr("r", 5)
  }

// Draw the map
svg2.selectAll("path")
      .data(geo.features)
      .enter().append("path")
      .attr("d", geoGenerator)
      .style("stroke", "white")
      .style("stroke-width", 0.5)
      .style("fill", function(d) {
    if (d.properties.Ratio_2 > fit_curve(d.properties.Number_2))
     {return colorScale(d.properties.Ratio_2-fit_curve(d.properties.Number_2));} 
    // elif d.properties.Ratio_3=null, fill with gray
    else if (d.properties.Ratio_2==null)
    {return d3.rgb("gray").brighter(1);}
     else {return d3.rgb("green").brighter(1); }
  })
    .attr("class", function(d){ return d.properties.name; })
  .on("mouseover", mouseover2)
  .on("mousemove", mousemove2)
  .on("mouseleave", mouseleave2)
;
