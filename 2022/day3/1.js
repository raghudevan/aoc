import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day3/1.in";
const testFilePath = "2022/day3/1.test";

// 2. define how your assertions will run
function assert(input, expectedOutput) {
  const output = coreLogic(input);
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  // console.log(testInput);
  return assert(testInput, 157);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  const doubles = [];
  let sumPrio = 0;
  for (let items of input) {
    items = items.split("");
    const itemHash = {};
    let item;
    for (let i = 0; i < items.length / 2; i++) {
      itemHash[items[i]] = 1;
    }

    for (let i = items.length / 2; i < items.length; i++) {
      if (itemHash[items[i]]) {
        item = items[i];
        break;
      }
    }

    const prio = charCode(item);
    doubles.push({ item, prio });
    sumPrio += prio;
  }

  // console.log(doubles);
  return sumPrio;
}

function charCode(char) {
  if (char) {
    const code = char.charCodeAt();
    if (code >= 97 && code <= 122) {
      // lower case
      return code - 96;
    } else {
      return code - 38;
    }
  }
  return 0;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  console.log(output);
  return output;
}
