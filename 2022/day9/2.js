import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day9/puzzle.in";
const testFilePath = "2022/day9/test2.in";

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
  return assert(testResult, 36);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  // make grid and place tokens (rope)
  let ropeLength = 10;
  let { rope, moves } = makeGrid(input, ropeLength);
  // execute moves
  for (let move of moves) {
    // move H
    const { dir, len } = move;
    // console.log(`move ${dir} by ${len}`);

    for (let l = 0; l < len; l++) {
      // always move head first
      moveToken(0, dir, 1, rope);

      // iterate over rest of rope and move it if necessary
      for (let r = 1; r < rope.length; r++) {
        const { x: xH, y: yH } = rope[r - 1];
        const { x: xT, y: yT } = rope[r];

        const xDiff = xH - xT;
        const yDiff = yH - yT;
        const xDiffDir = xDiff === 0 ? "" : xDiff > 0 ? "D" : "U";
        const yDiffDir = yDiff === 0 ? "" : yDiff > 0 ? "R" : "L";

        if (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1) {
          // console.log(`${r+1} needs to move: ${xDiffDir}${yDiffDir}`);
          moveToken(r, `${xDiffDir}${yDiffDir}`, 1, rope);
        } else {
          // console.log(`${r+1} needn't move`);
        }

        // where tokens are at the end of every move
        // console.log(rope);
      }
    }
  }

  // console.log(grid);
  // console.log(rope);

  const uniqueCountOfWhereTailHasBeen = _.chain(rope)
    .get(`[${rope.length - 1}].pathHash`)
    .keys()
    .value().length;
  //console.log(uniqueCountOfWhereTHasBeen);

  return uniqueCountOfWhereTailHasBeen;
}

function moveToken(ropeIndex, dir, len, rope) {
  // from
  const { x: srcX, y: srcY, pathHash } = rope[ropeIndex];

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

  // move to dest
  // also keep track of where this token has been
  pathHash[`(${destX},${destY})`] = true;
  rope[ropeIndex] = {
    x: destX,
    y: destY,
    pathHash,
  };
}

function makeGrid(input, ropeLength) {
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

  let S = { x: 0, y: 0 };
  let rope = [];
  for (let r = 0; r < ropeLength; r++) {
    rope[r] = { x: 0, y: 0, pathHash: { ["(0,0)"]: true } };
  }

  // console.log(`x = ${xmax}, y = ${ymax}`);
  // console.log(S, H, T, moves);
  return { S, rope, moves };
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
