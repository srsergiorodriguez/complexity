function spacetimeInfo() {
	let b = pow(v,k);
	let s = pow(v,b);

	infoContainer = select('#info_container');
	infoContainer.style('width',w+'px');
	infoContainer.style('border','solid 1px');

	let info = [];
	let infoTxt = ['network size (n): '+n,
					'neighborhood (k): '+k,
					// 'seed: '+seed+' ('+parseInt(seed,2)+')',
					'seed: ('+parseInt(seed,2)+')',
					'rule: '+rule+ ' => '+parseInt(rule,2)+' / '+s

	];
	
	for (let i=0;i<4;i++) {
		info[i] = createP(infoTxt[i]);
		info[i].parent(infoContainer);
	}
}

function spacetimeMenu() {
	menuContainer = select('#menu_container');
	menuContainer.style('width',w+'px');
	menuContainer.style('border','solid 1px');
	mainBtn = createButton("main");
	mainBtn.parent(menuContainer);
	mainBtn.mouseClicked(()=>{location.reload()});
	saveImg = createButton("save image");
	saveImg.parent(menuContainer);
	saveImg.mouseClicked(saveImage);
}

function spacetime() {
	// Generate a space time pattern
	spacetimeInfo();
	spacetimeMenu();
	setCanvas();
	let lookup = lookupCombinations();
	let ruleA = stringToArray_R(rule);

	let nextNetwork = [];
	u = w/n;
	let t = h/u;
	let networks = [];
	for (let i=0;i<t;i++) {
		networks.push(network);
		displayLattice(i);
		for (let j=0;j<n;j++) {
			let ks = neighborhood(network,j);
			ks = parseInt(ks,2);
			let rul = ruleA[ks];
			nextNetwork[j]=rul;
		}
		for (let i=0;i<network.length;i++) {
			network[i]=nextNetwork[i];
		}
	}
	if (checkGrid.checked()) {grid()}
}

function displayLattice(i_) {
	for (let j=0;j<n;j++) {
		noStroke();
		if (network[j]==1) {
			// colorMode(HSB);
			// fill(floor(random(255)),100,100);
			fill(0);
		} else {
			fill(255);
		}
		rect(u*j,u*i_,u,u);
	}
}