const spaceData = [
  {
    designation: "419880 (2011 AH37)",
    discovery_date: "2011-01-07T00:00:00.000",
    h_mag: "19.7",
    moid_au: "0.035",
    q_au_1: "0.84",
    q_au_2: "4.26",
    period_yr: "4.06",
    i_deg: "9.65",
    pha: "Y",
    orbit_class: "Apollo",
  },
  {
    designation: "419624 (2010 SO16)",
    discovery_date: "2010-09-17T00:00:00.000",
    h_mag: "20.5",
    moid_au: "0.028",
    q_au_1: "0.93",
    q_au_2: "1.08",
    period_yr: "1",
    i_deg: "14.52",
    pha: "Y",
    orbit_class: "Apollo",
  },
  {
    designation: "414772 (2010 OC103)",
    discovery_date: "2010-07-28T00:00:00.000",
    h_mag: "19",
    moid_au: "0.333",
    q_au_1: "0.39",
    q_au_2: "2",
    period_yr: "1.31",
    i_deg: "23.11",
    pha: "N",
    orbit_class: "Apollo",
  },
  {
    designation: "414746 (2010 EH20)",
    discovery_date: "2010-03-06T00:00:00.000",
    h_mag: "18",
    moid_au: "0.268",
    q_au_1: "1.25",
    q_au_2: "3.99",
    period_yr: "4.24",
    i_deg: "23.89",
    pha: "N",
    orbit_class: "Amor",
  },
  {
    designation: "407324 (2010 OB101)",
    discovery_date: "2010-07-18T00:00:00.000",
    h_mag: "20.7",
    moid_au: "0.111",
    q_au_1: "0.77",
    q_au_2: "2.46",
    period_yr: "2.06",
    i_deg: "9.12",
    pha: "N",
    orbit_class: "Apollo",
  },
  {
    designation: "398188 (2010 LE15)",
    discovery_date: "2010-06-03T00:00:00.000",
    h_mag: "19.5",
    moid_au: "0.024",
    q_au_1: "0.63",
    q_au_2: "1.1",
    period_yr: "0.8",
    i_deg: "13.25",
    pha: "Y",
    orbit_class: "Aten",
  },
  {
    designation: "395207 (2010 HQ80)",
    discovery_date: "2010-04-25T00:00:00.000",
    h_mag: "19.6",
    moid_au: "0.007",
    q_au_1: "0.8",
    q_au_2: "2.34",
    period_yr: "1.96",
    i_deg: "27.85",
    pha: "Y",
    orbit_class: "Apollo",
  },
  {
    designation: "386847 (2010 LR33)",
    discovery_date: "2010-06-06T00:00:00.000",
    h_mag: "18",
    moid_au: "0.029",
    q_au_1: "0.91",
    q_au_2: "2.48",
    period_yr: "2.2",
    i_deg: "5.84",
    pha: "Y",
    orbit_class: "Apollo",
  },
  {
    designation: "381989 (2010 HR80)",
    discovery_date: "2010-04-28T00:00:00.000",
    h_mag: "19.9",
    moid_au: "0.104",
    q_au_1: "0.68",
    q_au_2: "2.02",
    period_yr: "1.56",
    i_deg: "26.71",
    pha: "N",
    orbit_class: "Apollo",
  },
]; // currently not showing DUPLICATES

//////////////////// Bar
//gets the year out of the discovery_date field
spaceData.forEach((a) => {
  a.discovery_date = a.discovery_date.substr(0, 4);
});

console.log(spaceData);

const BAR_MARGINS = { top: 30, bottom: 10 };
const CHART_WIDTH = 800;
const CHART_HEIGHT = 600 - BAR_MARGINS.top - BAR_MARGINS.bottom;

//x: Designation
//y: period year
//create xScale
const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const chartContainer = d3
  .select("svg")
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT + BAR_MARGINS.top + BAR_MARGINS.bottom);

// used for change
let selectedData = spaceData;

// 'd' represents one json here
x.domain(spaceData.map((d) => d.designation));

//FIX DOMAIN
// y.domain([0, d3.max(spaceData, (d) => d.period_yr + 1)]); // 3 is just extra room on the top
y.domain([0, d3.max(spaceData, (d) => 5)]); // 3 is just extra room on the top

