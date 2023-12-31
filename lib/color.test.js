import chalk from "chalk";
import { hueToCMY } from "./color.js";
import fs from "fs";

const assert = (condition, message, result) => {
  if (!condition) {
    console.log(chalk.red(`Failed: ${message} Got ${result}`));
  } else {
    console.log(chalk.green(`Passed: ${message}`));
  }
};

const test = (deg, expected) => {
  const result = hueToCMY(deg);
  assert(
    JSON.stringify(result) === JSON.stringify(expected),
    `Expected ${deg} to be ${expected}`,
    result
  );
};

// test(0, [0, 0.5, 0.5]);
// test(30, [0, 0.25, 0.75]);
// test(60, [0, 0, 1]);
// test(90, [0.25, 0, 0.75]);
// test(180, [1, 0, 0]);
// test(300, [0, 1, 0]);
// test(330, [0, 0.75, 0.25]);
// test(360, [0, 0.5, 0.5]);

const writeToCsvLogFile = (message) => {
  fs.appendFileSync("./test.csv", `${message}\n`);
};

const roundToThousands = (num) => {
  return Math.round(num * 1000) / 1000;
};

for (let i = 0; i < 360; i++) {
  const result = hueToCMY(i);
  writeToCsvLogFile(
    `${i},${roundToThousands(result[0])},${roundToThousands(
      result[1]
    )},${roundToThousands(result[2])}`
  );
}
/*

0 [ 0, .5, .5 ]
60 [ 0, 0, 1  ]
180 [ 1, 0, 0 ]
300 [ 0, 1, 0 ]
360 [ 0, .5, .5 ]

*/
