import { createCanvas } from "canvas";
import config from "./config.json" assert { type: "json" };
import fs from "fs";
import { randomBetween } from "./lib/randomBetween.js";
import { paintSolidColor } from "./lib/paintSolidColor.js";
fs.rmSync("./output", { recursive: true });
fs.mkdirSync("./output");
fs.rmSync("./theo_output", { recursive: true });
fs.mkdirSync("./theo_output");

const drawColorWheel = (i, randholder, ctx, canvas) => {
  const layer = i;
  const startTime = Date.now();
  const cartesianToPolar = (x, y) => {
    const center = [config.x / 2, config.y / 2];
    const dx = x - center[0];
    const dy = y - center[1];
    const theta = Math.atan2(dy, dx);
    const r = Math.sqrt(dx * dx + dy * dy);
    return [theta, r];
  };

  const isPointInOval = (x, y) => {
    const centerX = config.x / 2;
    const centerY = config.y / 2;
    const radiusX = config.x / 2;
    const radiusY = config.y / 2;

    // Check if point is inside the oval
    return (
      Math.pow((x - centerX) / radiusX, 2) +
        Math.pow((y - centerY) / radiusY, 2) <=
      1
    );
  };

  const isPointInOvalPadding = (x, y) => {
    const padding = 20;
    const centerX = config.x / 2;
    const centerY = config.y / 2;
    const radiusX = config.x / 2 - padding;
    const radiusY = config.y / 2 - padding;

    // Check if point is inside the oval
    return (
      Math.pow((x - centerX) / radiusX, 2) +
        Math.pow((y - centerY) / radiusY, 2) <=
      1
    );
  };

  for (let i = 0; i < config.x; i += config.resolution) {
    for (let j = 0; j < config.y; j += config.resolution) {
      const pointIsInOval = isPointInOval(i, j);
      // const pointIsInOvalPadding = isPointInOvalPadding(i, j);
      const pointIsInOvalPadding = false;

      if (!pointIsInOval) {
        ctx.fillStyle = config.colors.void;
        ctx.fillRect(i, j, config.resolution, config.resolution);
      } else if (
        pointIsInOvalPadding &&
        !(layer < 10 || config.layers - layer < 10)
      ) {
        ctx.fillStyle = config.colors.white;
        ctx.fillRect(i, j, config.resolution, config.resolution);
      } else {
        const [theta, rad] = cartesianToPolar(i, j);
        const hue = ((theta / Math.PI + 1) / 2) * 360;
        // const hue = theta / (2 * Math.PI);

        // Adjust saturation calculation
        const edgeRadius = Math.min(
          config.x / 2 / Math.abs(Math.cos(theta)),
          config.y / 2 / Math.abs(Math.sin(theta))
        );
        // const saturation = Math.min(rad / edgeRadius, 1);
        const saturation = 1;

        const value = 1;

        paintSolidColor(randholder, ctx, {
          startX: i,
          startY: j,
          width: config.resolution,
          height: config.resolution,
          color: [hue, saturation, value],
          colorMode: "hsv",
        });

        // ctx.fillStyle = `hsl(${hue}, ${saturation * 100}%, ${value * 50}%)`;
        // ctx.fillRect(i, j, config.resolution, config.resolution);
      }
    }
  }

  const canvasToWrite = createCanvas(config.x * 2, config.y);
  const ctxToWrite = canvasToWrite.getContext("2d");
  ctxToWrite.imageSmoothingEnabled = false;
  ctxToWrite.filter = "url(#crisp)";
  ctxToWrite.antialias = "none";
  ctxToWrite.drawImage(canvas, 0, 0, config.x * 2, config.y);

  const buffer = canvasToWrite.toBuffer("image/png");
  fs.writeFileSync(`./output/slice_${String(i).padStart(3, "0")}.png`, buffer);
  // Write debug image
  if (true) {
    console.log("Writing debug image. Disable this to save time.");
    const originalBuffer = canvas.toBuffer("image/png");
    fs.writeFileSync(
      `./theo_output/original_slice_${String(i).padStart(3, "0")}.png`,
      originalBuffer
    );
  }

  const endTime = Date.now();
  console.log(
    `Finished slice ${i} in ${
      endTime - startTime
    }ms. Estimated time remaining: ${
      ((endTime - startTime) * (config.layers - i)) / 1000
    }s`
  );
};

const main = (i = 0) => {
  const canvas = createCanvas(config.x, config.y);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.filter = "url(#crisp)";
  ctx.antialias = "none";

  const randholder = Array.from({ length: config.x }, () =>
    Array.from({ length: config.y }, () => randomBetween())
  );
  drawColorWheel(i, randholder, ctx, canvas);
};

for (let i = 0; i < config.layers; i++) {
  main(i);
}
