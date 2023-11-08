const { createCanvas } = require("canvas");
const fs = require("fs");
const config = require("./config.json");

const canvas = createCanvas(config.x, config.y);
const ctx = canvas.getContext("2d");

const COLORS = {
  cyan: [0, 255, 255], // [ 0, 0.9916666666666667, 0.008333333333333333 ]
  magenta: [255, 0, 255],
  yellow: [255, 255, 0],
};
const color = COLORS.magenta;

function rgbToHsv(r, g, b) {
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

  return [h, s, v];
}

function hueToCMY(hue) {
  hue = hue % 360; // Normalize the hue to be within 0-360 degrees
  let c = 0,
    m = 0,
    y = 0;

  if (hue < 60) {
    // Transition from red to yellow (magenta decreases)
    m = 1 - hue / 60;
    y = 1;
  } else if (hue < 180) {
    // Transition from yellow to cyan (yellow decreases, cyan increases)
    c = (hue - 60) / 120;
    y = 1 - c;
  } else if (hue < 300) {
    // Transition from cyan to magenta (cyan decreases, magenta increases)
    m = (hue - 180) / 120;
    c = 1 - m;
  } else {
    // Transition from magenta to red (yellow increases)
    y = (hue - 300) / 60;
    m = 1;
  }

  // Ensuring values are between 0 and 1
  c = Math.max(0, Math.min(1, c));
  m = Math.max(0, Math.min(1, m));
  y = Math.max(0, Math.min(1, y));

  return [c, m, y];
}

// console.log(hueToCMY(parseFloat(process.argv[2])));

const ratios = hueToCMY(config.color);
