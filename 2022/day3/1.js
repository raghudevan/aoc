import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "day3/1.in";
const testFilePath = "day3/1.test";

// 2. define how your assertions will run
function assert(input, expectedOutput) {
  console.log("todo; write assertion");
  const output = coreLogic(input);
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  // console.log(testInput);
  return assert(input, expectedOutput);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  console.log("todo; write logic to solve problem");
  return;
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
