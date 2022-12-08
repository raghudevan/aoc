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
  return assert(testResult, 21);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let grid = [];
  for (let line of input) {
    grid.push(line.split("").map((c) => _.toInteger(c)));
  }
  let visibleCount = grid.length * 2 + (grid[0].length - 2) * 2;
  console.log(grid, visibleCount);

  let xmax = grid.length - 1;
  let ymax = grid[0].length - 1;
  for (let x = 1; x < xmax; x++) {
    for (let y = 1; y < ymax; y++) {
      //console.log(x, y, grid[x][y]);
      if (topDown(grid, x, y)) {
        // visible from the top down
        visibleCount++;
        continue;
      }

      if (bottomUp(grid, x, y)) {
        // visible from the bottom up
        visibleCount++;
        continue;
      }

      if (leftRight(grid, x, y)) {
        // visible from the left to right
        visibleCount++;
        continue;
      }

      if (rightLeft(grid, x, y)) {
        visibleCount++;
        continue;
      }
    }
  }

  return visibleCount;
}

function topDown(grid, xmax, y) {
  let tree = grid[xmax][y];
  for (let x = 0; x < xmax; x++) {
    let challengerTree = grid[x][y];
    if (challengerTree >= tree) {
      return false;
    }
  }
  return true;
}

function bottomUp(grid, xmax, y) {
  let tree = grid[xmax][y];
  for (let x = xmax + 1; x < grid.length; x++) {
    let challengerTree = grid[x][y];
    if (challengerTree >= tree) {
      return false;
    }
  }
  return true;
}

function leftRight(grid, x, ymax) {
  let tree = grid[x][ymax];
  for (let y = 0; y < ymax; y++) {
    let challengerTree = grid[x][y];
    if (challengerTree >= tree) {
      return false;
    }
  }
  return true;
}

function rightLeft(grid, x, ymax) {
  let tree = grid[x][ymax];
  for (let y = ymax + 1; y < grid[0].length; y++) {
    let challengerTree = grid[x][y];
    if (challengerTree >= tree) {
      return false;
    }
  }
  return true;
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
