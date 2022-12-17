import _ from "lodash";
import util from "util";
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
  return assert(testResult, 2713310158);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let { monkeys, primes } = parseInput(input);

  let gameRounds = 10000;
  for (let round = 0; round < gameRounds; round++) {
    // for every item that monkey has
    // 1. operate/inspect to find worry level
    // 2. div worry level by 3
    // 3. test to find which monkey to throw to
    // 4. throw to monkey
    for (let monkey of monkeys) {
      for (let itemIndex in monkey.items) {
        let {
          worryLevel: wl,
          id,
          item,
          distMap,
          // maps,
          // thrownTo,
        } = monkey.items[itemIndex];

        // inspect to find the wl
        // need to rehash the dist map
        // - new dist to each prime after operation
        monkey.inspectCount += 1;
        distMap = primes.reduce((p, c) => {
          p[c] = monkey.operation(distMap[c]) % _.toInteger(c);
          return p;
        }, {});

        // test
        let newWl = distMap[monkey.divBy];

        // if testResult -> true; return old value
        // if testResult -> false; return new value
        let throwTo = newWl === 0 ? monkey.ifTrue : monkey.ifFalse;

        // for debugging;
        // maps.push(distMap);
        // let audit = { wl, mod, throwTo, round: round + 1 };
        // if (thrownTo) {
        //   thrownTo.push(audit);
        // } else {
        //   thrownTo = [audit];
        // }

        // throw
        // console.log(
        //   `${item}(${wl}) -> ${newWl} is thrown to monkey ${throwTo}`
        // );
        monkeys[throwTo].items.push({
          worryLevel: newWl,
          id,
          item,
          distMap,
          // maps,
          // thrownTo,
        });
      }
      // all items have been processed, flush them before moving on
      monkey.items = [];
    }
  }

  // for debugging;
  // console.log(
  //   util.inspect(
  //     _.chain(monkeys)
  //       .flatMap(({ items }) => items)
  //       .sortBy("id")
  //       .value(),
  //     false,
  //     null,
  //     true
  //   )
  // );

  monkeys = _.sortBy(monkeys, "inspectCount");
  console.log(
    util.inspect(
      _.chain(monkeys)
        .map(({ inspectCount }) => inspectCount)
        .value(),
      false,
      null,
      true
    )
  );
  let monkeyBusinessLevel =
    monkeys[monkeys.length - 1].inspectCount *
    monkeys[monkeys.length - 2].inspectCount;

  // let items = _.chain(monkeys)
  //   .reduce((p, c) => {
  //     let { items } = c;
  //     Array.prototype.push.apply(p, items);
  //     return p;
  //   }, [])
  //   .sortBy("id")
  //   .value();
  // console.log(items);

  return monkeyBusinessLevel;
}

function parseInput(input) {
  let monkeys = [];
  let monkey = {};
  let itemHash = {};
  let itemCount = 0;
  let primes = [];
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
      items = items.split(", ").map((i) => _.toInteger(i));
      monkey.items = [];
      for (let item of items) {
        itemCount++;
        itemHash[item] = itemCount;
        monkey.items.push({
          worryLevel: item,
          item,
          id: itemHash[item],
          distMap: {},
        });
      }
    }
    if (operation) {
      // let oper = operation.replace(/(\*.*$)/, "* 1"); // replace all multiplications with *1
      monkey.operStr = operation;
      monkey.operation = (old) => eval(operation.replace(/(old)/, old));
    }
    if (test) {
      monkey.divBy = _.toInteger(test.replace(/divisible by/, ""));
      primes.push(monkey.divBy);
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

  // attach a dist map to each item
  // to keep track of how far
  // it is from the prime (div bys)
  _.chain(monkeys)
    .flatMap(({ items }) => items)
    .forEach((item) => {
      for (let prime of primes) {
        item.distMap[prime] = item.item % prime;
      }
      item.maps = [item.distMap];
    })
    .value();

  return { monkeys, primes };
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
