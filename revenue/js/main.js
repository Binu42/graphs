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
  .text("Months");

// y-axis label
g.append("text")
  .attr("class", "y-axis--label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");

// x-axis scale
const x = d3.scaleBand().padding(.2);

// y-axis scale
const y = d3.scaleLinear().range([height, 0]);

const xAxisGroup = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g")
  .attr("class", "y-axis");

d3.json("data/revenues.json").then(data => {
  console.log(data);
  // clean
  data.forEach(d => d.revenue = +d.revenue);

  d3.interval(() => {
    updateGraph(data);
  }, 1000);

  updateGraph(data);
})

function updateGraph(data) {
  y.domain([0, d3.max(data, d => d.revenue)]);
  x.domain(data.map(rev => rev.month)).range([0, width]);

  const xAxisCall = d3.axisBottom(x);
  xAxisGroup.call(xAxisCall);

  const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => `₹ ${d}`);
  yAxisGroup.call(yAxisCall)

  // JOIN new data with old elements
  const rectangles = g.selectAll("rect").data(data);

  // EXIT old elements not present in new data.
  rectangles.exit().remove();

  // UPDATE old elements present in new data.
  rectangles
    .attr("x", (d) => x(d.month))
    .attr("y", d => y(d.revenue))
    .attr("height", (d, i) => height - y(d.revenue))
    .attr("width", x.bandwidth)

  // ENTER new elements present in new data.
  rectangles.enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", d => y(d.revenue))
    .attr("height", (d, i) => height - y(d.revenue))
    .attr("width", x.bandwidth)
    .attr("fill", "gray");
}