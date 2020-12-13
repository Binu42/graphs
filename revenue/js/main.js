const margin = { left: 80, right: 20, top: 50, bottom: 100 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
let flag = true;
const t = d3.transition().duration(750);

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
const yLabel = g.append("text")
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
  // console.log(data);
  // clean data ( string to num)
  data.forEach(d => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  d3.interval(() => {
    const newData = flag ? data : data.slice(1);
    updateGraph(newData);
    flag = !flag;
  }, 1000);

  updateGraph(data);
})

function updateGraph(data) {
  const value = flag ? "revenue" : "profit";
  y.domain([0, d3.max(data, d => d[value])]);
  x.domain(data.map(rev => rev.month)).range([0, width]);

  const xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => `₹ ${d}`);
  yAxisGroup.transition(t).call(yAxisCall)

  // JOIN new data with old elements
  const rectangles = g.selectAll("rect").data(data, (data) => data.month);

  // EXIT old elements not present in new data.
  rectangles
    .exit()
    .attr("fill", "red")
    .transition(t)
    .attr("y", y(0))
    .attr("height", 0)
    .remove();

  // // UPDATE old elements present in new data.
  // rectangles
  //   .transition(t)
  //   .attr("x", (d) => x(d.month))
  //   .attr("y", d => y(d[value]))
  //   .attr("height", (d, i) => height - y(d[value]))
  //   .attr("width", x.bandwidth)

  // ENTER new elements present in new data.
  rectangles.enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("fill", "gray")
    .attr("y", y(0))
    .attr("height", 0)
    .attr("fill-opacity", 0)
    .merge(rectangles)
    .transition(t)
    .attr("x", (d) => x(d.month))
    .attr("y", d => y(d[value]))
    .attr("width", x.bandwidth)
    .attr("height", (d, i) => height - y(d[value]))
    .attr("fill-opacity", 1);

  var label = flag ? "Revenue" : "Profit";
  yLabel.text(label);
}