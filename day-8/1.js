import _ from "lodash";
import { readInput } from "../utils";

const filePath = "day-8/1.in";
const testFilePath = "day-8/1.test";

function fewestZeros(input, width, height) {
  const image = parseImagePixels(input, width, height);
  const imageIndex = getIntCounts(image, 0);
  let minZeroCount = Infinity;
  let minLayer = -1;
  for (var layerIndex in imageIndex) {
    if (imageIndex[layerIndex] < minZeroCount) {
      minZeroCount = imageIndex[layerIndex];
      minLayer = layerIndex;
    }
  }

  const minLayerImage = image[minLayer];
  return intCountInImage(minLayerImage, 1) * intCountInImage(minLayerImage, 2);
}

function intCountInImage(image, int) {
  return image.reduce((count, imageRow) => {
    return (
      count +
      imageRow.reduce(
        (count, pixel) => (pixel === int ? (count += 1) : count),
        0
      )
    );
  }, 0);
}

function getIntCounts(images, int) {
  return images.reduce((imageIndex, image, index) => {
    imageIndex[index] = intCountInImage(image, int);
    return imageIndex;
  }, []);
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
  return readInput(filePath)[0]
    .split("")
    .map(i => ~~i);
}

export function runTests() {
  const input = formatTestInput(testFilePath);
  const width = 3;
  const height = 2;
  const output = fewestZeros(input, width, height);
  const testResult = output === 1;
  console.log("test results:", testResult);
  return testResult;
}

export function exec() {
  const input = formatTestInput(filePath);
  const width = 25;
  const height = 6;
  const output = fewestZeros(input, width, height);
  console.log("output:", output);
  return output;
}
