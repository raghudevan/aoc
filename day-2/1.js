import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-2/1.in';
const testFilePath = 'day-2/1.test';

function opcode(input, pointer) {
  let instruction = input[pointer];
  if (instruction === 99) {
    return input;
  }

  let oper1 = input[input[pointer + 1]];
  let oper2 = input[input[pointer + 2]];
  let opPos = input[pointer + 3];
  switch (instruction) {
    case 1:
      // add
      input[opPos] = oper1 + oper2;
      break;
    case 2:
      // multiply
      input[opPos] = oper1 * oper2;
      break;
  }

  return opcode(input, pointer + 4);
}

function assert(input, expectedOutput) {
  return _.isEqual(opcode(input, 0), expectedOutput);
}

function formatIO([input, output]) {
  return [input.split(',').map(i => ~~i), output.split(',').map(i => ~~i)];
}

export function runTests() {
  const testInput = readInput(testFilePath);
  const testResult = testInput.every(test => {
    const [input, expectedOutput] = formatIO(test.split(' '));
    return assert(input, expectedOutput);
  });
  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const input = readInput(filePath);
  input.push('');
  const [opcodeInput] = formatIO(input);
  const output = opcode(opcodeInput, 0);
  console.log(output);
  return output;
}
