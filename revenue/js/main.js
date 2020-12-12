const margin = { left: 80, right: 20, top: 50, bottom: 100 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const g = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// x-axis label
g.append("text")
  .attr("class", "x-axis--label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("font-size", "20px")
  .attr("Months");

// y-axis label
g.append("text")
  .attr("class", "y-axis--label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");

d3.json("data/revenues.json").then(data => {
  console.log(data);
  // clean
  data.forEach(d => d.revenue = +d.revenue);

  // x-axis scale
  const x = d3.scaleBand().domain(data.map(rev => rev.month)).range([0, width]).padding(.2);

  // y-axis scale
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.revenue)]).range([height, 0]);

  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisCall);

  const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => `$ ${d}`);
  g.append("g")
    .attr("class", "y-axis")
    .call(yAxisCall)

  const rectangles = g.selectAll("rect").data(data);
  rectangles.enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", d => y(d.revenue))
    .attr("height", (d, i) => height - y(d.revenue))
    .attr("width", x.bandwidth)
    .attr("fill", "gray");
})