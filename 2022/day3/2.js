import _ from "lodash";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day3/2.in";
const testFilePath = "2022/day3/2.test";

// 2. define how your assertions will run
function assert(input, expectedOutput) {
  const output = coreLogic(input);
  return output === expectedOutput;
}

// 3. tweak this method to invoke `coreLogic` to get an output
// which will be asserted against the `expectedOutput`
export function runTests() {
  const testInput = readInput(testFilePath);

  // console.log(testInput);
  return assert(testInput, 70);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  const doubles = [];
  let sumPrio = 0;
  for (let e = 0; e < input.length; e += 3) {
    let itemHash = {};
    if (e % 3 === 0) {
      let e1 = input[e];
      let e2 = input[e + 1];
      let e3 = input[e + 2];

      parseBag(e1, "e1", itemHash);
      parseBag(e2, "e2", itemHash);
      parseBag(e3, "e3", itemHash);

      const repeat = getRepeat(itemHash);
      doubles.push(repeat);
      const [item] = repeat;
      sumPrio += charCode(item);
    }
  }

  // console.log(doubles);
  return sumPrio;
}

function parseBag(bag, bagid, itemHash) {
  for (let i = 0; i < bag.length; i++) {
    if (itemHash[bag[i]]) {
      itemHash[bag[i]][bagid] = 1;
    } else {
      itemHash[bag[i]] = { [bagid]: 1 };
    }
  }
  return itemHash;
}

function getRepeat(itemHash) {
  //console.log(itemHash);
  return _.chain(itemHash)
    .toPairs()
    .find(([item, bagStat]) => {
      return (
        _.chain(bagStat)
          .values()
          .reduce((p, c) => {
            p += c;
            return p;
          }, 0)
          .value() === 3
      );
    })
    .value();
}

function charCode(char) {
  if (char) {
    const code = char.charCodeAt();
    if (code >= 97 && code <= 122) {
      // lower case
      return code - 96;
    } else {
      return code - 38;
    }
  }
  return 0;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  console.log(output);
  return output;
}
