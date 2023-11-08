const unit = 30;
const unitNr = 25;
const size = unit * unitNr;
let states = [];
let bonds = [];

const pd = 0.025; // Adjustable disintegration

// 0 = hole; 1 = S; 2 = K * ; 3 = L; 4 = BL;


/// INFINITE WORLD ????? 

let debugSpan;
let looping = false;

const rules = [
  {
    // 0 -> Holes
    inmovable: [0, 2],
    displaceable: [],
    jumpable: [3, 4],
    landable: [1]
  }, {
    // 1 -> Substrate
    inmovable: [1, 2],
    displaceable: [],
    jumpable: [3, 4],
    landable: [0]
  }, {
    // 2 -> Catalyst K
    inmovable: [2, 4],
    displaceable: [1, 3],
    jumpable: [],
    landable: []
  }, {
    // 3 -> Link L
    inmovable: [2, 3, 4],
    displaceable: [1],
    jumpable: [],
    landable: []
  }, {
    // 4 -> Linked Bond LB
    inmovable: [1, 2, 3, 4],
    displaceable: [],
    jumpable: [],
    landable: []
  }
]

function setup() {
  createCanvas(size, size);
  frameRate(6);

  createButton("setInitialConditions").mouseClicked(setInitial);
  createButton("loop").mouseClicked(() => {looping = !looping});
  debugSpan = createSpan(" ---- HOLA");

  setInitial();
}

function setInitial() {
  looping = false;
  // SET ALL INITIAL STATES TO SUBSTRATES S
  for (let y = 0; y < unitNr; y++) {
    states[y] = [];
    bonds[y] = [];
    for (let x = 0; x < unitNr; x++) {
      states[y][x] = 1;
      bonds[y][x] = [];
    }
  }

  const middle = floor(unitNr / 2);
  states[middle][middle] = 2; // CATALYST K

  // const catalystsNr = 4;
  // for (let i = 0; i < catalystsNr; i++) {
  //   states[floor(random(unitNr))][floor(random(unitNr))] = 2; // CATALYST K
  // }
  drawStates();
}

function draw() {
  if (looping) {
    allSteps();
  }
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    const x = floor(mouseX/unit);
    const y = floor(mouseY/unit);
    debugSpan.html(` ---- ${y} / ${x} -> ${states[y][x]} : ${bonds[y][x]} `)
  }
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    allSteps();
  }
}

function allSteps() {
  firstStep();
  secondStep();
  thirdStep();
  production();
  disintegration();
  bonding();
  rebond();
  drawStates();
}

function drawStates() {
  background(255);

  // stroke(200);
  // for (let i = 0; i < unitNr + 1; i++) {
  //   line(0, i * unit, width, i * unit);
  //   line(i * unit, 0, i * unit, height);
  // }


  for (let y = 0; y < unitNr; y++) {
    for (let x = 0; x < unitNr; x++) {
      stroke(0);
      if (states[y][x] === 1) {
        fill(255);
        ellipse((x * unit) + (unit/2), (y * unit) + (unit/2), unit * 0.6);
      } else if (states[y][x] === 2) {
        fill(0);
        // STAR
        star((x * unit) + (unit/2),(y * unit) + (unit/2))
        //triangle((x * unit) + (unit * 0.2), (y * unit) + (unit * 0.8), (x * unit) + (unit * 0.8), (y * unit) + (unit * 0.8), (x * unit) + (unit * 0.5), (y * unit) + (unit * 0.2));
      } else if (states[y][x] === 3) {
        fill(255);
        rect(x * unit, y * unit, unit, unit);
        ellipse((x * unit) + (unit/2), (y * unit) + (unit/2), unit * 0.6);
      } else if (states[y][x] === 4) {
        fill(255);
        rect(x * unit, y * unit, unit, unit);
        fill(100);
        ellipse((x * unit) + (unit/2), (y * unit) + (unit/2), unit * 0.6);
        stroke(255, 0, 0);
      }

      // // INDEXES
      // if (x === 0) {
      //   noStroke();
      //   fill(0, 0, 255)
      //   text(y, (x * unit) + (unit/2), (y * unit) + (unit/2));
      // }
      // if (y === 0) {
      //   noStroke();
      //   fill(0, 0, 255)
      //   text(x, (x * unit) + (unit/2), (y * unit) + (unit/2));
      // }
      
    }
  }

  for (let y = 0; y < unitNr; y++) {
    for (let x = 0; x < unitNr; x++) {
      if (states[y][x] === 4) {
        for (bond of bonds[y][x]) {
          stroke(0);
          line((x * unit) + (unit/2), (y * unit) + (unit/2), (bond[1] * unit) + (unit/2), (bond[0] * unit) + (unit/2));
        }
      }
    }
  }
}

