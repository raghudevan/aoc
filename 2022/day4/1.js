import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day4/puzzle.in";
const testFilePath = "2022/day4/test.in";

// 2. define how your assertions will run
function assert(output, expectedOutput) {
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  //console.log(testInput);
  const { countContained: testResult } = coreLogic(testInput);

  console.log("test results:", testResult);
  return assert(testResult, 2);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let countContained = 0;
  const overlaps = [];
  console.log(input);
  for (let pairs of input) {
    const [e1, e2] = pairs.split(",");
    const [e1s, e1e] = e1.split("-").map((e) => ~~e);
    const [e2s, e2e] = e2.split("-").map((e) => ~~e);

    //console.log(`${e1s}-${e2e}|${e2s}-${e2e}`);
    if (e1s >= e2s && e1e <= e2e) {
      // e1 is contained in e2
      overlaps.push(`${e1s}-${e2e}|${e2s}-${e2e}`);
      countContained++;
    } else if (e2s >= e1s && e2e <= e1e) {
      // e2 is contained in e1
      overlaps.push(`${e1s}-${e2e}|${e2s}-${e2e}`);
      countContained++;
    }
  }
  return { countContained, overlaps };
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);
  return output;
}
