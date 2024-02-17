import config from "../config.json" assert { type: "json" };
import fs from "fs";
const DATA_FILES = {
  StratasysCMY: "./profiles/StratasysCMY.csv",
  StratasysPureWhiteCMYW: "./lib/StratasysPureWhiteCMYW.csv",
  MatlabCMYK: "./profiles/MatlabCMYK.csv",
  StratasysTavorXrite: "./profiles/StratasysTavorXrite.csv",
  StratasysPerceptual: "./profiles/Perceptual1mm.csv",
  Colorimetric: "./profiles/Colorimetric1mm.csv",
};
// const StratasysCMYFile = fs.readFileSync("./lib/StratasysCMY.csv", "utf8");
const StratasysCMYFile = fs.readFileSync(
  DATA_FILES.StratasysPureWhiteCMYW,
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

const hueToCmyPerceptualImplementation = (hue) => {
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

  // Perceptual adjustment based on a simplified model of visual sensitivity to colors
  // This could be further refined with a more accurate perceptual model
  c = Math.pow(c, 0.9); // Adjust Cyan
  m = Math.pow(m, 0.9); // Adjust Magenta
  y = Math.pow(y, 0.85); // Adjust Yellow to make it slightly brighter, mimicking higher sensitivity

  // Ensuring values are between 0 and 1
  c = Math.max(0, Math.min(1, c));
  m = Math.max(0, Math.min(1, m));
  y = Math.max(0, Math.min(1, y));

  return [c, m, y];
};

const hueToCmyIccImplementation = (hue) => {
  const hueIndex = Math.round((hue / 360) * 255);
  // console.log(StratasysCMY[hueIndex]);
  const rawResults = [
    StratasysCMY[hueIndex][0],
    StratasysCMY[hueIndex][1],
    StratasysCMY[hueIndex][2],
  ];

  const total = rawResults.reduce((a, b) => a + b, 0);

  const results = rawResults.map((value) => value / total);

  return results;
};

const hueToRgb = (hue) => {
  let R = 0,
    G = 0,
    B = 0;
  let sector = hue / 60;
  let chroma = 1; // Chroma is the difference between the maximum and minimum values of RGB components, set to max here for simplicity
  let x = chroma * (1 - Math.abs((sector % 2) - 1));

  if (sector < 1) {
    R = chroma;
    G = x;
  } else if (sector < 2) {
    R = x;
    G = chroma;
  } else if (sector < 3) {
    G = chroma;
    B = x;
  } else if (sector < 4) {
    G = x;
    B = chroma;
  } else if (sector < 5) {
    R = x;
    B = chroma;
  } else if (sector <= 6) {
    R = chroma;
    B = x;
  }

  // Convert to 0-255 scale assuming maximum brightness
  R = Math.round(255 * R);
  G = Math.round(255 * G);
  B = Math.round(255 * B);

  return [R, G, B];
};

const applyPerceptualAdjustment = (r, g, b) => {
  const newR = r * 0.299;
  const newG = g * 0.587;
  const newB = b * 0.112;

  return [newR, newG, newB];
};

const rgbToHue = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta === 0) {
    return 0;
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  return h;
};

export const hueToCMY = (hue, method = "standard") => {
  if (method === "standard") {
    return hueToCmyStandardImplementation(hue);
  } else if (method === "icc") {
    return hueToCmyIccImplementation(hue);
  } else if (method === "perceptual") {
    const rgb = hueToRgb(hue);
    const adjustedRgb = applyPerceptualAdjustment(...rgb);
    const newHue = rgbToHue(...adjustedRgb);
    return hueToCmyPerceptualImplementation(newHue);
  } else if (method === "perceptualHueOnly") {
    const rgb = hueToRgb(hue);
    const adjustedRgb = applyPerceptualAdjustment(...rgb);
    const newHue = rgbToHue(...adjustedRgb);
    return newHue;
  }
};

// Helper function to round numbers to a specific number of decimal places
const roundTo = (num, decimals) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};
