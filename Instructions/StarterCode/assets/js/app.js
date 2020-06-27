// @TODO: YOUR CODE HERE!


// Set SVG wrapper dimensions
var svgWidth = 1000;
var svgHeight = 800;

var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


// append svg and group
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from csv
d3.csv("data.csv").then(function(stateData){
    console.log(stateData)

    // Convert all numbers from strings
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // Create scale functions
    xScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=> d.poverty) * 0.9, d3.max(stateData, d=> d.poverty) * 1.1])
        .range([0, width]);

    yScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=> d.obesity) * 0.9, d3.max(stateData, d=> d.obesity) * 1.1])
        .range([height, 0]);
    
    // Create axis functions
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    chartGroup.append("g")
        .call(yAxis);
    
    // Append circles
    circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", "15")
        // .attr("fill", "blue")
        // .attr("stroke-width", "1")
        .attr("opacity", "0.75")
        // .attr("stroke", "black");
    
    // Create tooltip
    // var toolTip = d3.tip()
    //     .attr("class", "d3-tip")
    //     .offset([0,10])
    //     .html(function(d){
    //         return(`<strong>${d.abbr}</strong>`);
    //     })
    // console.log(toolTip);
    // chartGroup.call(toolTip);
   
    // circlesGroup.on("mouseover", function(d){
    //     toolTip.show(d, this);
    // })
    
    var textGroup = chartGroup.selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.obesity) + 5)
        .attr("class", "stateText");
    


    // Set axis labels
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "blue")
    .text("In Poverty %");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0- (margin.left/2))
    .attr("x", 0 - (height/2))
    // .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "blue")
    .text("Obesity (%)");
 

}).catch(function(error){
    console.log(error);
});




















// // scales
// var xScale = d3.scaleLinear()
// .domain([0, pizzasEatenByMonth.length])
// .range([0, width]);

// var yScale = d3.scaleLinear()
// .domain([0, d3.max(pizzasEatenByMonth)])
// .range([height, 0]);

// // line generator
// var line = d3.line()
// .x((d, i) => xScale(i))
// .y(d => yScale(d));

// // create path
// chartGroup.append("path")
// .attr("d", line(pizzasEatenByMonth))
// .attr("fill", "none")
// .attr("stroke", "blue");

// // append circles to data points
// var circlesGroup = chartGroup.selectAll("circle")
// .data(pizzasEatenByMonth)
// .enter()
// .append("circle")
// .attr("cx", (d, i) => xScale(i))
// .attr("cy", d => yScale(d))
// .attr("r", "5")
// .attr("fill", "red");