const chart = chartContainer.append("g");

chart

  // vertical axis
  .append("g")
  .call(d3.axisLeft(y))
  .attr("color", "red")

  // horizontal axis
  .append("g")
  .call(d3.axisBottom(x).tickSizeOuter(0)) // tickSizeOuter(0) gets rid of the ticks at the beginning of the axis
  .attr("transform", `translate(0, ${CHART_HEIGHT})`) // add 0 to the x direction, add CHART_HEIGHT value to the y direction
  // the names will show up under ( in the margins section)
  .attr("color", "red");

function renderChart() {
  //displaying bars and labels
  chart
    .selectAll(".bar")
    .data(selectedData, (data) => data.designation) // "data =>data.designation" is used to help identify the identifier ( the id) as opposed to using the index
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", x.bandwidth())
    .attr("height", (data) => CHART_HEIGHT - y(data.period_yr))
    .attr("x", (data) => x(data.designation))
    .attr("y", (data) => y(data.period_yr));

  // removing a bar
  chart
    .selectAll(".bar")
    .data(selectedData, (data) => data.designation)
    .exit()
    .remove();

  // displaying labels
  chart
    .selectAll(".label")
    .data(selectedData, (data) => data.designation)
    .enter()
    .append("text")
    .text((data) => data.period_yr)
    .attr("x", (data) => x(data.designation) + x.bandwidth() / 2) // we add x.bandwidth/2 so that the text close to the  mid point of the bar ( one number off )
    .attr("y", (data) => y(data.period_yr) - 10)
    .attr("text-anchor", "middle") //sets your bar in the middle ( accounting for the second digit)
    .classed("label", true);

  // removing labels
  chart
    .selectAll(".label")
    .data(selectedData, (data) => data.designation)
    .exit()
    .remove();
}

renderChart();

const PARAMS = {
  onlyPHA: false,

  maxHMAG: 25,

  onlyYear: "N/A",

  OrbitClass: "All",
};
const panePHA = new Tweakpane.Pane({
  // puts pane in a container
  container: document.querySelector("#data"),
});

panePHA.addInput(PARAMS, "onlyPHA");

// ev.value is " either true or false here"
// panePHA.on('change', ev =>console.log(ev.value))
panePHA.on("change", (pha) => {
  // console.log(ev.value)
  // if ev is true, if we events that are not pha, add events where pha = Y to unselectedData
  let filterData = [];
  if (pha.value == true) {
    selectedData.forEach((d) => {
      if (d.pha === "Y") {
        filterData.push(d);
      }
    });
    selectedData = filterData;
    console.log(selectedData);
  }
  // if ev is false, then make sure everything loads
  else {
    // ev.value == false
    // sets the data back to it's normal state

    selectedData = spaceData;
  }
  renderChart();
});

const hMagPane = new Tweakpane.Pane({
  container: document.querySelector("#data"),
});

hMagPane.addInput(PARAMS, "maxHMAG", {
  step: 0.1,
  min: 16.2,
  max: 24.3,
});

hMagPane.on("change", (hMag) => {
  //reset data everytime you use this function
  selectedData = spaceData;

  selectedData = selectedData.filter((d) => d.h_mag <= hMag.value);
  // selectedData.forEach(d =>{
  //     if(d.h_mag <= hMag.value){
  //         filterData.push(d);
  //     }
  // })
  // selectedData = filterData;

  renderChart();
});

const yearPane = new Tweakpane.Pane({
  container: document.querySelector("#data"),
});

yearPane.addInput(PARAMS, "onlyYear", {
  options: {
    NA: "N/A",
    2010: "2010",
    2011: "2011",
    2012: "2012",
    2013: "2013",
    2014: "2014",
    2015: "2015",
  },
});

yearPane.on("change", (year) => {
  console.log(year.value);
  // restart data each time this function is used
  selectedData = spaceData;
  if (year.value != "N/A") {
    selectedData = selectedData.filter((d) => d.discovery_date == year.value);
  } else {
    selectedData = spaceData;
  }

  renderChart();
});

const orbitPane = new Tweakpane.Pane({
  container: document.querySelector("#data"),
});

