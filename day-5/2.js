import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-5/1.in';
const testFilePath = 'day-5/2.test';

function getModes(instruction) {
  const modes = _.chain(instruction / 100)
    .floor()
    .toString()
    .padStart(3)
    .split('')
    .reverse()
    .map(i => ~~i)
    .value();
  modes[modes.length - 1] = 1;
  return modes;
}

function decodeInstruction(instruction) {
  const command = instruction % 100;
  const modes = getModes(instruction);
  return { command, modes };
}

function getParameterValue(program, insPointer, mode) {
  let value;
  switch (mode) {
    case 0:
      // position -> address -> value
      const addr = _.get(program, insPointer);
      value = _.get(program, addr);
      break;
    case 1:
      // immediate -> value
      value = _.get(program, insPointer);
      break;
  }
  return value;
}

function getParams(count, program, insPointer, modes) {
  const params = [];
  for (let i = 1; i <= count; i++) {
    const value = getParameterValue(
      program,
      insPointer + i,
      _.get(modes, i - 1, 0)
    );
    if (_.isNil(value)) {
      return {
        params,
        error: `unable to get all params for given mode: ${modes}`,
      };
    }
    params.push(value);
  }
  return { params, error: null };
}

function debug(...messages) {
  if (false) {
    console.log(...messages);
  }
}

function opcode(input, program, insPointer, output) {
  const instruction = program[insPointer];
  const { command, modes } = decodeInstruction(instruction);
  debug(
    `${insPointer +
      1} | instruction: ${instruction} | command: ${command} | modes: ${modes}`
  );

  let params, error;
  let p1, p2, p3;
  switch (command) {
    case 1:
      // add
      ({ params, error } = getParams(3, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1, p2, p3] = params;
        debug(`adding ${p1} & ${p2} and writing to ${p3}`);
        _.set(program, p3, p1 + p2);
        insPointer += 4;
      }
      break;
    case 2:
      // multiply
      ({ params, error } = getParams(3, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1, p2, p3] = params;
        debug(`multiplying ${p1} & ${p2} and writing to ${p3}`);
        _.set(program, p3, p1 * p2);
        insPointer += 4;
      }
      break;
    case 3:
      // take input and write to &(pointer + 1)
      ({ params, error } = getParams(1, program, insPointer, [1]));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1] = params;
        debug(`writing ${input} to ${p1}`);
        _.set(program, p1, input);
        insPointer += 2;
      }
      break;
    case 4:
      // output value at &(pointer + 1)
      ({ params, error } = getParams(1, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1] = params;
        debug(`writing ${p1} to output`);
        output = p1;
        insPointer += 2;
      }
      break;
    case 5:
      // jnz => p1 != 0 -> insPointer = p2
      ({ params, error } = getParams(2, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1, p2] = params;
        if (p1 !== 0) {
          debug(`jnz: jumping to ${p2} | ${p1}`);
          insPointer = p2;
        } else {
          insPointer += 3;
          debug(
            `no reason to jump to ${p2}, instead increment to ${insPointer} | ${p1}`
          );
        }
      }
      break;
    case 6:
      // jz => p1 = 0 -> insPointer = p2
      ({ params, error } = getParams(2, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1, p2] = params;
        if (p1 === 0) {
          debug(`jz: jumping to ${p2} | ${p1}`);
          insPointer = p2;
        } else {
          insPointer += 3;
          debug(
            `no reason to jump to ${p2}, instead increment to ${insPointer} | ${p1}`
          );
        }
      }
      break;
    case 7:
      // lt => p1 < p2 -> &p3 = 1 else &p3 = 0
      ({ params, error } = getParams(3, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1, p2, p3] = params;
        if (p1 < p2) {
          _.set(program, p3, 1);
        } else {
          _.set(program, p3, 0);
        }
        insPointer += 4;
      }
      break;
    case 8:
      // eq => p1 = p2 -> &p3 = 1 else &p3 = 0
      ({ params, error } = getParams(3, program, insPointer, modes));
      if (error) {
        console.log('panic:', error);
        return;
      } else {
        [p1, p2, p3] = params;
        if (p1 === p2) {
          _.set(program, p3, 1);
        } else {
          _.set(program, p3, 0);
        }
        insPointer += 4;
      }
      break;
    case 99:
      // halt program
      debug('halting program');
      return output;
    default:
      // invalid command
      console.log('panic: invalid command:', command);
      return;
  }

  return opcode(input, program, insPointer, output);
}

function formatProgram(program) {
  return program
    .replace(/\\r/, '')
    .split(',')
    .map(i => ~~i);
}

export function runTests() {
  const testInput = readInput(testFilePath);
  const testResult = testInput.every(testCase => {
    const [program, input, expectedOutput] = testCase.split(' ');
    return opcode(~~input, formatProgram(program), 0) === ~~expectedOutput;
  });
  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const input = readInput(filePath).map(i => ~~i.replace(/\\r/, ''));
  const output = opcode(5, input, 0, 0);
  console.log('diagnostic code:', output);
  return output;
}
