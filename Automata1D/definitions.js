function neighborhood(network_,i_) {
	let tempk = "";
	let tempi = "";
	let half = floor(k/2);
	start = i_-half;
	for (let i=start;i<k+start;i++) {
		let index;
		if (i<0) {
			index = n-i*-1;
		} else if (i>n-1) {
			index = abs(i-n); 
		} else {
			index = i;
		}
		tempk+=network_[index];
	}
	return tempk
}

function lookupCombinations() {
	let b = pow(v,k);
	let combinations = [];
	let comb2 = [];
	for (let i=0;i<b;i++) {
		let templ = remZeros(i.toString(2),k);
		// 	templ+=floor((i/(b/pow(2,j+1)))%2); // Hace lo mismo si se hace un loop con Kindex
		combinations[i] = templ;
	}
	return combinations;
}