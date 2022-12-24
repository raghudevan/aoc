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
  return assert(testResult, 140);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let left, right;
  let lines = [[[2]], [[6]]];
  for (let line of input) {
    if (line === "") {
      continue;
    }
    lines.push(JSON.parse(line));
  }

  // console.log(lines);
  let divPacketIndices = lines
    .sort((a, b) => (compare(a, b) ? -1 : 1))
    .map((s) => JSON.stringify(s))
    .reduce((p, c, i) => {
      if (c === "[[2]]" || c === "[[6]]") {
        p.push(i + 1);
      }
      return p;
    }, []);

  //console.log(lines.map((s) => JSON.stringify(s)).join(`\n`));
  console.log(divPacketIndices);

  let decoderKey = divPacketIndices[0] * divPacketIndices[1];

  return decoderKey;
}

// returns true of left < right
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
