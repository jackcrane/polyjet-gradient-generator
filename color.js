const { createCanvas } = require("canvas");
const fs = require("fs");

const targetColor = { r: 255, g: 102, b: 0 };
const canvasSize = 100;

const colors = [
  { r: 255, g: 255, b: 255 }, // White
  { r: 198, g: 0, b: 88 }, // Magenta
  { r: 240, g: 197, b: 0 }, // Yellow
  { r: 0, g: 137, b: 166 }, // Cyan
];

function getClosestColor(r, g, b) {
  let minDist = Infinity;
  let closestColor;

  colors.forEach((color) => {
    const dist = Math.sqrt(
      (color.r - r) ** 2 + (color.g - g) ** 2 + (color.b - b) ** 2
    );

    if (dist < minDist) {
      minDist = dist;
      closestColor = color;
    }
  });

  return closestColor;
}

function applyDithering(targetColor, size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const pixels = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      const oldColor = {
        r: pixels[idx],
        g: pixels[idx + 1],
        b: pixels[idx + 2],
      };

      const newColor = getClosestColor(oldColor.r, oldColor.g, oldColor.b);

      const redError = oldColor.r - newColor.r;
      const greenError = oldColor.g - newColor.g;
      const blueError = oldColor.b - newColor.b;

      pixels[idx] = newColor.r;
      pixels[idx + 1] = newColor.g;
      pixels[idx + 2] = newColor.b;

      for (let nx = -1; nx <= 1; nx++) {
        for (let ny = -1; ny <= 1; ny++) {
          if (nx === 0 && ny === 0) continue;

          const nidx = ((y + ny) * size + (x + nx)) * 4;
          if (nidx >= 0 && nidx < pixels.length) {
            const weight = getFloydSteinbergWeight(nx, ny);
            pixels[nidx] += redError * weight;
            pixels[nidx + 1] += greenError * weight;
            pixels[nidx + 2] += blueError * weight;
          }
        }
      }
    }
  }

  // Correct colors after error propagation
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const correctedColor = getClosestColor(
        pixels[idx],
        pixels[idx + 1],
        pixels[idx + 2]
      );
      pixels[idx] = correctedColor.r;
      pixels[idx + 1] = correctedColor.g;
      pixels[idx + 2] = correctedColor.b;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("dithered_image.png", buffer);
  console.log("Saved dithered_image.png");
}

function getFloydSteinbergWeight(x, y) {
  if (x === 1 && y === 0) return 7 / 16;
  if (x === -1 && y === 1) return 3 / 16;
  if (x === 0 && y === 1) return 5 / 16;
  if (x === 1 && y === 1) return 1 / 16;
  return 0;
}

applyDithering(targetColor, canvasSize);
