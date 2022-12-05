import fs from "fs";
import os from "os";
import path from "path";
import _ from "lodash";

// read input; single column, multiline, return as string values
export function readInput(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  let input = [];
  try {
    input = fs.readFileSync(fullPath).toString().replace(/\r/g, "").split("\n");
  } catch (e) {
    console.log("no file found", fullPath, e);
  }
  return input;
}

export function writeToFile(output, filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  try {
    fs.writeFileSync(fullPath, output);
  } catch (e) {
    console.log("unable to write file to", filePath);
  }
}
