const overallTimeStart = new Date();
const { createCanvas } = require("canvas");
const fs = require("fs");
const importTime = new Date();

fs.rmSync("./output", { recursive: true });
fs.mkdirSync("./output");
const cleanupTime = new Date();

const config = { x: 600, y: 600, density: 1, layers: 1 };

const canvas = createCanvas(config.x, config.y);
const ctx = canvas.getContext("2d");
const canvasTime = new Date();

const randomBetween = (min = 0, max = 1) => Math.random() * (max - min) + min;
const bezier = (t, p0, p1, p2, p3) => {
  const oneMinusT = 1 - t;
  return (
    Math.pow(oneMinusT, 3) * p0 +
    3 * Math.pow(oneMinusT, 2) * t * p1 +
    3 * oneMinusT * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
};

const main = (i = 0, returnBuffer = false, bezierConfig) => {
  const starttime = new Date();

  let p0, p1, p2, p3;

  if (bezierConfig && bezierConfig.length === 4) {
    p0 = bezierConfig[0];
    p1 = bezierConfig[1];
    p2 = bezierConfig[2];
    p3 = bezierConfig[3];
  } else {
    p0 = 1;
    p1 = 1;
    p2 = 1;
    p3 = 1;
  }

  const randholder = Array.from({ length: config.x }, () =>
    Array.from({ length: config.y }, () =>
      bezier(randomBetween(), p0, p1, p2, p3)
    )
  );

  const randholderTime = new Date();

  for (let row = 0; row < config.y; row++) {
    const rowProgress = row / config.y;

    for (let col = 0; col < config.x; col++) {
      if (rowProgress > randholder[col][row]) {
        ctx.fillStyle = "#0089a6";
        ctx.fillRect(col, row, config.density, config.density);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(col, row, config.density, config.density);
      }
    }
  }

  const drawTime = new Date();

  const buffer = canvas.toBuffer("image/png");
  if (returnBuffer) return buffer;

  fs.writeFileSync(`./output/slice_${String(i).padStart(3, "0")}.png`, buffer);

  const endtime = new Date();
  const time = endtime - starttime;
  console.log(
    `saved ${i}.png in ${time} ms. [rand, draw, export] [${
      randholderTime - starttime
    }ms, ${drawTime - randholderTime} ms, ${endtime - drawTime} ms] [${
      randholderTime - starttime
    } ${drawTime - randholderTime} ${endtime - drawTime}]`
  );
};

const loop = (bezierConfig = [0, 0, 1, 1]) => {
  for (let i = 0; i < config.layers; i++) {
    main(i, false);
  }
};

const overallTimeEnd = new Date();
const overallTime = overallTimeEnd - overallTimeStart;
console.log(`finished in ${overallTime} ms (${overallTime / 1000} s)`);

module.exports = { main, loop };
