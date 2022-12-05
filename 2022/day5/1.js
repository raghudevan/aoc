import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day5/puzzle.in";
const testFilePath = "2022/day5/test.in";

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
  return assert(testResult, "CMZ");
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  const stacks = [];
  const moves = [];
  let pushToStacks = true;
  for (let line of input) {
    if (line === "") {
      pushToStacks = false;
      continue;
    }
    if (pushToStacks) {
      stacks.push(line);
    } else {
      moves.push(line);
    }
  }

  const numberOfStacks = _.reverse(stacks)[0].trim().split("   ").length;
  const stackMap = {};
  for (let i = 1; i < stacks.length; i++) {
    let stack = stacks[i];
    let crates = [];
    for (let i = 0, j = 0; j < stack.length; j += 4) {
      let crate = _.slice(stack, j + 1, j + 2).join("");
      crates.push(crate);
    }

    for (let i = 0; i < crates.length; i++) {
      let crate = crates[i];
      if (crate != " ") {
        if (!stackMap[i + 1]) {
          stackMap[i + 1] = [crate];
        } else {
          stackMap[i + 1].push(crate);
        }
      }
    }
  }

  // parse moves
  //console.log(stackMap, moves);
  for (let move of moves) {
    const [, howMany, from, to] = move.match(
      /^move (\d+) from (\d+) to (\d+)$/
    );
    //console.log(howMany, from, to);
    for (let h = 0; h < howMany; h++) {
      stackMap[to].push(stackMap[from].pop());
      //console.log(stackMap);
    }
  }

  const result = _.chain(stackMap)
    .values()
    .reduce((p, c) => ((p += c.pop()), p), "")
    .value();

  return result;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
