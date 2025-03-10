import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { config } from "../config.js";
import { loadImage } from "canvas";

export const applyICCProfile = async (ctx, canvas) => {
  const tempInputPath = "./input.jpg";
  const tempOutputPath = "./output.jpg";

  try {
    // Save the canvas to a file
    const buf = canvas.toBuffer("image/jpeg", { quality: 1 });
    fs.writeFileSync(tempInputPath, buf);

    // Apply ICC profile processing
    const newbuf = await internal_applyICCProfile(
      // "./Stratasys_J750_Vivid_CMY_1mm.icm",
      "./Tavor_Xrite_i1Profiler_VividCMYW.icc",
      tempInputPath,
      tempOutputPath
    );

    // Save processed buffer to a file
    fs.writeFileSync(tempOutputPath, newbuf);

    // Load processed image and draw to canvas context
    const img = await loadImage(tempOutputPath);
    ctx.drawImage(img, 0, 0);

    // Clean up temporary files
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);
  } catch (error) {
    console.error("Error processing image:", error);
  }
};

const internal_applyICCProfile = (
  iccProfilePath,
  tempInputPath,
  tempOutputPath
) => {
  return new Promise((resolve, reject) => {
    execFile(
      "jpgicc",
      ["-o", iccProfilePath, tempInputPath, tempOutputPath],
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr || error.message}`);
          return;
        }

        // Read processed output image
        const outputImageBuffer = fs.readFileSync(tempOutputPath);

        // Clean up temp files
        // fs.unlinkSync(tempInputPath);
        // fs.unlinkSync(tempOutputPath);

        resolve(outputImageBuffer);
      }
    );
  });
};
