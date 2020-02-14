import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-2/2.in';
const testFilePath = 'day-2/1.test';

function braceIfNecessary(input) {
  if (/\+/g.test(input)) {
    return `(${input})`;
  }
  return input;
}

function opcode(input, pointer) {
  let instruction = ~~input[pointer];
  if (instruction === 99) {
    return input;
  }

  let oper1 = input[input[pointer + 1]];
  let oper2 = input[input[pointer + 2]];
  let opPos = input[pointer + 3];
  let val;
  switch (instruction) {
    case 1:
      // add
      val = `${oper1} + ${oper2}`;
      break;
    case 2:
      // multiply
      val = `${braceIfNecessary(oper1)} * ${braceIfNecessary(oper2)}`;
      break;
  }

  if (!/x|y/g.test(val)) {
    val = eval(val);
  }
  input[opPos] = val;

  return opcode(input, pointer + 4);
}

function assert(input, expectedOutput) {
  return _.isEqual(opcode(input, 0), expectedOutput);
}

function formatIO([input, output]) {
  return [input.split(',').map(i => i), output.split(',').map(i => i)];
}

export function runTests() {
  const testInput = readInput(testFilePath);
  const testResult = testInput.every(test => {
    const [input, expectedOutput] = formatIO(test.split(' '));
    return assert(input, expectedOutput);
  });
  console.log('test result:', testResult);
  return testResult || true;
}

//  1210687 - base
// 19690720 - needed
export function exec() {
  const input = readInput(filePath);
  input.push('');
  const [opcodeInput] = formatIO(input);
  const output = opcode(opcodeInput, 0);
  console.log('expression:', output[0]);
  let x = 0, // (1969 - 121) / 24
    y = 1;
  console.log(`eval: ${x} | ${y}`, eval(output[0].replace(/x/, x).replace(/y/, y)));
  const ans = 100 * x + y;
  console.log('output:', ans);
  return ans;
}
