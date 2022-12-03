# AoC

[Advent of Code](https://adventofcode.com) is a yearly event in which we solve problems for points. One problem is released daily and typically has multiple levels of difficulty (at least 2).

This repos hosts the solutions for multiple years and also a template for solving the problems with nodejs. To get started, create a directory for the year in which you're participating and one folder each for the day e.g. `2022/day-1`. In this folder you'll create the main executable i.e. something like `1.js` and its corresponding input file `1.in`.

If you follow the template as is provided in `template.js` then each executable file should have the following methods `assert`, `runTests`, `coreLogic` & `exec`

| method name | purpose                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| assert      | define how your assertions will run                                                                                            |
| runTests    | tweak this method to invoke `coreLogic` to get an output which will be asserted against the `expectedOutput                    |
| coreLogic   | write the `coreLogic`; once this is done, you should be able to run your tests                                                 |
| exec        | write the method which will exec your `coreLogic` to get the desired output. key in the desired output into the solutions page |
