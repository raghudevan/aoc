import { readInput } from '../utils';

const filePath = 'day-1/2.in';
const testFilePath = 'day-1/2.test';

export function exec() {
  const input = readInput(filePath);
  const output = input.reduce((sum, moduleMass) => {
    return sum + fuelRequiredToLaunch(~~moduleMass);
  }, 0);
  console.log(output);
  return output;
}

export function runTests() {
  console.log('running test on:', testFilePath);
  const testInput = readInput(testFilePath);
  const testResult = testInput.every(test => {
    const [input, expectedOutput] = test.split(' ');
    return assert(~~input, ~~expectedOutput);
  });
  console.log('all tests passed:', testResult);
  return testResult;
}

function assert(input, expectedOutput) {
  return fuelRequiredToLaunch(input) === expectedOutput;
}

function fuelRequiredToLaunch(moduleMass) {
  const fuelRequired = Math.floor(moduleMass / 3) - 2;
  if (fuelRequired >= 0) {
    return fuelRequired + fuelRequiredToLaunch(fuelRequired);
  } else {
    return 0;
  }
}
