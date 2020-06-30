// Set SVG wrapper dimensions
var svgWidth = 1000;
var svgHeight = 850;

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
.attr("transform", `translate(${margin.left}, ${margin.top})`)
.attr("class", "chart");

// Initial Parameters
var chosenXAxis = "poverty"
var chosenYAxis = "obesity"

// Function for updating x-scale upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=> d[chosenXAxis]) * 0.9, d3.max(stateData, d=> d[chosenXAxis]) * 1.1])
        .range([0, width]);

    return xLinearScale;
}

// Function for updating y-scale upon click on axis label
function yScale (stateData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=> d[chosenYAxis]) * 0.9, d3.max(stateData, d=> d[chosenYAxis]) * 1.1])
        .range([height, 0]);
    
    return yLinearScale;
}

// Function for updating xAxis var upon click of axis label
function renderXAxis(newScale, xAxis) {
    var bottomAxis = d3.axisBottom(newScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

// Function for updating yAxis var upon click of axis label
function renderYAxis(newScale, yAxis) {
    var leftAxis = d3.axisLeft(newScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

// Function for updating circles group with transition
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
    return circlesGroup;
}

// Function for updating text labels with transition
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]) + 5);

    return textGroup;
}

// Function for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;

    if (chosenXAxis === "poverty") {
        xLabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        xLabel = "Age";
    }
    else {
        xLabel = "Household Income (Median)";
    }

    var yLabel;
    if (chosenYAxis === "obesity") {
        yLabel = "Obesity (%)";
    }
    else if (chosenYAxis === "smokes") {
        yLabel = "Smokes";
    }
    else {
        yLabel = "Lacks Healthcare (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);
    // textGroup.call(ToolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    // textGroup.on("mouseover", function(data) {
    //     toolTip.show(data);
    // })
    //     .on("mouseout", function(data) {
    //         toolTip.hide(data);
    //     });

    return circlesGroup;
    // return textGroup;
};

// Get data from csv and execute all
d3.csv("data.csv").then(function(stateData, err) {
    if (err) throw err;

    // parse data
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // xLinearScale and yLinearScale functions
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        .attr("opacity", "0.75");
    
    // Append initial text
    var textGroup = chartGroup.append("g").selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)
        .attr("class", "stateText");
   
    // var textGroup = chartGroup.selectAll("text")
    //     .data(stateData);

    // textGroup.enter()
    //     .append("text")
    //     .text(d => d.abbr)
    //     .attr("x", d => xLinearScale(d[chosenXAxis]))
    //     .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)
    //     .attr("class", "stateText")
    //     .merge(textGroup);

    
    // Create group for x axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
    
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 5)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age");
    
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 35)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    // Creat group for y axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0- (margin.left/2))
        .attr("x", 0 - (height/2))
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obese (%)")

    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 15- (margin.left/2))
        .attr("x", 0 - (height/2))
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)")

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 30- (margin.left/2))
        .attr("x", 0 - (height/2))
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)")

    // Update toolTip function
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // replace chosenXAxis with value
                chosenXAxis = value;
                console.log(chosenXAxis);
                
                // updates x scale
                xLinearScale = xScale(stateData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates circles with new x and y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates circle text with new x and y values
                textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("inactive", true)
                        .classed("active", false);
                    incomeLabel
                        .classed("inactive", true)
                        .classed("active", false);     
                }
                else if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("inactive", true)
                        .classed("active", false);
                    povertyLabel
                        .classed("inactive", true)
                        .classed("active", false); 
                }
                else {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("inactive", true)
                        .classed("active", false);
                    incomeLabel
                        .classed("inactive", true)
                        .classed("active", false); 
                }
            }
        })

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // replace chosenYAxis with value
                chosenYAxis = value;
                console.log(chosenYAxis);
                
                // updates y scale
                yLinearScale = yScale(stateData, chosenYAxis);

                // updates y axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // updates circles with new x and y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates circle text with new x and y values
                textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("inactive", true)
                        .classed("active", false);
                    healthcareLabel
                        .classed("inactive", true)
                        .classed("active", false);     
                }
                else if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("inactive", true)
                        .classed("active", false);
                    smokesLabel
                        .classed("inactive", true)
                        .classed("active", false); 
                }
                else {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("inactive", true)
                        .classed("active", false);
                    smokesLabel
                        .classed("inactive", true)
                        .classed("active", false); 
                }
            }
        })
})