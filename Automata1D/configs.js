function configST() {
	setupContainer = select('#setup_container');
	infoConfig = createP('Automata Setup');
	infoConfig.parent(setupContainer);
	kInput = createInput('Neigborhood size (k)');
	kInput.parent(setupContainer);
	nInput = createInput('Network size (n)');
	nInput.parent(setupContainer);
	ruleInput = createInput(ruleTxt);
	ruleInput.parent(setupContainer);
	seedInput = createInput(seedTxt);
	seedInput.parent(setupContainer);
	checkGrid = createCheckbox("Grid?",false);
	checkGrid.parent(setupContainer);
	let startBtn = createButton("Start");
	startBtn.parent(setupContainer);
	startBtn.mousePressed(settingsST);
}

function settingsST() {
	setK();
	setN();
	setSeed();
	setRule();
	if (valid) {
		infoConfig.html("Valid Setup");
		spacetime();
	} else {
		infoConfig.html("Invalid Setup");
	}
}

function setK() {
	if (kInput.value()>0 && kInput.value()<7) {
		k = int(kInput.value());
	}
}

function setN() {
	if (nInput.value()>=k && nInput.value()<w/2) {
		n = nInput.value();
	}
}

function setSeed() {
	if (seedInput.value()=="B" || seedInput.value() == seedTxt) {
		for (let i=0;i<n;i++) {
			if (i==floor(n/2)) {
				seed+=1;
			} else {
				seed+=0;
			}
		}
	} else if (seedInput.value()=="R") {
		for (let i=0;i<n;i++) {
			seed+=floor(random(2));
		}
	} else if (seedInput.value().length==n) {
		for (let i=0;i<n;i++) {
			if (seedInput.value().substr(i,1)!=1) {
				if (seedInput.value().substr(i,1)!=0) {
					valid = false;
					console.log('invalid seed values');
				}
			}
		}
		if (valid) {
			seed = seedInput.value();
		}
	} else {
		valid = false;
	}

	if (valid) {
		for (let i=0;i<n;i++) {
			network[i] = int(seed.substr(i,1));
		}
	}
}

function setRule() {
	let b = pow(v,k); // number of bits of rule results
	let s = pow(v,b); // number of possible rules

	if (ruleInput.value()=="R" || ruleInput.value() == ruleTxt) {
		let ruledec = floor(random(s));
		rule = ruledec.toString(2);
		rule = remZeros(rule,b);
	} else if (int(ruleInput.value())<s) {
		rule = int(ruleInput.value()).toString(2);
		rule = remZeros(rule,b);
	} else {
		valid = false;
		console.log('invalid rule');
	}
}