function firstStep() {
  const holes = getType(0);
  for (a of holes) {
    const [b, b_] = getRandomNeighbor(a);
    movement(a, b, b_);
  }
}

function secondStep() {
  const links = getType(3);
  for (a of links) {
    const [b, b_] = getRandomNeighbor(a);
    movement(a, b, b_);
  }
}

function thirdStep() {
  const catalysts = getType(2);
  for (let a of catalysts) {
    const [b, b_] = getRandomNeighbor(a);
    movement(a, b, b_);
  }
}

function production() {
  const catalysts = getType(2);
  for (let c of catalysts) {
    const pairs = getPairs(c);
    for (let p of pairs) {
      const [a, b] = shuffle(p);
      states[c[0] + a[0]][c[1] + a[1]] = 3; // NEW LINK
      states[c[0] + b[0]][c[1] + b[1]] = 0;
    }
  }
}

function disintegration() {
  const links = [...getType(3), ...getType(4)];
  for (let l of links) {
    const d = random();
    if (d < pd) {
      states[l[0]][l[1]] = 1;
      const newSpace = shuffle(getNeighbors(l).filter( d => states[d[0]][d[1]] === 0)).pop();
      if (newSpace !== undefined) {
        states[newSpace[0]][newSpace[1]] = 1;
      }

      // REMOVE BONDS
      for (let b of bonds[l[0]][l[1]]) {
        //bonds[b[0]][b[1]] = bonds[b[0]][b[1]].filter( d => d[0] !== l[0] && d[1] !== l[1]);
        bonds[b[0]][b[1]] = bonds[b[0]][b[1]].filter( d => states[d[0]][d[1]] === 4);
      }
      bonds[l[0]][l[1]] = [];
    }
  }
}

function bonding() {
  const links = getType(3);
  for (let l of links) {
    if (states[l[0]][l[1]] !== 3) { continue }
    const singleBonded = shuffle(getNeighbors(l).filter( d => bonds[d[0]][d[1]].length === 1 && states[d[0]][d[1]] === 4));
    for (let i = 0; i < min(singleBonded.length, 2); i++) {
      const newBond = singleBonded[i];

      states[newBond[0]][newBond[1]] = 4;
      states[l[0]][l[1]] = 4;

      bonds[newBond[0]][newBond[1]].push(l);
      bonds[l[0]][l[1]].push(newBond);
    }
    
    const free = shuffle(getNeighbors(l).filter( d => states[d[0]][d[1]] === 3));
    for (let i = 0; i < free.length; i++) {
      const newBond = free[i];

      states[newBond[0]][newBond[1]] = 4;
      states[l[0]][l[1]] = 4;

      bonds[newBond[0]][newBond[1]].push(l);
      bonds[l[0]][l[1]].push(newBond);
    }
  }
}

function rebond() {
  let single = getType(4).filter( d => bonds[d[0]][d[1]].length === 1 && getBondable(d).length > 0);
  while (single.length > 0) {
    for (let s of single) {
      const bondsS = bonds[s[0]][s[1]];
      if (bondsS > 1) { continue }

      const neighbors = getBondable(s);
      if (neighbors.length > 0) {
        const newBond = neighbors.sort((a, b) => bonds[b[0]][b[1]].length - bonds[a[0]][a[1]].length).pop();
        states[newBond[0]][newBond[1]] = 4;
    
        bonds[newBond[0]][newBond[1]].push(s);
        bonds[s[0]][s[1]].push(newBond);      
      }
    }
    single = getType(4).filter( d => bonds[d[0]][d[1]].length === 1 && getBondable(d).length > 0);
  }
}

function getBondable(pos) {
  const bondsS = bonds[pos[0]][pos[1]];
  const bondable = shuffle(getNeighbors(pos)).filter( d => {
    // Check if already bonded
    for (let i = 0; i < bondsS.length; i++) {
      if (bondsS[i][0] === d[0] && bondsS[i][1] === d[1]) {
        return false
      }
    }
    // Check if is bondable
    if (
      ((bonds[d[0]][d[1]].length === 1 && states[d[0]][d[1]] === 4) ||
      (states[d[0]][d[1]] === 3))
    ) {
      return true
    }
    return false
  });
  return bondable
}

