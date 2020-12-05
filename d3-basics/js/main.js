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

d3.json("data/buildings.json").then((data) => {
	data.forEach(data => data.height = +data.height);
	const svg = d3.select("#chart-area").append("svg")
		.attr("width", 400)
		.attr("height", 400);

	const y = d3.scaleLinear().domain([0, 850]).range([0, 400]);

	const rectangles = svg.selectAll("rect").data(data);

	rectangles.enter()
		.append("rect")
		.attr("x", (d, i) => {
			return (i * 60);
		})
		.attr("y", 20)
		.attr("height", (d, i) => {
			return y(d.height);
		})
		.attr("width", (d, i) => {
			return 40;
		})
		.attr("fill", (data) => {
			return 'black';
		});
})