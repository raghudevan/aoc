// import #day-#problemno.
import { exec, runTests } from "./2022/day3/2";

console.log("running advent of code");
if (runTests()) {
  console.log("all tests pass");
  // if all tests pass, then exec to get ans to solution
  exec();
}