orbitPane.addInput(PARAMS, "OrbitClass", {
  options: {
    All: "All",
    Apollo: "Apollo",
    Amor: "Amor",
    Aten: "Aten",
    Comet: "Comet",
    JupiterFamilyComet: "Jupiter-family Comet",
    HalleyTypeComet: "Halley-type Comet*",
  },
});
orbitPane.on("change", (orbit) => {
  // restart data each time this function is used
  selectedData = spaceData;
  if (orbit.value != "All") {
    selectedData = selectedData.filter((d) => d.orbit_class == orbit.value);
  } else {
    selectedData = spaceData;
  }
  renderChart();
});

const restartPane = new Tweakpane.Pane({
  container: document.querySelector("#data"),
});

const btn = restartPane.addButton({
  title: "restart",
});

btn.on("click", () => {
  selectedData = spaceData;
  renderChart();
});

/////////////// scatterplot

// const CIRCLE_MARGINS = { top: 30, bottom: 10 };
// const CIRCLE_CHART_WIDTH = 800;
// const CIRCLE_CHART_HEIGHT = 600 - CIRCLE_MARGINS.top - CIRCLE_MARGINS.bottom;

// const radius = Math.min(CIRCLE_CHART_WIDTH,CIRCLE_CHART_HEIGHT)/2 - CIRCLE_MARGINS
// const chartContainerCircle = d3
//         .select("#chartCircle")
//         .select(svg)
//         .attr("width", CIRCLE_CHART_WIDTH)
//         .attr("height", CIRCLE_CHART_HEIGHT + CIRCLE_MARGINS.top + CIRCLE_MARGINS.bottom)

// // put the circle in the middle of the container
// chartCircle = chartContainerCircle
// .append("g")
// .attr("transform", "translate(" + CIRCLE_CHART_WIDTH / 2 + "," + CIRCLE_CHART_HEIGHT / 2 + ")");

// //

// // set the color scale
// const color = d3.scaleOrdinal()
// .domain(["Y","N"])
// .range(d3.schemeDark2)

// function renderChartCircle(){

// // make position for each group on the pie

// const pie = d3.pie()
//     .value(d => d.pha)
//     // make sure values are in order from smallest to largest
//     .sort(a,b => d3.ascending(a.pha,b.pha))

// // we are still using selectedData
// const data_ready = pie(d3.entries(selectedData))

// // map circle to the data?
// const u = chartCircle.selectAll("path")
//     .data(data_ready)

// //Build the pie chart: one arc at a time
// .enter()
// .append('path')
// .merge(u)
// .transition()
// .duration(1000)
// .attr('d', d3.arc()
//   .innerRadius(0)
//   .outerRadius(radius)
// )
// .attr('fill', d => color(d.pha))
// .attr("stroke", "white")
//     .style("stroke-width", "2px")
//     .style("opacity", 1)

//  // remove the group that is not present anymore
//  u
//  .exit()
//  .remove()

// }

// renderChartCircle()

const data = [2, 4, 8, 10, 14, 20];
const CIRCLE_MARGINS = { top: 30, bottom: 10 },
  CIRCLE_CHART_WIDTH = 800,
  CIRCLE_CHART_HEIGHT = 600 - CIRCLE_MARGINS.top - CIRCLE_MARGINS.bottom;

const radius = Math.min(CIRCLE_CHART_WIDTH, CIRCLE_CHART_HEIGHT) / 2;

const chartContainerCircle = d3.select("#CircleSvg");
chartContainerCircle.attr("width", CIRCLE_CHART_WIDTH).attr("height", CIRCLE_CHART_HEIGHT);

const chartCircle = chartContainerCircle
    .append("g")
    .attr('transform', `translate(${CIRCLE_CHART_WIDTH/2},${CIRCLE_CHART_HEIGHT/2})`)


const color = d3.scaleOrdinal(['red','orange','yellow','green','blue','purple']) // change this
const pie = d3.pie()
const arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius);
// const arcs = chartCircle

function renderChartCircle(){
    chartCircle
    .selectAll('arc')
    .data(pie(data)) // change this
    .enter()
    .append('g')
    .attr('class', 'arc')
    .append('path') // change this
    .attr('fill', (d,i) => color(i))
    .attr('d', arc);
}
renderChartCircle()
