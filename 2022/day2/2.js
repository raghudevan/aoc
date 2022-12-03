import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day2/2.in";
const testFilePath = "2022/day2/2.test";

// 2. define how your assertions will run
function assert(output, expectedOutput) {
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  // console.log(testInput);
  const score = coreLogic(testInput);

  return assert(score, 12);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  // A/X - Rock, B/Y - Paper, C/Z - Scissor
  // win - 6, draw - 3, loose - 0
  // const map = {
  //   A: { point: 1, X: 3, Y: 0, Z: 6 },
  //   B: { point: 2, X: 6, Y: 3, Z: 0 },
  //   C: { point: 3, X: 0, Y: 6, Z: 3 },
  // };
  const map = {
    X: { point: 1, A: 3, B: 0, C: 6 },
    Y: { point: 2, A: 6, B: 3, C: 0 },
    Z: { point: 3, A: 0, B: 6, C: 3 },
  };
  const anotherMap = { X: 0, Y: 3, Z: 6 };
  const solMap = {
    0: { A: "Z", B: "X", C: "Y" },
    3: { A: "X", B: "Y", C: "Z" },
    6: { A: "Y", B: "Z", C: "X" },
  };

  let score = 0;
  _.reduce(
    input,
    (p, c) => {
      const [opp, result] = c.split(" ");
      const you = solMap[anotherMap[result]][opp];
      score += map[you].point;
      score += map[you][opp];
      return score;
    },
    score
  );

  return score;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  console.log(output);
  return output;
}
