import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day9/puzzle.in";
const testFilePath = "2022/day9/test.in";

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
  return assert(testResult, 13);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  // make grid and place tokens
  let { grid, S, H, T, moves } = makeGrid(input);
  let tokens = { S, H, T };
  // execute moves
  for (let move of moves) {
    // move H
    const { dir, len } = move;
    // console.log(`move ${dir} by ${len}`);

    for (let l = 0; l < len; l++) {
      moveToken("H", dir, 1, tokens, grid);

      // does tail need to move?
      const { x: xH, y: yH } = tokens["H"];
      const { x: xT, y: yT } = tokens["T"];

      const xDiff = xH - xT;
      const yDiff = yH - yT;
      const xDiffDir = xDiff === 0 ? "" : xDiff > 0 ? "D" : "U";
      const yDiffDir = yDiff === 0 ? "" : yDiff > 0 ? "R" : "L";

      if (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1) {
        // console.log(`T needs to move: ${xDiffDir}${yDiffDir}`);
        moveToken("T", `${xDiffDir}${yDiffDir}`, 1, tokens, grid);
      } else {
        // console.log(`T needn't move`);
      }

      // where tokens are at the end of every move
      // console.log(tokens);
    }
  }

  // console.log(grid);
  // console.log(tokens);

  const uniqueCountOfWhereTHasBeen = _.chain(tokens)
    .get("T.pathHash")
    .keys()
    .value().length;
  //console.log(uniqueCountOfWhereTHasBeen);

  return uniqueCountOfWhereTHasBeen;
}

function moveToken(token, dir, len, tokens, grid) {
  // from
  const { x: srcX, y: srcY, pathHash } = tokens[token];

  // to
  let destX = srcX;
  let destY = srcY;
  switch (dir) {
    case "R":
      destY += len;
      break;
    case "L":
      destY -= len;
      break;
    case "U":
      destX -= len;
      break;
    case "D":
      destX += len;
      break;
    case "DR":
      destX += len;
      destY += len;
      break;
    case "DL":
      destX += len;
      destY -= len;
      break;
    case "UR":
      destX -= len;
      destY += len;
      break;
    case "UL":
      destX -= len;
      destY -= len;
      break;
  }

  // console.log(`moving ${token} from (${srcX},${srcY}) to (${destX},${destY})`);
  // remove from source
  // delete grid[srcX][srcY].tokens[token];

  // move to dest
  // also keep track of where this token has been
  tokens[token] = {
    x: destX,
    y: destY,
    pathHash: { ...pathHash, [`(${destX},${destY})`]: true },
  };
  // grid[destX][destY].tokens[token] = tokens[token];
}

function makeGrid(input) {
  let xmax = 0,
    ymax = 0;
  let x = 0,
    y = 0;
  let moves = [];
  for (let line of input) {
    let [dir, len] = line.split(" ");
    len = _.toInteger(len);
    moves.push({ dir, len });
    switch (dir) {
      case "R":
        y += len;
        break;
      case "L":
        y -= len;
        break;
      case "U":
        x += len;
        break;
      case "D":
        x -= len;
        break;
    }

    if (x > xmax) {
      xmax = x;
    }

    if (y > ymax) {
      ymax = y;
    }
  }

  let grid = [];
  let S = { x: 0, y: 0 };
  let H = { x: 0, y: 0, pathHash: { ["(0,0)"]: true } };
  let T = { x: 0, y: 0, pathHash: { ["(0,0)"]: true } };

  // THERE IS NO GRID!
  // for (let x = 0; x < xmax + 1; x++) {
  //   let col = [];
  //   for (let y = 0; y < ymax + 1; y++) {
  //     let tokens = {};
  //     if (x === 4 && y === 0) {
  //       tokens = { S, H, T };
  //     }
  //     col.push({ tokens, coords: `${x},${y}` });
  //   }
  //   grid.push(col);
  // }

  //console.log(`x = ${xmax}, y = ${ymax}`);
  // console.log(grid, S, H, T, moves);
  return { grid, S, H, T, moves };
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
