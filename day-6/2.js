import _ from 'lodash';
import { readInput } from '../utils';

const filePath = 'day-6/1.in';
const testFilePath = 'day-6/2.test';

function makeChildHash(input) {
  return input.reduce((nodes, node) => {
    const [ parent, child ] = node.split(')');
    nodes[child] = parent;
    return nodes;
  }, {});
}

function makeTree(input, childHash) {
  return input.reduce((nodes, node) => {
    const [ parent, child ] = node.split(')');
    if (nodes[parent]) {
      nodes[parent].children.push(child);
    } else {
      nodes[parent] = { parent: childHash[parent], children: [child] };
    }
    return nodes;
  }, {});
}

function parse(nodes, childHash, node, count, output) {
  if (_.isNil(output[node])) {
    output[node] = _.isNil(output[childHash[node]]) ? count : (output[childHash[node]] + 1);
  }

  if (nodes[node]) {
    const { parent, children } = nodes[node];
    const nextSet = [];
    if (parent) {
      nextSet.push(parent)
    }

    if (children) {
      Array.prototype.push.apply(nextSet, children.filter(c => _.isNil(output[c])));
    }

    // console.log(nextSet, output)
    nextSet.forEach(n => {
      parse(nodes, childHash, n, count + 1, output);
    });
    return output;

  } else {
    const nextNode = childHash[node];
    return parse(nodes, childHash, nextNode, count + 1, output);
  }
}

export function runTests() {
  const input = readInput(testFilePath);
  const childHash = makeChildHash(input);
  const nodes = makeTree(input, childHash);
  // console.log(nodes, childHash);
  const dists = parse(nodes, childHash, 'SAN', 0, {});
  const testResult = dists['YOU'] - 2 === 4;
  console.log('test results:', testResult);
  return testResult;
}

export function exec() {
  const input = readInput(filePath);
  const childHash = makeChildHash(input);
  const nodes = makeTree(input, childHash);
  const dists = parse(nodes, childHash, 'SAN', 0, {});
  const output = dists['YOU'] - 2;
  console.log('output:', output);
  return output;
}