import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-6/1.in';
const testFilePath = 'day-6/1.test';


// make tree, traverse tree
// node: [ children ]

function makeTree(input) {
  return input.reduce((nodes, node) => {
    const [ parent, child ] = node.split(')');
    if (nodes[parent]) {
      nodes[parent].push(child);
    } else {
      nodes[parent] = [child];
    }
    return nodes;
  }, {})
}

function getOrbits(nodes, parent) {
  const children = nodes[parent];
  if (!children) {
    return 0; // return what?
  }

  // children.length;
  return children.reduce((count, node) => {
    return count + getOrbits(nodes, node);
  }, children.length);
}

function getAllOrbits(nodes) {
  return _.keys(nodes).reduce((count, node) => {
    return count + getOrbits(nodes, node)
  }, 0);
}

export function runTests() {
  const input = readInput(testFilePath);
  const nodes = makeTree(input);
  const testResult = getAllOrbits(nodes) === 42;
  console.log('test results:', testResult);
  return testResult;
}

export function exec() {
  const input = readInput(filePath);
  const nodes = makeTree(input);
  const output = getAllOrbits(nodes);
  console.log('output:', output);
  return output;
}