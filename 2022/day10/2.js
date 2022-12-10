import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day10/puzzle.in";
const testFilePath = "2022/day10/test.in";

// 2. define how your assertions will run
function assert(output, expectedOutput) {
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  // console.log(testInput);
  const testResult = coreLogic(testInput);

  console.log("test results:", testResult);
  return assert(testResult, undefined);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let cycles = 0;
  let commands = [];
  for (let line of input) {
    let [action, value] = line.split(" ");
    let cycle = 1;
    value = _.toInteger(value);
    if (action === "noop") {
      cycles += 1;
    } else {
      cycle = 2;
      cycles += 2;
    }
    commands.push({ action, value, cycle });
  }

  // console.log(`# commands: ${commands.length}, # cycles: ${cycles}`);

  // reverse commands for exec
  _.reverse(commands);
  let currentCommand;
  let registerX = 1;
  let row = 0;
  let spritePos = calcSpritePos(row, registerX);
  let grid = [];
  for (let c = 0; c < cycles; c++) {
    // position sprite
    if (c % 40 === 0) {
      row = Math.floor(c / 40);
      spritePos = calcSpritePos(row, registerX);
      // console.log(registerX, row, spritePos);
    }
    // register value at the start of the cycle
    grid[c] = _.includes(spritePos, c) ? "#" : " ";

    // if prev command has been processed/there is no current command
    // take one from the queue
    if (!currentCommand) {
      currentCommand = commands.pop();
    }

    // console.log(`${c} | ${currentCommand}`);

    // process the cycle
    currentCommand.cycle -= 1;
    if (currentCommand.cycle === 0) {
      // take action
      let { action, value } = currentCommand;
      if (action === "addx") {
        registerX += value;
        spritePos = calcSpritePos(row, registerX);
      }
      currentCommand = null;
    }
  }

  // console.log(grid);
  let line = "";
  for (let i = 0; i < grid.length; i++) {
    if (i % 40 === 0) {
      console.log(line);
      line = "";
    }
    line += grid[i];
  }
  console.log(line);

  return;
}

function calcSpritePos(row, register) {
  let m = row * 40 + register;
  return [m - 1, m, m + 1];
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
