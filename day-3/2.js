import _ from 'lodash';
import { readInput } from '../utils';

// learnings: when dealing with graph problems, check if you can just traverse and
// leave behind "counters" (dynamic program?)
const filePath = 'day-3/2.in';
const testFilePath = 'day-3/2.test';

function getDirNMag(vector) {
  const [ , direction, magnitude ] = vector.match(/([UDRL])(\d+)/);
  return { direction, magnitude: ~~magnitude };
}

function checkIfIntersection(grid, x, y) {
  // console.log(_.get(grid, `${x}.${y}`));
  return !_.isNil(_.get(grid, `${x}.${y}.wireA`)) &&
    !_.isNil(_.get(grid, `${x}.${y}.wireB`));
}

function setCell(grid, x, y, x1, y1, wire, intersections) {
  let cellValue = _.get(grid, `${x}.${y}.${wire}`, 0);
  _.set(grid, `${x1}.${y1}.${wire}`, cellValue + 1);
  if (checkIfIntersection(grid, x1, y1)) {
    intersections.push(_.get(grid, `${x1}.${y1}`));
  }
  return grid;
}

function traversePath(grid, coords, intersections, vector, wire) {
  const { direction, magnitude } = getDirNMag(vector);
  let { x, y } = coords;
  let x1 = x, y1 = y;
  switch (direction) {
    case 'U':
      y1 = y + magnitude;
      for(; y + 1 <= y1; y++) {
        setCell(grid, x1, y, x1, y+1, wire, intersections);
      }
      // console.log(`going up by ${magnitude}`, grid);
      break;
    case 'D':
      y1 = y - magnitude;
      for (; y - 1 >= y1; y--) {
        setCell(grid, x1, y, x1, y-1, wire, intersections);
      }
      // console.log(`going down by ${magnitude}`, grid);
      break;
    case 'R':
      x1 = x + magnitude;
      for(; x + 1 <= x1; x++) {
        setCell(grid, x, y1, x+1, y1, wire, intersections);
      }
      // console.log(`going right by ${magnitude}`, grid);
      break;
    case 'L':
      x1 = x - magnitude;
      for(; x - 1 >= x1; x--) {
        setCell(grid, x, y1, x-1, y1, wire, intersections);
      }
      // console.log(`going left by ${magnitude}`, grid);
      break;
  }
  return { grid, coords: { x: x1, y: y1 }, intersections };
}

function traverseWirePathings(wirePathings) {
  wirePathings = wirePathings.split('|');
  const vectorsForWireA = wirePathings[0].split(',')
  const vectorsForWireB = wirePathings[1].split(',')
  let { grid, coords, intersections } = vectorsForWireA.reduce(({ grid, coords, intersections }, vector) => {
    return traversePath(grid, coords, intersections, vector, 'wireA')
  }, { grid: [], coords: { x: 0, y: 0 }, intersections: [] });

  ({ grid, coords } = vectorsForWireB.reduce(({ grid, coords, intersections }, vector) => {
    return traversePath(grid, coords, intersections, vector, 'wireB')
  }, { grid, coords: { x: 0, y: 0 }, intersections }));

  return intersections;
}

function getMinStepDist(wirePathings) {
  const intersections = traverseWirePathings(wirePathings);
  return intersections.reduce((minDist, { wireA, wireB }) => {
    const dist = wireA + wireB;
    if (dist < minDist) {
      return dist;
    }
    return minDist;
  }, Infinity);
}

export function runTests() {
  const inputs = readInput(testFilePath);
  const testResult = inputs.every(input => {
    const [ wirePathings, expectedOutput ] = input.split(' ');
    return getMinStepDist(wirePathings) === ~~expectedOutput;
  });
  console.log('test result:', testResult);
  return testResult;
}

export function exec() {
  const inputs = readInput(filePath);
  const output = getMinStepDist(inputs.join('|'));
  console.log(output);
  return output;
}
