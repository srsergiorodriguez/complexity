function setCanvas() {
	setupContainer.remove();
	canvasContainer = select('#canvas_container');
	canvasContainer.style('width',w+'px');
	canvasContainer.style('height',h+'px');
	canvasContainer.style('border','solid 1px');
	cnv = createCanvas(w,h);
	cnv.parent(canvasContainer);
}

function grid() {
	strokeWeight(1);
	stroke(0);
	noFill();
	for (let i=0;i<n;i++) {
		line(u*i,0,u*i,h);
	}
	for (let i=0;i<h/u;i++) {
		line(0,u*i,w,u*i);
	}

}