const data = [25, 20, 35, 15];

const svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

const circles = svg.selectAll("circles").data(data);

circles.enter()
	.append("circle")
	.attr("cx", (d, i) => {
		return (i * 50) + 25;
	})
	.attr("cy", (d, i) => {
		return 25;
	})
	.attr("r", (d, i) => {
		return d;
	})
	.attr("fill", "blue");