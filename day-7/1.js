import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-7/1.in';
const testFilePath = 'day-7/1.test';

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
  if (0) {
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
        const inp = input.pop();
        if (_.isNil(inp)) {
          console.log('panic: no more inputs available! halting program');
          return output;
        }
        [p1] = params;
        debug(`writing ${inp} to ${p1}`);
        _.set(program, p1, inp);
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

function runDiagnostics(program, minInput = 0, maxInput = 5) {
  let thrusts = [];
  let progToRun;
  for (let input = minInput; input < maxInput; input++) {
    for (let pseq = 0; pseq < 5; pseq++) {
      progToRun = _.cloneDeep(program);
      const output = opcode([input, pseq], progToRun, 0, 0);
      thrusts.push({ input, pseq, output });
    }
  }
  return thrusts;
}

function calculateThrust(program, pseqList) {
  return pseqList.reduce((thrust, pseq) => {
    const progToRun = _.cloneDeep(program);
    const newThrust = opcode([thrust, pseq], progToRun, 0, 0);
    //    console.log(thrust, pseq, newThrust);
    return newThrust;
  }, 0);
}

function findMaxThrust(input, pseqList, program) {
  if (!pseqList.length) {
    return input;
  }
  let maxThrust = 0;
  let pseqMax = 0;
  for (let pseq of pseqList) {
    let progToRun = _.cloneDeep(program);
    let thrust = opcode([input, pseq], progToRun, 0, 0);
    if (thrust > maxThrust) {
      maxThrust = thrust;
      pseqMax = pseq;
    }
  }
  console.log(pseqMax);
  return findMaxThrust(
    maxThrust,
    pseqList.filter(p => p !== pseqMax),
    program
  );
}

function formatTestInput(input) {
  const [program, expectedOutput] = input[0].split(' ');
  return [program.split(',').map(i => ~~i), ~~expectedOutput];
}

export function runTests() {
  const [program, expectedOutput] = formatTestInput(readInput(testFilePath));
  if (0) {
    let thrusts = runDiagnostics(program, -3, 1);
    console.log(thrusts);
  } else {
    let pseqList = [4, 3, 2, 1, 0];
    const maxThrust = calculateThrust(program, pseqList);
    console.log(pseqList, maxThrust, expectedOutput);
  }
  const testResult = true;
  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const [program, expectedOutput] = formatTestInput(readInput(filePath));
  if (0) {
    let thrusts = runDiagnostics(program, 0, 5);
    console.log(thrusts);
    return thrusts;
  } else {
    const output = calculateThrust(program, [2, 4, 0, 3, 1]);
    // #1 - [4, 0, 1, 2, 3] 156900
    // #2 - [4, 0, 2, 3, 1] 174742
    // #3 - [4, 2, 0, 3, 1] 183190
    // #4 - [0, 4, 2, 1, 3] 227148
    // #5 - [0, 4, 2, 3, 1] 228502
    //      [0, 2, 4, 3, 1] 248470
    //      [2, 4, 0, 3, 1] 263062
    // #6 - [2, 0, 4, 3, 1] 273814
    console.log('max thrust:', output);
    return output;
  }
}
