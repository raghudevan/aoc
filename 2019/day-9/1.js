import _ from "lodash";
import { readInput, opcode } from "../utils";

const filePath = "day-9/1.in";
const testFilePath = "day-9/1.test";

function formatInput(filePath) {
  return readInput(filePath)[0]
    .split(",")
    .map(i => parseInt(i));
}

export function runTests() {
  const input = formatInput(testFilePath);
  const { output } = opcode(0, _.cloneDeep(input), 0, 0, [], true);
  const testResult = _.isEqual(input, output);
  if (testResult === false) {
    console.log(output);
  }
  console.log("test results:", testResult);
  return testResult;
}

export function exec() {
  const input = formatInput(filePath);
  const { output } = opcode([1], input, 0, 0, [], true);
  console.log("output", output);
  return output;
}
