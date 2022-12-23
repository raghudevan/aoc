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
  return assert(testResult, 31);
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

      let cell = { key, val, row: rowCount, col: index, dist: Infinity };
      if (key === "S") {
        val = 97;
        cell.val = 97;
        S = cell;
      }
      if (key === "E") {
        cell.val = 122;
        E = cell;
      }

      return cell;
    });

    grid.push(row);
    rowCount++;
  }

  // log(grid, { depth: 2 });
  log(S);
  log(E);

  // starting from the root node
  // look for possibilities (nodes)
  // for each possibility (node)
  // - pass current dist
  // - if current dist + 1 < node's dist then "accept" (+1 & store)
  // - if accept, continue parsing
  // once all possibilities are exhausted, look for E's dist
  parseGraph(grid, 0, S, E);

  log(S);
  log(E);
  // log(grid, { depth: 10 });

  return E.dist - 1;
}

const dirMap = { R: [0, 1], D: [1, 0], L: [0, -1], U: [-1, 0] };
const dirs = _.keys(dirMap);
function parseGraph(grid, curDist, currentNode, endNode) {
  const { key, val, row, col, dist } = currentNode;
  const maxRow = grid.length - 1;
  const maxCol = grid[0].length - 1;

  let distToNode = curDist + 1;
  if (distToNode < dist) {
    // accept - we've found a shorter path to the current node
    currentNode.dist = distToNode;

    // termination condition
    if (key === endNode.key) {
      // have reached the end; no need to check for other possibilities
      // log(`reached end node`);
      return;
    }

    // for every possibility, ...
    _.chain(dirs)
      .map((dir) => {
        const [r, c] = dirMap[dir];
        return [r + row, c + col];
      })
      .filter(([pr, pc]) => {
        if (pr >= 0 && pc >= 0 && pr <= maxRow && pc <= maxCol) {
          // not out of bounds
          const { val: pval } = grid[pr][pc];
          if (pval <= val || pval - val === 1) {
            // if increment, then only by 1 atmost
            //log(`${r},${c}`);
            return true;
          }
        }
        return false;
      })
      .forEach((possibility) => {
        let [pr, pc] = possibility;
        let nextNode = grid[pr][pc];
        // traverse into next possible node
        parseGraph(grid, currentNode.dist, nextNode, endNode);
      })
      .value();
  }

  // reject - current path is longer than an existing min path
  return;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
