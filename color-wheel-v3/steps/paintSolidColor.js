import { cartesianToPolar } from "../lib/cartesianToPolar.js";
import { config } from "../config.js";
import { hueToCmy } from "./hueToCMY.js";
import { rgbToHsv } from "./rgbToHsv.js";

export const paintSolidColor = (ctx, x, y) => {
  const [, radius] = cartesianToPolar(x, y);
  if (radius >= 250) {
    return;
  }

  const color = ctx.getImageData(x, y, 1, 1).data;
  let colorInHsv = rgbToHsv(...color);

  let [cyanThreshold, magentaThreshold, yellowThreshold] = hueToCmy(
    colorInHsv[0]
  );

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
  } else {
    const threshold = Math.random();
    if (threshold < cyanThreshold) {
      ctx.fillStyle = config.colors.cyan;
    } else if (threshold < magentaThreshold + cyanThreshold) {
      ctx.fillStyle = config.colors.magenta;
    } else if (threshold < yellowThreshold + magentaThreshold + cyanThreshold) {
      ctx.fillStyle = config.colors.yellow;
    } else {
      ctx.fillStyle = config.colors.clear;
    }
  }
  ctx.fillRect(x, y, 1, 1);
};
