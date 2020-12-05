// First graph

// d3.json("data/ages.json").then((data) => {
// 	data.forEach(data => data.age = +data.age);
// 	const svg = d3.select("#chart-area").append("svg")
// 		.attr("width", 400)
// 		.attr("height", 400);
// 	console.log(data);

// 	const circles = svg.selectAll("circles").data(data);

// 	circles.enter()
// 		.append("circle")
// 		.attr("cx", (d, i) => {
// 			return (i * 50) + 25;
// 		})
// 		.attr("cy", (d, i) => {
// 			return 25;
// 		})
// 		.attr("r", (d, i) => {
// 			return d.age * 2;
// 		})
// 		.attr("fill", (data) => {
// 			if (data.name === "Emily")
// 				return 'pink';
// 			return 'red';
// 		});
// })

// second graph

const margin = { left: 100, right: 10, top: 10, bottom: 150 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const g = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// x-axis label
g.append("text")
	.attr("class", "x-axis--label")
	.attr("x", width / 2)
	.attr("y", height + 110)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("world's tallest buildings");

// y-axis label
g.append("text")
	.attr("class", "y-axis--label")
	.attr("x", -(height / 2))
	.attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Height (m)");

d3.json("data/buildings.json").then((data) => {
	data.forEach(data => data.height = +data.height);

	const x = d3.scaleBand().domain(data.map(city => city.name)).range([0, width]).paddingInner(0.3).paddingOuter(0.3);

	const y = d3.scaleLinear().domain([0, d3.max(data, d => d.height)]).range([0, height]);

	const xAxisCall = d3.axisBottom(x);
	g.append("g")
		.attr("class", "x-axis")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxisCall)
		.selectAll("text")
		.attr("y", "10")
		.attr("x", "-5")
		.attr("text-anchor", "end")
		.attr("transform", 'rotate(-40)');

	const yAxisCall = d3.axisLeft(y)
		.ticks(3)
		.tickFormat(d => `${d}m`);
	g.append("g")
		.attr("class", "y-axis")
		.call(yAxisCall)

	const rectangles = g.selectAll("rect").data(data);
	rectangles.enter()
		.append("rect")
		.attr("x", (d) => x(d.name))
		.attr("y", 0)
		.attr("height", (d, i) => y(d.height))
		.attr("width", x.bandwidth)
		.attr("fill", (data) => {
			return 'black';
		});
})