import _, { max } from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day1/2.in";
const testFilePath = "2022/day1/2.test";

// 2. define how your assertions will run
function assert(actualOutput, expectedOutput) {
  return _.isEqual(actualOutput, expectedOutput);
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  const maxCalories = coreLogic(testInput);
  console.log(maxCalories);

  return assert(maxCalories, 45000);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  const caloriesMap = { 1: 0 };
  let elfCount = 1;
  let elves = [];
  for (const calories of input) {
    if (calories === "") {
      elves.push({ calories: caloriesMap[elfCount], elfCount });
      elfCount++;
    }

    if (caloriesMap[elfCount]) {
      caloriesMap[elfCount] += ~~calories;
    } else {
      caloriesMap[elfCount] = ~~calories;
    }
  }

  elves = _.chain(elves).sortBy(["calories"]).reverse().value();

  let maxCalories = 0;
  for (let i = 0; i < 3; i++) {
    maxCalories += elves[i].calories;
  }

  return maxCalories;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  console.log(output);
  return output;
}
