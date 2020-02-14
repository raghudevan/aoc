import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-7/1.in';
const testFilePath = 'day-7/2.test';

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
        return { errorCode: 1 };
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
        return { errorCode: 1 };
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
        return { errorCode: 1 };
      } else {
        const inp = input.pop();
        if (_.isNil(inp)) {
          // return instruction pointer also so that we know where to start off from
          return { output, insPointer };
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
        return { errorCode: 1 };
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
        return { errorCode: 1 };
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
        return { errorCode: 1 };
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
        return { errorCode: 1 };
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
        return {};
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
      return { output, insPointer, errorCode: 0 };
    default:
      // invalid command
      console.log('panic: invalid command:', command);
      return { errorCode: 1 };
  }

  return opcode(input, program, insPointer, output);
}

function runDiagnostics(program, minInput = 0, maxInput = 5) {
  let thrusts = [];
  let progToRun;
  for (let input = minInput; input < maxInput; input++) {
    for (let pseq = 5; pseq < 10; pseq++) {
      progToRun = _.cloneDeep(program);
      const output = opcode([input, pseq], progToRun, 0, 0);
      thrusts.push({ input, pseq, output });
    }
  }
  return thrusts;
}

function makePrograms(program, pseqList) {
  const programs = pseqList.reduce((progs, pseq) => {
    progs[pseq] = { program: _.cloneDeep(program), insPointer: 0 };
    return progs;
  }, {});
  return programs;
}

function calculateThrust(program, pseqList) {
  const progs = makePrograms(program, pseqList);
  debug(`program is ${program.length} instructions long`);

  return (function pass(inputThrust, passCount) {
    let outputThrust, progToRun, insPointer, errorCode;
    for (let pseq of pseqList) {
      ({ program: progToRun, insPointer } = progs[pseq]);
      const inputArray = [inputThrust];
      if (passCount === 1) {
        inputArray.push(pseq);
      }
      ({ output: outputThrust, insPointer, errorCode } = opcode(inputArray, progToRun, insPointer, 0));
      debug(`pass count: ${passCount} | input: ${inputThrust} | phase: ${pseq} | instruction pointer at: ${insPointer} | output: ${outputThrust} | ${errorCode}`);
      if (errorCode === 1) {
        // something went wrong with the program
        console.log(`panic: program for ${pseq} errored out!`);
        return outputThrust;
      } else if (errorCode === 0 && pseq === pseqList[4]) {
        // need to halt
        return outputThrust;
      }
      progs[pseq] = { program: progToRun, insPointer };
      inputThrust = outputThrust;
    }
    return pass(outputThrust, passCount + 1);
  })(0, 1);
}

function swap(input, i, j) {
  let tmp = input[i];
  input[i] = input[j];
  input[j] = tmp;
  return input;
}

function seqGenerator(input, startIndex, endIndex, seqs) {
  if (startIndex === endIndex) {
    seqs.push(_.cloneDeep(input));
    return seqs;
  }

  for (let i = startIndex; i <= endIndex; i++) {
    swap(input, startIndex, i);
    seqGenerator(input, startIndex + 1, endIndex, seqs);
    swap(input, startIndex, i);
  }

  return seqs;
}

function formatTestInput(inputs) {
  return inputs.map(input => {
    const [program, expectedOutput] = input.split(' ');
    return [program.split(',').map(i => ~~i), ~~expectedOutput];
  })
}

export function runTests() {
  const seqs = seqGenerator([5, 6, 7, 8, 9], 0, 4, []);
  const inputs = formatTestInput(readInput(testFilePath));

  const testResult = inputs.every(([program, expectedOutput]) => {
    const { max: maxThrust, seq } = seqs.reduce(({ max, seq }, nextSeq) => {
      const thrust = calculateThrust(program, nextSeq);
      if (thrust >= max) {
        return { max: thrust, seq: nextSeq };
      }
      return { max, seq };
    }, { max: 0 });

    if (maxThrust === expectedOutput) {
      return true;
    }
    console.log(maxThrust, seq, expectedOutput);
    return false;
  });

  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const seqs = seqGenerator([5, 6, 7, 8, 9], 0, 4, []);
  const program = readInput(filePath)[0].split(',').map(i => ~~i);
  const { max: maxThrust, seq } = seqs.reduce(({ max, seq }, nextSeq) => {
    const thrust = calculateThrust(program, nextSeq);
    if (thrust >= max) {
      return { max: thrust, seq: nextSeq };
    }
    return { max, seq };
  }, { max: 0 });

  const output = maxThrust;
  console.log(`max thrust:`, output);
  return output;
}
