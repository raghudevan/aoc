import _ from "lodash";
import { log, readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day14/puzzle.in";
const testFilePath = "2022/day14/test.in";

// 2. define how your assertions will run
function assert(output, expectedOutput) {
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  // console.log(testInput);
  const testResult = coreLogic(testInput);

  console.log("test results:", testResult);
  return assert(testResult, 93); // 93
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  // should track left,right,upper & lower bounds
  let grid = {
    upper: 0,
    lower: 0,
    left: Infinity,
    right: 0,
  };
  for (let line of input) {
    drawRocks(grid, line);
  }
  grid.lower += 2; // actual cave floor
  grid[`(0,500)`] = { item: "opening" };

  // log(grid, { depth: Infinity });

  let sandCount = 0;
  let sand = { row: 0, col: 500 };

  let moreSand = true;
  while (moreSand) {
    let { canSandMoveFurther, withinBounds } = moveSand(grid, sand);
    // log(sand);

    if (!withinBounds) {
      // sand has moved out of bounds, end
      moreSand = false;
    }

    if (!canSandMoveFurther) {
      // introduce new sand
      sand = { row: 0, col: 500 };
      sandCount++;
      // if (sandCount === 93) {
      //   moreSand = false;
      // }
    }
  }

  drawCave(grid);
  return sandCount;
}

let itemMap = { air: " ", rock: "#", sand: "o", opening: "+" };
function drawCave(grid) {
  let { upper, lower, left, right } = grid;
  let lines = "";
  for (let r = 0; r < lower - upper + 1; r++) {
    let line = "";
    for (let c = 0; c < right - left + 1; c++) {
      let cell = grid[`(${r},${c + left})`];
      if (r === lower - upper) {
        cell = { item: "rock" };
      }

      let item = _.get(cell, "item", "air");
      line += itemMap[item];
    }
    lines += `${line}\n`;
  }
  console.log(lines);
}

let dirs = [
  [1, 0],
  [1, -1],
  [1, 1],
]; // D, DL, DR
function moveSand(grid, sand) {
  // sand moves col + 1
  let { row, col } = sand;
  let possiblities = _.chain(dirs)
    .map((dir) => {
      let [dr, dc] = dir;
      return [row + dr, col + dc];
    })
    .reduce((p, c) => {
      let [row, col] = c;
      if (row !== grid.lower && !grid[`(${row},${col})`]) {
        p.push(c);
      }
      return p;
    }, [])
    .value();

  let canSandMoveFurther = true;
  if (possiblities.length > 0) {
    // move sand into first possibility
    sand.row = possiblities[0][0];
    sand.col = possiblities[0][1];
  } else {
    // no more possibilities, update grid w/ sand position
    grid[`(${sand.row},${sand.col})`] = { item: "sand" };
    canSandMoveFurther = false;
  }

  return { canSandMoveFurther, withinBounds: checkIfWithinBounds(grid, sand) };
}

function checkIfWithinBounds(grid, sand) {
  let { lower, left, right } = grid;
  let { row, col } = sand;

  // update left/right
  if (col < left) {
    grid.left = col;
  }
  if (col > right) {
    grid.right = col;
  }

  if (grid[`(0,500)`].item === "sand") {
    //console.log("sand at the opening!");
    return false;
  }

  if (row < lower) {
    return true;
  }

  return false;
}

function drawRocks(grid, line) {
  let coords = line.split(" -> ");
  coords.reduce((p, c) => {
    let [pc, pr] = p.split(",").map((co) => _.toInteger(co));
    let [cc, cr] = c.split(",").map((co) => _.toInteger(co));

    let lr = cr,
      ur = pr,
      lc = cc,
      uc = pc;
    if (pr < cr) {
      lr = pr;
      ur = cr;
    }

    if (pc < cc) {
      lc = pc;
      uc = cc;
    }

    let { lower, left, right } = grid;
    // update bounds
    if (lower < ur) {
      grid.lower = ur;
    }
    if (lc < left) {
      grid.left = lc;
    }
    if (right < uc) {
      grid.right = uc;
    }

    for (let r = lr; r <= ur; r++) {
      for (let c = lc; c <= uc; c++) {
        grid[`(${r},${c})`] = { item: "rock" };
      }
    }

    return c;
  });

  return grid;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
