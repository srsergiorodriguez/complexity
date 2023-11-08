function stringToArray_R(str_) {
	let tempArray = [];
	for (let i=str_.length-1;i>=0;i--) {
		let temp = int(str_.substr(i,1));
		tempArray.push(temp);
	}
	return tempArray
}

function remZeros(str_,len_) {
	let zeros = '';
	for (let i=0;i<len_-str_.length;i++) {
		zeros+='0';
	}
	zeros+=str_;
	return zeros
}

function saveImage() {
	// Saves the image in the computer to a png file
	saveCanvas("CA"+parseInt(rule,2)+"_"+n+"_"+k,'png');
}