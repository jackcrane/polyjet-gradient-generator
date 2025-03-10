import sharp from "sharp";
import fs from "fs";
import path from "path";
import chalk from "chalk";

// Folder containing images
const layersDir = "layers";

// Function to calculate statistics
const calculateStats = (counts) => {
  const values = Object.values(counts);
  if (values.length === 0) return { avg: 0, median: 0, min: 0, max: 0 };

  values.sort((a, b) => a - b);
  const total = values.reduce((sum, val) => sum + val, 0);
  const avg = total / values.length;
  const median =
    values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];

  return {
    avg: Math.round(avg),
    median,
    min: values[0],
    max: values[values.length - 1],
  };
};

// Function to process an image
const countPixelsByColor = async (imagePath) => {
  try {
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorCounts = new Map();
    const pixelSize = info.channels;

    for (let i = 0; i < data.length; i += pixelSize) {
      const colorKey = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
    }

    const counts = Object.fromEntries(colorCounts);
    const stats = calculateStats(counts);

    console.clear();
    console.log(chalk.bold(`Processing: ${path.basename(imagePath)}`));

    // Sort colors by count and display top 10
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([color, count]) => {
        const [r, g, b] = color.split(",").map(Number);
        const textColor =
          r === 0 && g === 0 && b === 0
            ? chalk.white.bgBlack
            : chalk.rgb(r, g, b);
        console.log(textColor(`█ ${color}: ${count}`));
      });

    return stats;
  } catch (error) {
    console.error("Error processing image:", error);
  }
};

// Function to process all images and display a summary
const processAllImages = async () => {
  const files = fs
    .readdirSync(layersDir)
    .filter((file) => /\.(png|jpg|jpeg)$/i.test(file));
  const allStats = [];

  for (const file of files) {
    const stats = await countPixelsByColor(path.join(layersDir, file));
    allStats.push({ file, ...stats });
  }
};

// Run the script
processAllImages();

export const check = processAllImages;