function inBounds(pos) {
  if (pos[0] < 0 || pos[0] >= unitNr || pos[1] < 0 || pos[1] >= unitNr) {
    return false
  } else {
    return true
  }
}

function getNeighbors(pos) {
  //const nhs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  const nhs = [[-1, 0],[0, -1],[1, 0],[0, 1]];
  const neighbors = [];
  for (let i = 0; i < nhs.length; i++) {
    neighbors.push([pos[0] + nhs[i][0], pos[1] + nhs[i][1]]);
  }
  return neighbors.filter(d => inBounds(d));
}

function getRandomNeighbor(pos) {
  const nhs = [[-1, 0],[0, -1],[1, 0],[0, 1]];
  const selected = random(nhs);
  const neighbor = [[pos[0] + selected[0], pos[1] + selected[1]], [pos[0] + selected[0] + selected[0], pos[1] + selected[1] + selected[1]]];
  return neighbor
}

function getPairs(pos) {
  const pairs = [
    [[-1, -1], [0, -1]],
    [[0, -1], [1, -1]],
    [[-1, 1], [0, 1]],
    [[0, 1], [1, 1]],
    [[-1, -1], [-1, 0]],
    [[-1, 0], [-1, 1]],
    [[1, -1], [1, 0]],
    [[1, 0], [1, 1]]
  ];

  const possiblePairs = [];
  for (let pair of pairs) {
    let valid = true
    for (let p of pair) {
      const y = pos[0] + p[0];
      const x = pos[1] + p[1];
      if (!inBounds([x,y])) {
        valid = false
        break
      } else if (states[y][x] !== 1) {
        valid = false
        break
      }
    }
    if (valid) {
      possiblePairs.push(pair);
    }
  }
  return possiblePairs
}

function getType(type) {
  const list = [];
  for (let y = 0; y < unitNr; y++) {
    for (let x = 0; x < unitNr; x++) {
      if (states[y][x] === type) {
        list.push([y, x]);
      }
    }
  }
  return shuffle(list);
}

function movement(a, b, b_) {
  if (!inBounds(b)) {
  //if (b[0] < 0 || b[0] >= unitNr || b[1] < 0 || b[1] >= unitNr) {
    return
  }

  const stateA = states[a[0]][a[1]];
  const stateB = states[b[0]][b[1]];
  const rule = rules[stateA];
  
  if (rule.inmovable.includes(stateB)) {
    // DO NOTHING
    return
  } else if (rule.jumpable.includes(stateB)) {
    // JUMP
    if (inBounds(b_)) {
    //if (!(b_[0] < 0 || b_[0] >= unitNr || b_[1] < 0 || b_[1] >= unitNr)) {
      const stateB_ = states[b_[0]][b_[1]];
      if (rule.landable.includes(stateB_)) {
        [states[a[0]][a[1]], states[b_[0]][b_[1]]] = [states[b_[0]][b_[1]], states[a[0]][a[1]]] // Swap
      }
    }
  } else if (rule.displaceable.includes(stateB)) {
    // DISPLACE
    const [c, c_] = getRandomNeighbor(b);
    movement(b, c, c_);
    [states[a[0]][a[1]], states[b[0]][b[1]]] = [states[b[0]][b[1]], states[a[0]][a[1]]] // Swap
  } else {
    // OCCUPATE
    [states[a[0]][a[1]], states[b[0]][b[1]]] = [states[b[0]][b[1]], states[a[0]][a[1]]] // Swap
  }
}

function star(x, y) {
  let exrad = unit * 0.4;
  let inrad = unit * 0.2;
  angleMode(DEGREES);
  let divisions = 360.0 / 5;
  beginShape();
  for (let i=-90.0;i<270;i+=divisions) {
    let xpos = x + cos(i) * exrad;
    let ypos = y + sin(i) * exrad;
    vertex(xpos,ypos);
    xpos = x + cos(i+divisions/2) * inrad;
    ypos = y + sin(i+divisions/2) * inrad;
    vertex(xpos,ypos);
  }
  endShape();
}