// DOM
let setupContainer;
let ruleTxt = 'Rule (rcode)'
let seedTxt = 'Seed';
let canvasContainer;
let infoContainer;
let cnv;

// Space-time pattern display settings
let w = 500; // width
let h = w*10; // height
let u; // size of square cell

// Attractor basin display settings

// Attractor basin landscape display settings

// Celular automata configuration
let valid = true;
let network = []; // network of cells
let v = 2; // valid values in cell
let n = 50; // network size
let k = 3; // neighborhood size
let rule; // rcode for system rules
let seed = ''; // initial seed (for SEED mode)

function setup() {
	configST();
}
