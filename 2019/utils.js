const PARAM_TYPES = {
  v: 1,
  a: 0,
};

let IS_DEBUG = false;
function debug(...messages) {
  if (IS_DEBUG) {
    console.log(...messages);
  }
}

function getModes(instruction) {
  const modes = _.chain(instruction / 100)
    .floor()
    .toString()
    .padStart(3, 0)
    .split("")
    .reverse()
    .map((i) => parseInt(i))
    .value();
  return modes;
}

function decodeInstruction(instruction) {
  const command = instruction % 100;
  const modes = getModes(instruction);
  return { command, modes };
}

function getParam(program, relativeBase, insPointer, mode) {
  let addr, val;
  switch (mode) {
    case 0:
      // position mode -> address -> value
      addr = _.get(program, insPointer, 0);
      val = _.get(program, addr, 0);
      break;
    case 1:
      // immediate mode -> value
      addr = insPointer;
      val = _.get(program, insPointer, 0);
      break;
    case 2:
      // relative mode -> relativeBase + address -> value
      addr = relativeBase + _.get(program, insPointer, 0);
      val = _.get(program, addr, 0);
      break;
  }
  return { addr, val };
}

function getParams(count, program, relativeBase, insPointer, modes) {
  const params = [];
  for (let i = 1; i <= count; i++) {
    const mode = _.get(modes, i - 1, 0);
    const { addr, val } = getParam(program, relativeBase, insPointer + i, mode);
    params.push({ addr, val });
  }
  return { params, error: null };
}

function intcode(input, program, relativeBase, insPointer, output, isDebug) {
  IS_DEBUG = isDebug;
  const instruction = program[insPointer];
  const { command, modes } = decodeInstruction(instruction);
  debug(
    `${
      insPointer + 1
    } | instruction: ${instruction} | command: ${command} | modes: ${modes}`
  );

  let params, error;
  let p1, p2, p3;
  switch (command) {
    case 1:
      // add
      ({ params, error } = getParams(
        3,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        [{ val: p1 }, { val: p2 }, { addr: p3 }] = params;
        debug(`adding ${p1} & ${p2} and writing to ${p3}`);
        _.set(program, p3, p1 + p2);
        insPointer += 4;
      }
      break;
    case 2:
      // multiply
      ({ params, error } = getParams(
        3,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        [{ val: p1 }, { val: p2 }, { addr: p3 }] = params;
        debug(`multiplying ${p1} & ${p2} and writing to ${p3}`);
        _.set(program, p3, p1 * p2);
        insPointer += 4;
      }
      break;
    case 3:
      // take input and write to &(pointer + 1)
      ({ params, error } = getParams(
        1,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        const inp = input.pop();
        if (_.isNil(inp)) {
          // return instruction pointer also so that we know where to start off from
          return { output, insPointer };
        }
        [{ addr: p1 }] = params;
        debug(`writing ${inp} to ${p1}`);
        _.set(program, p1, inp);
        insPointer += 2;
      }
      break;
    case 4:
      // output value at &(pointer + 1)
      ({ params, error } = getParams(
        1,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        [{ val: p1 }] = params;
        debug(`writing ${p1} to output`);
        output.push(p1);
        insPointer += 2;
      }
      break;
    case 5:
      // jnz => p1 != 0 -> insPointer = p2
      ({ params, error } = getParams(
        2,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        [{ val: p1 }, { val: p2 }] = params;
        debug(`checking if ${p1} is neq 0`);
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
      ({ params, error } = getParams(
        2,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        [{ val: p1 }, { val: p2 }] = params;
        debug(`checking if ${p1} eq 0`);
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
      ({ params, error } = getParams(
        3,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return { errorCode: 1 };
      } else {
        [{ val: p1 }, { val: p2 }, { addr: p3 }] = params;
        debug(`checking if ${p1} is lt ${p2}`);
        if (p1 < p2) {
          debug(`setting ${p3} to 1`);
          _.set(program, p3, 1);
        } else {
          debug(`setting ${p3} to 0`);
          _.set(program, p3, 0);
        }
        insPointer += 4;
      }
      break;
    case 8:
      // eq => p1 = p2 -> &p3 = 1 else &p3 = 0
      ({ params, error } = getParams(
        3,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return {};
      } else {
        [{ val: p1 }, { val: p2 }, { addr: p3 }] = params;
        debug(`checking if ${p1} eq ${p2}`);
        if (p1 === p2) {
          debug(`setting ${p3} to 1`);
          _.set(program, p3, 1);
        } else {
          debug(`setting ${p3} to 0`);
          _.set(program, p3, 0);
        }
        insPointer += 4;
      }
      break;
    case 9:
      // adjust relative base
      ({ params, error } = getParams(
        1,
        program,
        relativeBase,
        insPointer,
        modes
      ));
      if (error) {
        console.log("panic:", error);
        return {};
      } else {
        [{ val: p1 }] = params;
        let tmpRelBase = relativeBase;
        relativeBase += p1;
        debug(
          `adjusting relative base (${tmpRelBase}) by ${p1} to ${relativeBase}`
        );
        insPointer += 2;
      }
      break;
    case 99:
      // halt program
      debug("halting program");
      return { output, insPointer, relativeBase, errorCode: 0 };
    default:
      // invalid command
      console.log("panic: invalid command:", command);
      return { errorCode: 1 };
  }

  return { output, insPointer, relativeBase };
}

export function opcode(
  input,
  program,
  relativeBase,
  insPointer,
  output,
  isDebug
) {
  let errorCode;
  while (_.isNil(errorCode)) {
    ({ output, insPointer, relativeBase, errorCode } = intcode(
      input,
      program,
      relativeBase,
      insPointer,
      output,
      isDebug
    ));
  }
  return { output, insPointer, relativeBase, errorCode };
}
