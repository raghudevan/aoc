import { parse } from "dotenv";
import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day11/puzzle.in";
const testFilePath = "2022/day11/test.in";

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
  return assert(testResult, 10605);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let monkeys = parseInput(input);

  // console.log(`operation`, monkeys[0].test(23));

  // game rounds; 20 rounds
  let gameRounds = 20;
  for (let round = 0; round < gameRounds; round++) {
    //console.log(monkeys);
    for (let monkey of monkeys) {
      // for every item that monkey has
      // 1. operate/inspect to find worry level
      // 2. div worry level by 3
      // 3. test to find which monkey to throw to
      // 4. throw to monkey
      // reverse to process items
      _.reverse(monkey.items);
      while (monkey.items.length) {
        let item = monkey.items.pop();

        // inspect & div worry by 3
        let worryLevel = monkey.operation(item);
        monkey.inspectCount += 1;

        // test
        let testResult = monkey.test(worryLevel) === 0;
        let throwTo = testResult ? monkey.ifTrue : monkey.ifFalse;

        // throw
        // console.log(`${item} -> ${worryLevel} is thrown to monkey ${throwTo}`);
        monkeys[throwTo].items.push(worryLevel);
      }
    }
    //console.log(monkeys);
  }

  monkeys = _.sortBy(monkeys, "inspectCount");
  let monkeyBusinessLevel =
    monkeys[monkeys.length - 1].inspectCount *
    monkeys[monkeys.length - 2].inspectCount;
  // console.log(monkeys, monkeyBusinessLevel);

  return monkeyBusinessLevel;
}

function parseInput(input) {
  let monkeys = [];
  let monkey = {};
  for (let line of input) {
    if (_.startsWith(line, "Monkey")) {
      if (!_.isEmpty(monkey)) {
        // push prev monkey into list
        monkey.inspectCount = 0;
        monkeys.push(monkey);
        monkey = {};
      }
    }

    let [, items] = line.match(/\s+Starting items:\s(.*)/) || [];
    let [, operation] = line.match(/\s+Operation:\snew\s=\s(.*)/) || [];
    let [, test] = line.match(/\s+Test:\s(.*)/) || [];
    let [, ifTrue] = line.match(/\s+If true:\sthrow\sto\smonkey\s(\d+)/) || [];
    let [, ifFalse] =
      line.match(/\s+If false:\sthrow\sto\smonkey\s(\d+)/) || [];

    if (items) {
      monkey.items = items.split(", ").map((i) => _.toInteger(i));
    }
    if (operation) {
      monkey.operation = (old) =>
        Math.floor(eval(operation.replace(/(old)/, old)) / 3);
    }
    if (test) {
      monkey.test = (n) => eval(test.replace(/(divisible by)/, `${n} %`));
    }
    if (ifTrue) {
      monkey.ifTrue = _.toInteger(ifTrue);
    }
    if (ifFalse) {
      monkey.ifFalse = _.toInteger(ifFalse);
    }
  }

  // final monkey
  monkey.inspectCount = 0;
  monkeys.push(monkey);

  return monkeys;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
