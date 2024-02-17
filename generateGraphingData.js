import { hueToCMY } from "./lib/color.js";
import fs from "fs";

let cmyStandard = [];
let cmyPerceptual = [];
let hueValues = [];

for (let i = 0; i < 360; i++) {
  cmyStandard.push(hueToCMY(i, "standard"));
  cmyPerceptual.push(hueToCMY(i, "perceptual"));
  hueValues.push(hueToCMY(i, "perceptualHueOnly"));
}

// Write to CSV
fs.writeFileSync(
  "cmy-standard.csv",
  cmyStandard.map((cmy, i) => i + "," + cmy.join(",")).join("\n")
);
fs.writeFileSync(
  "cmy-perceptual.csv",
  cmyPerceptual.map((cmy, i) => i + "," + cmy.join(",")).join("\n")
);
fs.writeFileSync(
  "perceptual-hue.csv",
  hueValues.map((cmy, i) => [i, cmy].join(",")).join("\n")
);
