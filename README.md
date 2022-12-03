# AoC

[Advent of Code](https://adventofcode.com) is a yearly event in which we solve problems for points. One problem is released daily and typically has multiple levels of difficulty (at least 2).

This repo hosts the solutions for multiple years and also a template for solving the problems with nodejs.

> Note: Most of the automated scaffolding creation only holds true for 2022 and onwards (so don't expect to be able to run the 2019 solutions)

To get started,

1. after logging into the [AoC website](https://adventofcode.com/), fetch the session cookie and put it into a `.env` file in the root so that the file looks like the below

```
AOC_SESSION=
```

2. create a directory for the year in which you're participating, say `2022/`
3. run `yarn template <day>` to create folders for each day's solution

```
yarn template day1
```

4. this will create the day's directory (`2022/day1`) and the directory will contain the following: `1.js`, `2.js`, `puzzle.input` & `test.input`

| file name      | purpose                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `*.js`         | the files meant to host your solutions, named after the parts to the problem                      |
| `test.input`   | meant to host your test data with which your solution is validated                                |
| `puzzle.input` | will hold the input for the day's problem, this is automatically fetched using your session token |

The template for the solutions (`*.js`) has the following methods `assert`, `runTests`, `coreLogic` & `exec`

| method name | purpose                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| assert      | define how your assertions will run                                                                                            |
| runTests    | tweak this method to invoke `coreLogic` to get an output which will be asserted against the `expectedOutput                    |
| coreLogic   | write the `coreLogic`; once this is done, you should be able to run your tests                                                 |
| exec        | write the method which will exec your `coreLogic` to get the desired output. key in the desired output into the solutions page |
