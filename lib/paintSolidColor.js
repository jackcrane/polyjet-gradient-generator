import config from "../config.json" assert { type: "json" };
import { hueToCMY, rgbToHsv } from "./color.js";

export const paintSolidColor = (
  randholder,
  ctx,
  _config = {
    startX: 0,
    startY: 0,
    width: config.x,
    height: config.y,
    color: config.color,
    colorMode: "rgb",
  }
) => {
  const { startX, startY, width, height, color, colorMode } = _config;
  let colorInHsv;
  if (colorMode === "rgb") {
    colorInHsv = rgbToHsv(...color);
  } else if (colorMode === "hsv") {
    colorInHsv = color;
  }

  const [cyanThreshold, magentaThreshold, yellowThreshold] = hueToCMY(
    colorInHsv[0],
    "icc"
  );

  // if (cyanThreshold + magentaThreshold + yellowThreshold !== 1) {
  //   throw new Error(
  //     `Thresholds must add up to 1. Received ${cyanThreshold}, ${magentaThreshold}, ${yellowThreshold}. Hue passed in: ${colorInHsv.join(
  //       ","
  //     )}`
  //   );
  // }

  // Calculate the ending x and y coordinates based on the starting point and dimensions
  const endX = startX + width;
  const endY = startY + height;

  for (let row = startY; row < endY && row < config.y; row++) {
    for (let col = startX; col < endX && col < config.x; col++) {
      const whiteThreshold = Math.random();
      if (whiteThreshold > colorInHsv[1]) {
        const blackThreshold = Math.random();
        if (blackThreshold > colorInHsv[2]) {
          const randomNumberThreshold = Math.random();
          if (randomNumberThreshold < 0.33) {
            ctx.fillStyle = config.colors.cyan;
          } else if (randomNumberThreshold < 0.66) {
            ctx.fillStyle = config.colors.magenta;
          } else {
            ctx.fillStyle = config.colors.yellow;
          }
        } else {
          ctx.fillStyle = config.colors.white;
        }
        ctx.fillRect(col, row, config.density, config.density);
      } else {
        if (randholder[col][row] < cyanThreshold) {
          ctx.fillStyle = config.colors.cyan;
          ctx.fillRect(col, row, config.density, config.density);
        } else if (randholder[col][row] < magentaThreshold + cyanThreshold) {
          ctx.fillStyle = config.colors.magenta;
          ctx.fillRect(col, row, config.density, config.density);
        } else if (
          randholder[col][row] <
          yellowThreshold + magentaThreshold + cyanThreshold
        ) {
          ctx.fillStyle = config.colors.yellow;
          ctx.fillRect(col, row, config.density, config.density);
        } else {
          ctx.fillStyle = config.colors.clear;
          ctx.fillRect(col, row, config.density, config.density);
        }
      }
    }
  }
};
