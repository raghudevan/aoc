import fs from "fs";
import path from "path";

import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const year = 2022;
const [, , day] = process.argv;

const templatePath = path.join(__dirname, "index.js");
const dayPath = path.join(__dirname, `../${year}/${day}`);
const sol1Path = path.join(dayPath, "1.js");
const sol2Path = path.join(dayPath, "2.js");
const testInputPath = path.join(dayPath, "test.input");
const puzzleInputPath = path.join(dayPath, "puzzle.input");

// create day folder under year
fs.mkdirSync(dayPath);

// read template
const template = (fs.readFileSync(templatePath) + "")
  .replace(/\{year\}/g, year)
  .replace(/\{day\}/g, day);

// copy template into day folder
fs.writeFileSync(sol1Path, template);
fs.writeFileSync(sol2Path, template);

fs.writeFileSync(testInputPath, "");

axios
  .get(
    `https://adventofcode.com/2022/day/${day.replace("day", "").trim()}/input`,
    {
      headers: {
        Cookie: `session=${process.env.AOC_SESSION}`,
      },
    }
  )
  .catch(() => ({
    data: "",
  }))
  .then((response) => fs.writeFileSync(puzzleInputPath, response.data))
  .finally(() => console.log(`template created at: ${dayPath}`));
