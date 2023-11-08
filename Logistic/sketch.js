let R = 2;
let X = 0.5;
const maxR = 4;
const maxX = 1;
const step = 0.001;


// Graphs
let cnv;
const cnvW = 500;
const cnvH = 500;
const graphS = 500;
let plot = 'time domain plot';

let jumpgraph;
let returngraph;
let timegraph;
let bifurcationgraph;


//DOM
let RSlider;
let RP;
let XSlider;
let Xp;
let plotSelect;

function setup() {

	controls();

	cnv = createCanvas(cnvW,cnvH);
	adjustContainer();

	jumpgraph = createGraphics(graphS,graphS);
	timegraph = createGraphics(graphS,graphS);
	returngraph = createGraphics(graphS,graphS);
	bifurcationgraph = createGraphics(graphS,graphS);
}

function controls() {
	let controlsContainer = select("#controls_container");

	RSlider = createSlider(0,4,2,step);
	RSlider.class('slider_opt');
	RSlider.parent(controlsContainer);
	RSlider.input(sliderChange);

	RP = createP('R = '+R);
	RP.parent(controlsContainer);

	XSlider = createSlider(0,1,0.5,step);
	XSlider.class('slider_opt');
	XSlider.parent(controlsContainer);
	XSlider.input(sliderChange);

	XP = createP('X = '+X);
	XP.parent(controlsContainer);

	plotSelect = createSelect();
	plotSelect.parent(controlsContainer);
	plotSelect.option('time domain plot');
	plotSelect.option('jump plot');
	plotSelect.option('return plot');
	plotSelect.option('bifurcation plot');
	plotSelect.changed(selectPlot);

	GoBtn = createButton("Go");
	GoBtn.parent(controlsContainer);
	GoBtn.mouseClicked(go);
}

function adjustContainer() {
	let cnvContainer = select("#canvas_container");
	cnv.parent(cnvContainer);
	cnvContainer.style('width',cnvW+'px');
	cnvContainer.style('height',cnvH+'px');
}

function selectPlot() {
	plot = plotSelect.value();
}

function sliderChange() {
	RP.html('R = '+RSlider.value());
	XP.html('X = '+XSlider.value());
}

function calcPop(r,x) {
	let nextX = r * x * (1 - x);
	return nextX
}

function go() {
	R = RSlider.value();
	X = XSlider.value();
	if (plot == 'time domain plot') {
		timeGraphPlot();
	} else if (plot == 'jump plot') {
		jumpGraphPlot();
	} else if (plot == 'return plot') {
		returnGraphPlot();
	} else if (plot == 'bifurcation plot') {
		bifurcationGraphPlot();
	}
}

function timeGraphPlot() {
	timegraph.background(255);
	let tempX = X;
	let time = 100;
	for (let i=0;i<time;i++) {
		let x = map(i,0,time,5,graphS);
		let y = map(calcPop(R,tempX),0,1,graphS,0);
		timegraph.fill(100,100,255);
		timegraph.ellipse(x,y,5,5);
		tempX = calcPop(R,tempX);
	}
	image(timegraph,0,0);
}

function jumpGraphPlot() {
	jumpgraph.background(255);
	for (let i=0;i<maxX;i+=step) {
		let x = map(i,0,1,0,graphS);
		let y = map(calcPop(R,i),0,1,graphS,0);
		jumpgraph.point(x,y);
	}
	let x = map(X,0,1,0,graphS);
	let y = map(calcPop(R,X),0,1,graphS,0);
	jumpgraph.fill(255,0,0);
	jumpgraph.ellipse(x,y,10,10);
	image(jumpgraph,0,0);
	X = calcPop(R,X);
	XSlider.value(X);
	sliderChange();
}

function returnGraphPlot() {
	returngraph.background(255);
	returngraph.stroke(0);
	for (let i=0;i<maxX;i+=step) {
		let x = map(i,0,1,0,graphS);
		let y = map(calcPop(R,i),0,1,graphS,0);
		returngraph.point(x,y);
	}
	returngraph.strokeWeight(0.5);
	returngraph.line(0,graphS,graphS,0);

	let trayectory = [];
	let time = 50;
	let tempX = X;
	trayectory[0] = [tempX,calcPop(R,tempX)];
	for (let i=0;i<time-1;i++) {
		let nextX = calcPop(R,tempX)
		let val1 = [nextX,nextX];
		trayectory.push(val1);
		let val2 = [nextX,calcPop(R,nextX)];
		trayectory.push(val2);
		tempX = nextX;
	}
	returngraph.strokeWeight(1);
	returngraph.stroke(255,0,0);
	returngraph.noFill();
	returngraph.beginShape();
	for (let i=0;i<time;i++) {
		let x = map(trayectory[i][0],0,1,0,graphS);
		let y = map(trayectory[i][1],0,1,graphS,0);
		returngraph.vertex(x,y);
	}
	returngraph.endShape();
	image(returngraph,0,0);
}

function bifurcationGraphPlot() {
	bifurcationgraph.background(255);
	let tempX = X;
	let RStart = 2;
	let time = 100;
	let prune = 70;
	let attractors = [];
	for (let r=RStart;r<maxR;r+=step) {
		let tempAttractors = [];
		for (let i=0;i<time;i++) {
			if (i>=prune) {
				tempAttractors.push(tempX);
			}
			tempX = calcPop(r,tempX);
		}
		attractors.push(tempAttractors);
	}
	for (let i=0;i<attractors.length;i++) {
		for (let j=0;j<attractors[i].length;j++) {
			let x = map(i,0,attractors.length,0,graphS);
			let y = map(attractors[i][j],0,1,graphS/2,0);
			bifurcationgraph.stroke(0);
			bifurcationgraph.point(x,y);
		}
	}
	let rx = map(R,RStart,maxR,0,graphS);
	bifurcationgraph.stroke(255,0,0);
	bifurcationgraph.line(rx,0,rx,graphS/2);
	image(bifurcationgraph,0,0);
}