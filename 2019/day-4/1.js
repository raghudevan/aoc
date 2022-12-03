import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-4/1.in';
const testFilePath = 'day-4/1.test';

function checkAdjacency(ints) {
  return ints.some((i, index) => i === _.get(ints, index + 1));
}

function checkIncrease(ints) {
  return ints.every((i, index) => i <= _.get(ints, index + 1, Infinity));
}

// return 0 | 1
function parseSequence(input, min, max) {
  const ints = input.split('').map(i => ~~i);
  input = ~~input;

  if (ints.length < 6) {
    return 0;
  }

  if (input < min || input > max) {
    return 0;
  }

  if (!checkAdjacency(ints)) {
    return 0;
  }

  if (!checkIncrease(ints)) {
    return 0;
  }

  return 1;
}

export function runTests() {
  const inputs = readInput(testFilePath);
  const testResult = inputs.every(input => {
    const [ sequence, expectedOutput ] = input.split(' ');
    return parseSequence(sequence, -Infinity, Infinity) === ~~expectedOutput;
  });
  console.log('test results:', testResult);
  return testResult;
}

export function exec() {
  const min = 264793;
  const max = 803935;
  let counts = 0;
  for (let i = min; i <= max; i++) {
    if (parseSequence(i+'', min, max)) {
      counts++
    }
  }
  console.log(counts);
  return counts;
}