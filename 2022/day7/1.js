import _ from "lodash";
import fs from "fs";
import { readInput } from "../../utils";

// 1. ensure file paths for input & tests are correct
const filePath = "2022/day7/puzzle.in";
const testFilePath = "2022/day7/test.in";

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
  return assert(testResult, 95437);
}

// 4. write the `coreLogic`; once this is done, you should be able
// to run your tests
function coreLogic(input) {
  let dir = { type: "dir", name: "/", size: 0, files: [] };
  let pwd = "";
  for (let line of input) {
    if (_.startsWith(line, "$")) {
      // command
      let [, command, path] = line.match(/^\$\s(.*?)(?:\s(.*))?$/);

      if (command === "cd") {
        if (path === "/") {
          // move to root
          pwd = "/";
        } else {
          let moves = path.split("/");
          pwd = moves.reduce((p, c) => {
            if (c === "..") {
              // move out
              p = p.replace(/(.*)\/.*/, "$1"); // greedy match till the last "/" but leave anything behind it out
              if (p === "") {
                p = `/${p}`;
              }
            } else {
              // move into
              p += `${_.endsWith(p, "/") ? "" : "/"}${c}`;
            }
            return p;
          }, pwd);
        }
        console.log(`moved into ${pwd}`);
      } else if (command === "ls") {
        // prep for files in dir
      }
    } else {
      // console.log(pwd, line);
      console.log(`found`, line);
      const [, dirName] = line.match(/^dir\s(.*)$/) || [];
      let [, fileSize, fileName] = line.match(/^(\d+)\s(.*)$/) || [];

      let item;
      if (dirName) {
        // found dir at path
        item = {
          type: "dir",
          name: dirName,
          size: 0,
          files: [],
        };
      } else {
        // found file at path
        item = {
          type: "file",
          name: fileName,
          size: _.toInteger(fileSize),
        };
      }

      let files = [];
      for (let path of pwd.split("/")) {
        if (path === "") {
          files = dir.files;
        } else {
          files = files.find((file) => file.name === path).files;
        }
      }
      files.push(item);
    }
  }

  let dirs = [];
  dir.size = getDirSize(dir, dirs);
  dirs.push({ name: dir.name, size: dir.size });
  fs.writeFileSync("2022/day7/dir.json", JSON.stringify(dir));
  console.log(dirs);

  const sumSize = dirs.reduce((sumSize, { name, size }) => {
    if (size <= 100000) {
      sumSize += size;
    }
    return sumSize;
  }, 0);

  return sumSize;
}

function getDirSize(dir, dirs) {
  let size = 0;
  for (let file of dir.files) {
    if (file.type === "dir") {
      file.size = getDirSize(file, dirs);
      dirs.push({ name: file.name, size: file.size });
      size += file.size;
    } else {
      size += file.size;
    }
  }
  return size;
}

// 5. finally, write the method which will exec your `coreLogic` to
// get the desired output. key in the desired output into the solutions page
export function exec() {
  const input = readInput(filePath);
  const output = coreLogic(input);

  // console.log(output)
  return output;
}
