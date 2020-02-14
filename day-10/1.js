import _ from "lodash";
import { readInput, opcode } from "../utils";

const filePath = "day-10/1.in";
const testFilePath = "day-10/1.test";

function formatInput(filePath) {
  return readInput(filePath).map(line => line.split(""));
}

function scan() {}

export function runTests() {
  const input = formatInput(testFilePath);
  console.log(input);
  const testResult = false;
  console.log("test results:", testResult);
  return testResult;
}

export function exec() {
  return;
}
