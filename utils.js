import fs from 'fs';
import os from 'os';
import path from 'path';

// read input; single column, multiline, return as string values
export function readInput(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  let input = [];
  try {
    input = fs
      .readFileSync(fullPath)
      .toString()
      .split(os.EOL);
  } catch (e) {
    console.log('no file found', fullPath);
  }
  return input;
}
