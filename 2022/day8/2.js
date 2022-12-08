import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day8/puzzle.in";
const testFilePath = "2022/day8/test.in";

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
  return assert(testResult, 8);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let grid = [];
  for (let line of input) {
    grid.push(line.split("").map((c) => _.toInteger(c)));
  }

  console.log(grid);

  let xmax = grid.length;
  let ymax = grid[0].length;
  let maxScenicScore = 0;
  for (let x = 0; x < xmax; x++) {
    for (let y = 0; y < ymax; y++) {
      let upDist = up(grid, x, y);
      let downDist = down(grid, x, y);
      let leftDist = left(grid, x, y);
      let rightDist = right(grid, x, y);
      let score = upDist * downDist * leftDist * rightDist;

      console.log(
        `(${x}, ${y}) | ${grid[x][y]} | ${upDist}, ${downDist}, ${leftDist}, ${rightDist} | ${score}`
      );
      if (score > maxScenicScore) {
        maxScenicScore = score;
      }
    }
  }

  return maxScenicScore;
}

function up(grid, xmax, y) {
  let tree = grid[xmax][y];
  let distance = 0;

  if (xmax - 1 < 0) {
    return distance;
  }

  for (let x = xmax - 1; x >= 0; x--) {
    let challengerTree = grid[x][y];
    distance++;
    if (challengerTree >= tree) {
      break;
    }
  }
  return distance;
}

function down(grid, xmax, y) {
  let tree = grid[xmax][y];
  let distance = 0;

  if (xmax + 1 >= grid.length) {
    return distance;
  }

  for (let x = xmax + 1; x < grid.length; x++) {
    let challengerTree = grid[x][y];
    distance++;
    if (challengerTree >= tree) {
      break;
    }
  }
  return distance;
}

function left(grid, x, ymax) {
  let tree = grid[x][ymax];
  let distance = 0;

  if (ymax - 1 <= 0) {
    return distance;
  }

  for (let y = ymax - 1; y >= 0; y--) {
    let challengerTree = grid[x][y];
    distance++;
    if (challengerTree >= tree) {
      break;
    }
  }
  return distance;
}

function right(grid, x, ymax) {
  let tree = grid[x][ymax];
  let distance = 0;

  if (ymax + 1 >= grid[0].length) {
    return distance;
  }

  for (let y = ymax + 1; y < grid[0].length; y++) {
    let challengerTree = grid[x][y];
    distance++;
    if (challengerTree >= tree) {
      break;
    }
  }
  return distance;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  console.log(
    "todo; write core logic to solve the problem and invoke it from here"
  );
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
