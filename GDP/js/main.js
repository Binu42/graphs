let margin = { left: 80, right: 20, top: 50, bottom: 100 };
let height = 500 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right;

let continents = ["europe", "americas", "asia", "africa"];

let g = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left +
		", " + margin.top + ")");


let continentColor = d3.scaleOrdinal(["#772eff", "#32e0c4", "#ff414d", "#ff9a76"]);

let legend = g.append("g")
	.attr("transform", "translate(" + (width) + "," + (height - 300) + ")");

continents.forEach((value, index) => {
	let legendRow = legend.append("g")
		.attr("transform", "translate(0, " + (index * 20) + ")");


	legendRow.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", continentColor(value));



	legendRow.append("text")
		.attr("x", -10)
		.attr("y", 10)
		.attr("text-anchor", "end")
		.style("text-transform", "capitalize")
		.text(value)
});

let time = 0;

// Scales
let x = d3.scaleLog()
	.base(10)
	.range([0, width])
	.domain([142, 150000]);

let y = d3.scaleLinear()
	.range([height, 0])
	.domain([0, 90]);

let area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);

// Labels
let xLabel = g.append("text")
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");

let yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expectancy (Years)");

let timeLabel = g.append("text")
	.attr("y", height - 10)
	.attr("x", width - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.3")
	.attr("text-anchor", "middle")
	.text("1800");

// X Axis
let xAxisCall = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));
g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxisCall);

// Y Axis
let yAxisCall = d3.axisLeft(y)
	.tickFormat((d) => +d);
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall);


d3.json("data/data.json").then((data) => {
	// Clean data
	const formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
			let dataExists = (country.income && country.life_exp);
			return dataExists
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	let interval;

	document.querySelector("#step-back").addEventListener("click", () => {
		time -= 1;
		document.querySelector("#year").innerHTML = 1800 + time;
		update(formattedData[time]);
	});


	document.querySelector("#step-forward").addEventListener("click", () => {
		time += 1;
		document.querySelector("#year").innerHTML = 1800 + time;
		update(formattedData[time]);
	});

	let timeInterval = 100;
	document.getElementById("interval-input").addEventListener("change", (e => {
		timeInterval = e.target.value;
		clearInterval(interval);
		if (interval._time)
			interval.stop();
		interval = setInterval(() => {
			// At the end of our data, loop back
			time = (time < 214) ? time + 1 : 0
			document.querySelector("#year").innerHTML = 1800 + time;
			update(formattedData[time]);
		}, timeInterval);
	}));

	document.querySelector("#play").addEventListener("click", (event) => {
		document.querySelector("#pause").removeAttribute("disabled");
		event.target.setAttribute("disabled", "");
		interval = setInterval(() => {
			// At the end of our data, loop back
			time = (time < 214) ? time + 1 : 0
			document.querySelector("#year").innerHTML = 1800 + time;
			update(formattedData[time]);
		}, timeInterval);
	});

	document.querySelector("#pause").addEventListener("click", (event) => {
		document.querySelector("#play").removeAttribute("disabled");
		event.target.setAttribute("disabled", "");
		clearInterval(interval);
		if (interval._time)
			interval.stop();
	});

	// Run the code every 0.1 second
	interval = d3.interval(() => {
		// loop back
		time = (time < 214) ? time + 1 : 0;
		document.querySelector("#year").innerHTML = 1800 + time;
		update(formattedData[time]);
	}, timeInterval);

	// First run of the visualization
	update(formattedData[0]);

})

const update = (data) => {
	// Standard transition time for the visualization
	let t = d3.transition()
		.duration(100);

	// JOIN new data with old elements.
	let circles = g.selectAll("circle").data(data, (d) => d.country);

	// EXIT old elements not present in new data.
	circles.exit()
		.attr("class", "exit")
		.remove();

	// ENTER new elements present in new data.
	circles.enter()
		.append("circle")
		.attr("class", "enter")
		.attr("fill", (d) => continentColor(d.continent))
		.merge(circles)
		.transition(t)
		.attr("cy", (d) => y(d.life_exp))
		.attr("cx", (d) => x(d.income))
		.attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

	// Update the time label
	timeLabel.text(+(time + 1800))
}