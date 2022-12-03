import { readInput } from "../utils";

const filePath = "day-1/1.in";
const testFilePath = "day-1/1.test";

export function exec() {
  const input = readInput(filePath);
  const output = input.reduce((sum, moduleMass) => {
    return sum + fuelRequiredToLaunch(~~moduleMass);
  }, 0);
  console.log(output);
  return output;
}

export function runTests() {
  const testInput = readInput(testFilePath);
  const testResult = testInput.every((test) => {
    const [input, expectedOutput] = test.split(" ");
    return assert(~~input, ~~expectedOutput);
  });
  console.log("test result:", testResult);
  return testResult;
}

function assert(input, expectedOutput) {
  return fuelRequiredToLaunch(input) === expectedOutput;
}

function fuelRequiredToLaunch(moduleMass) {
  return Math.floor(moduleMass / 3) - 2;
}
