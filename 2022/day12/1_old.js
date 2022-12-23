import _, { compact } from "lodash";
import { log, readInput, update } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day12/puzzle.in";
const testFilePath = "2022/day12/test.in";

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
  return assert(testResult, 32);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  // make grid
  let grid = [];
  let rowCount = 0;
  let S, E;
  for (let lines of input) {
    let row = lines.split("").map((val, index) => {
      let key = val;
      val = val.charCodeAt(0);

      if (key === "S") {
        val = 97;
        S = { key, val, row: rowCount, col: index };
      }
      if (key === "E") {
        val = 122;
        E = { key, val, row: rowCount, col: index };
      }

      return { key, val, row: rowCount, col: index };
    });

    grid.push(row);
    rowCount++;
  }

  // log(grid, { depth: 2 });
  log(S);
  log(E);

  // for each node, push node into path & push each dir into "possibilities" array
  // for each possibility, check if can navigate (else remove)
  // - if next step is valid (not out of bounds)
  // - if next step is not already on path
  // - if next step is < current step value
  // step into each valid possibility
  // when no possibility, return to parent
  // - what to return?
  let path = {};
  let minPath = parseGraph(grid, path, S, E, Infinity);

  log(minPath);

  return minPath.length;
}

const dirMap = { R: [0, 1], D: [1, 0], U: [-1, 0], L: [0, -1] };
const dirs = _.keys(dirMap);
const pathKey = (r, c, k) => `(${r},${c})|${k}`;
// { 1: { 2, 3, 4 } }
function parseGraph(grid, path, startNode, endNode, minPathLength) {
  const { key, val, row, col } = startNode;
  const maxRow = grid.length - 1;
  const maxCol = grid[0].length - 1;
  const pkey = pathKey(row, col, key);
  path[pkey] = _.keys(path).length + 1;

  // termination condition; only return path length,
  // no need to store entire path (although we could)
  let currentPathLength = path[pkey] - 1;
  if (key === endNode.key) {
    // have reached the end
    log(`reached one possible end: ${currentPathLength}`);
    // log(path);
    delete path[pkey];
    return { reachedEnd: true, length: currentPathLength };
  }
  if (currentPathLength >= minPathLength) {
    // traversing a path which is potentially longer than
    // an already identified min path length
    // log(`in a path which seems greater than minPathLength so exiting`);
    delete path[pkey];
    return { reachedEnd: false, length: minPathLength };
  }

  // find possible paths
  let possibilities = _.chain(dirs)
    .map((dir) => {
      const [r, c] = dirMap[dir];
      return [r + row, c + col];
    })
    .filter(([pr, pc]) => {
      if (pr >= 0 && pc >= 0 && pr <= maxRow && pc <= maxCol) {
        // not out of bounds
        const { key: pkey, val: pval } = grid[pr][pc];
        if (!path[pathKey(pr, pc, pkey)]) {
          // not in path already (to prevent looping)
          if ((pval <= val && val !== "c") || pval - val === 1) {
            // if increment, then only by 1 atmost
            //log(`${r},${c}`);
            return true;
          }
        }
      }
      return false;
    })
    .value();

  // log(`possibilities at (${row},${col}): ${possibilities}`);
  drawGrid(grid, path, currentPathLength, possibilities);

  let minPath = { reachedEnd: false, length: minPathLength };
  for (let possibility of possibilities) {
    let [pr, pc] = possibility;
    let sn = grid[pr][pc];
    // traverse into next possible node
    let { reachedEnd, length } = parseGraph(
      grid,
      path,
      sn,
      endNode,
      minPath.length
    );

    // if next possible node was the end node, then
    // register if min path
    if (reachedEnd && minPath.length > length) {
      minPath = { reachedEnd, length };
    }
  }

  // take a step back before attempting next possible node
  delete path[pkey];
  return minPath;
}

// can optimise
// - identify that you've blocked yourself in
// - identify if there is no path out even if you haven't (due to elevation)
function drawGrid(grid, path, currentPathLength, possibilities) {
  let gridAsStr = "";
  for (let row in grid) {
    for (let col in grid[row]) {
      if (path[pathKey(row, col, grid[row][col].key)]) {
        gridAsStr += "*";
      } else {
        gridAsStr += grid[row][col].key;
      }
    }
    gridAsStr += "\n";
  }
  console.log(gridAsStr);
  if (possibilities.length === 0) {
    console.log("hit a deadend!");
  }
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
