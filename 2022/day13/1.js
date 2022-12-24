import _ from "lodash";
import { log, readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day13/puzzle.in";
const testFilePath = "2022/day13/test.in";

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
  let left, right;
  let inputIndex = 0;
  let countRightInput = 0;
  for (let line of input) {
    if (!left) {
      left = JSON.parse(line);
      continue;
    }
    if (!right) {
      right = JSON.parse(line);
      continue;
    }

    if (left && right) {
      inputIndex++;
      // got both pairs, can process
      if (compare(left, right)) {
        countRightInput += inputIndex;
        log(left, { depth: Infinity });
        log(`found right input at: ${inputIndex}, sum: ${countRightInput}`);
      }
      log(`--`);
    }

    if (line === "") {
      // prep for next pair
      left = undefined;
      right = undefined;
    }
  }

  return countRightInput;
}

function compare(left, right) {
  let tl = typeof left;
  let tr = typeof right;

  //log(left);
  //log(right);
  // if left runs out -> true
  // if left < right  -> true

  if (tl === "number" && tr === "number") {
    // if both are numbers, just compare
    if (left === right) {
      return undefined;
    } else {
      return left < right;
    }
  } else {
    // types mismatch; at least one is an array
    if (tl === "number") {
      left = [left];
    }
    if (tr === "number") {
      right = [right];
    }
  }

  // beyond point, both are guaranteed to be arrays

  for (let i = 0; i < left.length && i < right.length; i++) {
    let compResult = compare(left[i], right[i]);
    if (compResult === undefined) {
      // in the event left === right then need to continue
      continue;
    }

    return compResult;
  }

  if (left.length < right.length) {
    // left has run out of items first
    return true;
  } else if (left.length > right.length) {
    // right has run out of items first
    return false;
  }

  return undefined;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
