import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-5/1.in';
const testFilePath = 'day-5/1.test';

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

function opcode(input, program, insPointer, output) {
  const instruction = program[insPointer];
  const { command, modes } = decodeInstruction(instruction);
  console.log(
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
        console.log(`adding ${p1} & ${p2} and writing to ${p3}`);
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
        console.log(`multiplying ${p1} & ${p2} and writing to ${p3}`);
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
        console.log(`writing ${input} to ${p1}`);
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
        console.log(`writing ${p1} to output`);
        output = p1;
        console.log('output:', output);
        insPointer += 2;
      }
      break;
    case 99:
      // halt program
      console.log('halting program');
      return output;
    default:
      // invalid command
      console.log('panic: invalid command:', command);
      return;
  }

  return opcode(input, program, insPointer, output);
}

export function runTests() {
  const testInput = readInput(testFilePath).map(i => ~~i.replace(/\\r/, ''));
  const testResult = opcode(1, testInput, 0, 0) === 0;
  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const input = readInput(filePath).map(i => ~~i.replace(/\\r/, ''));
  const output = opcode(1, input, 0);
  console.log('diagnostic code:', output);
  return output;
}
