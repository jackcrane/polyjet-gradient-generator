import { hueToCMY } from "./lib/color.js";
import fs from "fs";

let cmyStandard = [];
let cmyPerceptual = [];

for (let i = 0; i < 360; i++) {
  cmyStandard.push(hueToCMY(i, "standard"));
  cmyPerceptual.push(hueToCMY(i, "perceptual"));
}

// Write to CSV
fs.writeFileSync(
  "cmyStandard.csv",
  cmyStandard.map((cmy) => cmy.join(",")).join("\n")
);
fs.writeFileSync(
  "cmyPerceptual.csv",
  cmyPerceptual.map((cmy) => cmy.join(",")).join("\n")
);
