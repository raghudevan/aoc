import fs from "fs";
import path from "path";

const year = 2022;
const [, , day, problem] = process.argv;
console.log("running advent of code");
console.log(`day: ${day} | problem: ${problem}`);

const filePath = path.join(__dirname, `2022/${day}/${problem}.js`);
if (!fs.existsSync(filePath)) {
  console.log(
    `${filePath} doesn't exist; check if day & problem passed to yarn start command is correct!`
  );
  process.exit();
}

// import #day-#problemno.
const { exec, runTests } = require(`./${year}/${day}/${problem}`);

if (runTests()) {
  console.log("all tests pass!");
  // if all tests pass, then exec to get ans to solution
  const output = exec();
  console.log("output", output);
} else {
  console.log("tests dont pass");
}
