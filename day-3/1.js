import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-3/1.in';
const testFilePath = 'day-3/1.test';

const dirMultHash = {
  U: 1,
  D: -1,
  R: 1,
  L: -1,
};

function getDirNMag(vector) {
  const [ , direction, magnitude ] = vector.match(/([UDRL])(\d+)/);
  return { direction, magnitude: ~~magnitude };
}

function minMax(value, min, max) {
  if (value < min) {
    return [ value, max ];
  } else if (value > max) {
    return [ min, value ];
  }
  return [ min, max ];
}

function wirePathing(vectors) {
  const { paths } = vectors.split(',').reduce(({ coords, paths }, vector) => {
    return getPathsForVector(coords, vector, paths);
  }, { coords: { x: 0, y: 0 }, paths: {} });
  // console.log(paths);
  return paths;
}

function getPathsForVector(coords, vector, paths) {
  let { x, y } = coords;
  let min, max;
  const { direction, magnitude } = getDirNMag(vector);
  const delta = magnitude * dirMultHash[direction];
  switch (direction) {
    case 'U':
    case 'D':
      // +/- y
      ([ min, max ] = _.get(paths, `x.'${x}'`, [ y, y ]));
      y = y + delta;
      _.set(paths, `x.'${x}'`, minMax(y, min, max));
      break;
    case 'R':
    case 'L':
      // +/- x
      ([ min, max ] = _.get(paths, `y.'${y}'`, [ x, x ]));
      x = x + delta;
      _.set(paths, `y.'${y}'`, minMax(x, min, max));
      break;
  }
  /* console.log(direction, magnitude);
  console.log(x, y, paths);
  console.log('---') */
  return { coords: { x, y }, paths };
}

function inRange(value, [min, max]) {
  value = getInt(value);
  return min <= value && value <= max;
}

function getInt(x) {
  return ~~x.replace(/'/g, '');
}

function manDist(x, y) {
  return Math.abs(getInt(x)) + Math.abs(getInt(y));
}

function getMinDistFromIntersections(x, y) {
  let minDist = Infinity;
  for (let xpair of _.toPairs(x)) {
    const [ x, xrange ] = xpair;
    for (let ypair of _.toPairs(y)) {
      const [ y, yrange ] = ypair;
      if (inRange(x, yrange) && inRange(y, xrange)) {
        let dist = manDist(x, y);
        if (dist < minDist && dist !== 0) {
          minDist = dist;
        }
      }
    }
  }
  return minDist;
}

function getMinDist(wirePathings) {
  wirePathings = wirePathings.split('|');
  const { x: x1, y: y1 } = wirePathing(wirePathings[0]);
  const { x: x2, y: y2 } = wirePathing(wirePathings[1]);
  const output = Math.min(getMinDistFromIntersections(x1, y2), getMinDistFromIntersections(x2, y1));
  return output;
}

export function runTests() {
  const inputs = readInput(testFilePath);
  const testResult = inputs.every(input => {
    const [ wirePathings, expectedOutput ] = input.split(' ');
    return getMinDist(wirePathings) === ~~expectedOutput
  });
  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const inputs = readInput(filePath);
  const output = getMinDist([inputs[0], inputs[1]].join('|'));
  console.log(output);
  return output;
}
