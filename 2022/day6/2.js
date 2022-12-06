import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day6/puzzle.in";
const testFilePath = "2022/day6/test2.in";

// 2. define how your assertions will run
function assert(output, expectedOutput) {
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  const testResult = testInput.every((input) => {
    const [stream, expectedOutput] = input.split(" ");
    const output = coreLogic(stream);
    console.log(stream, output, expectedOutput);
    return assert(output, _.toInteger(expectedOutput));
  });

  console.log("test results:", testResult);
  return testResult;
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  // mjqjpqmgbljsphdztnvjfqwrcgsmlb
  // bvwbjplbgvbhsrlpgdmjqwftvncz
  for (let c = 0; c < input.length; c++) {
    let dupeMap = {};
    let noDupe = true;
    let markerSize = 14;
    for (let i = 0; i < markerSize; i++) {
      let char = input[c + i];
      // console.log(`char at ${c + i}: ${char}`);
      if (dupeMap[char]) {
        // dupe found
        // console.log("dupe found", char);
        noDupe = false;
        break;
      }
      dupeMap[char] = true;
    }

    // console.log(input, c + 4);
    if (noDupe) {
      return c + markerSize;
    }
  }

  // no marker found
  return -1;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input[0]);

  // console.log(output)
  return output;
}
