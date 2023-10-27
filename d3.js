function updateChart() {
  d3.csv("cpu_usage_data.csv"+'?' + Math.floor(Math.random() * 1000))
    .then(function (data) {
      // Parse timestamps as dates
      const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

      data.forEach(function (d) {
        d.timestamp = parseTime(d.timestamp);
        d.cpu_usage = +d.cpu_usage;
      });

      // Define dimensions of the chart
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create an SVG element to hold the chart
      const svg = d3
        .select("#chart")
        .selectAll("svg")
        .data([data])
        .enter()
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define x and y scales
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.timestamp))
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.cpu_usage)])
        .nice()
        .range([height, 0]);

      // Create a line generator
      const line = d3
        .line()
        .x((d) => xScale(d.timestamp))
        .y((d) => yScale(d.cpu_usage));

      // Create or update the line chart
      const path = svg.selectAll(".line").data([data]);

      path
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", "blue")
        .attr("fill", "white");

      path
        .attr("d", line);

      path.exit().remove();

      // Add X and Y axes
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

      svg
         .append("text")
         .attr("transform", `translate(${width / 2},${height + margin.bottom})`)
         .style("text-anchor", "middle")
         .text("Time");

      svg
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 0 - margin.left)
         .attr("x", 0 - height / 2)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .text("CPU Usage (%)");

    })
    .catch(function (error) {
      console.error("Error loading data: " + error);
    });
}

// Call the function to load and update the chart initially
updateChart();

// Set up a timer to reload the chart every two seconds
//setInterval(updateChart, 2000);
