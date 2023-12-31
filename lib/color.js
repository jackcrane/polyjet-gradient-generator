import config from "../config.json" assert { type: "json" };
import fs from "fs";
const DATA_FILES = {
  StratasysCMY: "./lib/StratasysCMY.csv",
  StratasysPureWhiteCMYW: "./lib/StratasysPureWhiteCMYW.csv",
  MatlabCMYK: "./lib/MatlabCMYK.csv",
  StratasysTavorXrite: "./lib/StratasysTavorXrite.csv",
};
// const StratasysCMYFile = fs.readFileSync("./lib/StratasysCMY.csv", "utf8");
const StratasysCMYFile = fs.readFileSync(
  DATA_FILES.StratasysTavorXrite,
  "utf8"
);
const StratasysCMY = StratasysCMYFile.split("\n").map((line) =>
  line.split(",").map((value) => parseFloat(value))
);

export const rgbToHsv = (r, g, b) => {
  (r /= 255), (g /= 255), (b /= 255);

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s, v];
};

const hueToCmyStandardImplementation = (hue) => {
  hue = hue % 360; // Normalize the hue to be within 0-360 degrees
  let c = 0,
    m = 0,
    y = 0;

  if (hue < 60) {
    c = 0;
    m = ((60 - hue) / 60) * 0.5;
    y = 1 - m;
  } else if (hue < 180) {
    m = 0;
    y = (180 - hue) / 120;
    c = 1 - y;
  } else if (hue < 300) {
    c = (300 - hue) / 120;
    m = 1 - c;
    y = 0;
  } else {
    m = (420 - hue) / 120;
    y = 1 - m;
    c = 0;
  }

  // Ensuring values are between 0 and 1
  c = Math.max(0, Math.min(1, c));
  m = Math.max(0, Math.min(1, m));
  y = Math.max(0, Math.min(1, y));

  return [c, m, y];
};

const hueToCmyIccImplementation = (hue) => {
  const hueIndex = Math.round((hue / 360) * 255);
  // console.log(StratasysCMY[hueIndex]);
  return [
    StratasysCMY[hueIndex][0],
    StratasysCMY[hueIndex][1],
    StratasysCMY[hueIndex][2],
  ];
};

export const hueToCMY = (hue, method = "standard") => {
  if (method === "standard") {
    return hueToCmyStandardImplementation(hue);
  } else if (method === "icc") {
    return hueToCmyIccImplementation(hue);
  }
};

// Helper function to round numbers to a specific number of decimal places
const roundTo = (num, decimals) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};
