# Voxel color wheel pipeline

## Step 1: Generate Color Wheel

We start by generating a color wheel using the [`generateColorWheel`](#generatecolorwheel) method.

![Step 1](/frames/1-generated-0.png)

## Step 2: Apply ICC Profile

The next step is to apply an ICC profile to the generated color wheel. We acquire the ICC profile from passing an OBJZF file exported from Grabcad Print through WinRAR (in our case, we were provided the `Tavor_Xrite_i1Profiler_VividCMYW.icc` file). We pass this through the [`applyICCProfile`](#applyiccprofile) method.

![Step 2](/frames/2-icc-0.png)

## Step 3: Crop Color Wheel

The next step is to crop the color wheel to remove the background. We use the [`cropColorWheel`](#cropcolorwheel) method. This method is pretty substantial.

![Step 3](/frames/3-cropped-0.png)

## Step 4: Dither Color Wheel

The next step is to dither the color wheel to create a smoother transition between colors. We use the paintSolidColor method to dither the image.

![Step 4](/frames/4-dithered-0.png)

## Step 5: Scale the Color Wheel

To adhere to Polyjet's asymmetric voxel size, we widen the color by 2x.

![Step 5](/frames/5-scale-0.png)

# Function Definitions

### `generateColorWheel`

The `generateColorWheel` function creates a hue-based color wheel on a square canvas using the **HSL** color model. It modifies the canvas by iterating over each pixel, converting its **Cartesian coordinates** to **polar coordinates**, and using the angle (θ) to determine the hue.

#### How It Works
1. **Iterates Over Each Pixel**
   Loops through every pixel in a grid defined by `config.x` (width) and `config.y` (height).

2. **Converts to Polar Coordinates**
   Uses `cartesianToPolar(col, row)` to get the **angle (θ)** and **radius (r)** from the center.

3. **Determines Hue**
   The hue is based on the angle, scaled from radians to a range of 0-360 degrees.

4. **Applies Color**
   - If the radius is **less than 250 pixels**, it colors the pixel using **HSL(hue, 100%, 50%)**, making it a fully saturated, mid-lightness color.
   - If the radius is **greater than or equal to 250**, it paints the pixel **black** (`#000000`), creating a circular boundary.

A circular color wheel appears in the middle of the canvas, smoothly transitioning through hues based on angle, while everything outside a 250-pixel radius is black.

### `applyICCProfile`

The `applyICCProfile` function applies an **ICC color profile** to an image rendered on a canvas. It saves the canvas as a JPEG file, processes it using an external tool (`jpgicc`), and then reloads the modified image onto the canvas.

#### How It Works

1. **Save the Canvas as an Image**
   - Converts the canvas to a **JPEG buffer** with **maximum quality**.
   - Saves the buffer to a temporary file (`input.jpg`).

2. **Apply ICC Profile Conversion**
   - Calls `internal_applyICCProfile`, which:
     - Uses the `jpgicc` command-line tool to apply the ICC profile (path is provided to the function).
     - Saves the processed image as `output.jpg`.
     - Reads the modified image into a buffer.

3. **Load and Draw the Processed Image**
   - Reads `output.jpg` using `loadImage` from `canvas`.
   - Draws the processed image onto the given canvas context (`ctx`).

4. **Clean Up Temporary Files**
   - Deletes `input.jpg` and `output.jpg` after processing.

#### `internal_applyICCProfile`

The `internal_applyICCProfile` function is a wrapper around the `jpgicc` command-line tool. It calls jpgicc as

```bash
jpgicc -o ./Tavor_Xrite_i1Profiler_VividCMYW.icc ./input.jpg ./output.jpg
```

### `cropColorWheel`

Redraws black pixels on the border of a **color wheel**, ensuring anything outside a **250-pixel radius** is black.

#### How It Works
1. Loops through each pixel in the canvas.
2. Converts `(col, row)` to **polar coordinates**.
3. If the radius is **≥ 250**, sets the pixel color to **black (`#000000`)**.

### `paintSolidColor`

Dithers the image by determining the color of a pixel on the canvas and reassigning it to **Cyan, Magenta, Yellow, White, or Clear** based on randomized thresholds.

#### How It Works
1. **Checks If the Pixel Is Inside the Color Wheel**
   - Converts `(x, y)` to **polar coordinates**.
   - If the radius **≥ 250**, it does nothing.

2. **Gets the Pixel’s Original Color**
   - Reads the pixel color from the canvas using `ctx.getImageData(x, y, 1, 1)`.
   - Converts RGB to HSV (using `rgbToHsv` (see below))

3. **Computes Thresholds for Color Mapping**
   - Uses `hueToCmy` to determine the probability of the pixel becoming **Cyan, Magenta, or Yellow**.
   - Uses `Math.random()` to decide between:
     - **White** (if the pixel's saturation is low).
     - **Black or CMY colors** (if the pixel's brightness is high).
     - **A random CMY color** if all else fails.

4. **Fills the Pixel With a New Color**
   - Assigns the pixel one of `config.colors.cyan`, `config.colors.magenta`, `config.colors.yellow`, `config.colors.white`, or `config.colors.clear`.
   - Updates the pixel on the canvas.

#### Code sample

```js
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
```

### `rgbToHsv`

Converts **RGB color values (0-255)** into **HSV (Hue, Saturation, Value)** format.

#### How It Works
1. **Normalizes RGB Values**
   - Converts `r`, `g`, and `b` from **0-255** to **0-1**.

2. **Finds Min and Max Values**
   - Determines the **brightest (max)** and **darkest (min)** RGB component.
   - `v = max` (Value is the max brightness).

3. **Calculates Saturation (S)**
   - If `max == 0`, saturation (`s`) is **0**.
   - Otherwise, `s = (max - min) / max` (Intensity of color).

4. **Determines Hue (H)**
   - If `max == min`, hue is **0** (grayscale).
   - Otherwise:
     - **Red is max:** `h = (g - b) / d + (g < b ? 6 : 0)`
     - **Green is max:** `h = (b - r) / d + 2`
     - **Blue is max:** `h = (r - g) / d + 4`
   - Scales hue to **0-360°**.

#### Returns
An array `[H, S, V]`:
- `H` (Hue) in **degrees (0-360)**
- `S` (Saturation) **0-1**
- `V` (Brightness) **0-1**

#### Code sample

```js
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
```

#### Results

| Input (R, G, B) | Output (H, S, V) |
| --------------- | ---------------- |
| 255, 255, 255   | 0, 0, 1          |
| 0, 0, 0         | 0, 0, 0          |
| 255, 0, 1       | 0, 1, 1          |
| 0, 255, 0       | 120, 1, 1        |
| 0, 0, 255       | 240, 1, 1        |
| 128, 128, 128   | 0, 0, 0.501      |

### `hueToCmy`

A function that takes a hue value (0-360) and returns the probability of the pixel becoming **Cyan, Magenta, or Yellow** between 0-1.

#### How It Works
1. **Normalizes the Hue**
   - Ensures the hue is within **0-360°** using `hue % 360`.

2. **Maps Hue to CMY Values**
   - **0° - 60° (Red-Yellow):**
     - `C = 0`, `M` decreases from `0.5` to `0`, `Y` increases.
   - **60° - 180° (Yellow-Green-Cyan):**
     - `M = 0`, `Y` decreases, `C` increases.
   - **180° - 300° (Cyan-Blue-Magenta):**
     - `Y = 0`, `C` decreases, `M` increases.
   - **300° - 360° (Magenta-Red):**
     - `C = 0`, `M` decreases, `Y` increases.

3. **Returns the CMY Thresholds**
   - Outputs an array `[C, M, Y]`, where each value is between `0` and `1`.

#### Code sample

```js
export const hueToCmy = (hue) => {
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
  return [c, m, y];
};
```

#### Results

| Hue  | CMY Values       |
|------|----------------|
| 0    | [0, 0.5, 0.5]  |
| 60   | [0, 0, 1]      |
| 120  | [0.5, 0, 0.5]  |
| 180  | [1, 0, 0]      |
| 240  | [0.5, 0.5, 0]  |
| 300  | [0, 1, 0]      |
| 360  | [0, 0.5, 0.5]  |