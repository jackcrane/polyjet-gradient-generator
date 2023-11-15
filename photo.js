import { paintSolidColor } from "./lib/paintSolidColor.js";
import { randomBetween } from "./lib/randomBetween.js";
import { createCanvas, loadImage } from "canvas";
import config from "./config.json" assert { type: "json" };
import fs from "fs";
import sizeOf from "image-size";
fs.rmSync("./output", { recursive: true });
fs.mkdirSync("./output");

const photo = fs.readFileSync("./IMG_1480.png");
const { height, width } = sizeOf(photo);

const finalWidth = 600;
const finalHeight = (finalWidth / width) * height;

const photoCanvas = createCanvas(finalWidth, finalHeight);
const photoCtx = photoCanvas.getContext("2d");

const image = await loadImage(photo);
photoCtx.drawImage(image, 0, 0, finalWidth, finalHeight);

const drawPhoto = (i, randholder, ctx, canvas) => {
  const startTime = Date.now();
  for (let i = 0; i < finalWidth; i += config.resolution) {
    for (let j = 0; j < finalHeight; j += config.resolution) {
      const color = photoCtx.getImageData(i, j, 1, 1).data;
      paintSolidColor(randholder, ctx, {
        startX: i,
        startY: j,
        width: config.resolution,
        height: config.resolution,
        color,
        colorMode: "rgb",
      });
    }
  }

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`./output/${i}.png`, buffer);

  const endTime = Date.now();
  console.log(`Frame ${i} took ${endTime - startTime}ms`);
};

const main = (i = 0) => {
  const canvas = createCanvas(finalWidth, finalHeight);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.filter = "url(#crisp)";
  ctx.antialias = "none";

  const randholder = Array.from({ length: finalWidth }, () =>
    Array.from({ length: finalHeight }, () => randomBetween())
  );

  drawPhoto(i, randholder, ctx, canvas);
};
main(1);
