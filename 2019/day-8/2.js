import _ from 'lodash';
import { readInput, writeToFile } from '../utils';

const filePath = 'day-8/1.in';
const testFilePath = 'day-8/2.test';

function makeImage(output, width) {
  console.log(output.length)
  let line = 0;
  const op = output.reduce((lines, o, index) => {
    if (lines[line]) {
      lines[line].push(o);
    } else {
      lines[line] = [o];
    }

    if ((index + 1) % width === 0) {
      lines[line] = lines[line].join('');
      line++
    }
    return lines;
  }, []);

  // LBRCE
  writeToFile(op.join('\n'), 'day-8/2.out');
}

function decodeImage(input, width, height) {
  const imageLayers = parseImagePixels(input, width, height);
  // 0 -> black | 1 -> white | 2 -> transparent
  // --
  // 0 -> z (depth downwards)
  // 1 -> y (height downwards)
  // 2 -> x (width to the right)
  // console.log(imageLayers);
  const layers = imageLayers.length;
  let finalImage = []
  for (let x = 0; x < width; x++ ) {
    for (let y = 0; y < height; y++) {
      if (!finalImage[y]) {
        finalImage[y] = [];
      }
      if (!finalImage[y][x]) {
        finalImage[y][x] = [];
      }
      for (let z = 0; z < layers; z++) {
        finalImage[y][x].push(imageLayers[z][y][x]);
      }
      finalImage[y][x] = finalImage[y][x].reduce((color, pixel) => color === 2 ? pixel : color);
    }
  }
  return _.flattenDeep(finalImage);
}

function parseImagePixels(pixels, width, height) {
  const images = [];
  let currentImage = 0;
  let currentRow = 0;
  return pixels.reduce((images, pixel, index) => {
    if (!images[currentImage]) {
      images[currentImage] = [];
    }

    if (images[currentImage][currentRow]) {
      images[currentImage][currentRow].push(pixel);
    } else {
      images[currentImage][currentRow] = [pixel];
    }

    if ((index + 1) % width === 0) {
      currentRow += 1;
    }

    if (currentRow + 1 > height) {
      currentImage += 1;
      currentRow = 0;
    }
    return images;
  }, images);
}

function formatTestInput(filePath) {
  return readInput(filePath)[0].split('').map(i => ~~i);
}

export function runTests() {
  const input = formatTestInput(testFilePath);
  const width = 2;
  const height = 2;
  const output = decodeImage(input, width, height);
  console.log(output);
  const testResult = _.isEqual(output, [0, 1, 1, 0]);
  console.log('test results:', testResult);
  return testResult;
}

export function exec() {
  const input = formatTestInput(filePath);
  const width = 25;
  const height = 6;
  const output = decodeImage(input, width, height);
  makeImage(output, width, height);
  console.log('output:', output);
  return output;
}