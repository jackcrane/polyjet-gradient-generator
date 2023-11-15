import stl from "stl";
import { createCanvas } from "canvas";
import fs from "fs";

const facets = stl.toObject(fs.readFileSync("input/print-test.stl"));

fs.writeFileSync("3d.json", JSON.stringify(facets));

function slicePolygonAtHeight(data, height) {
  const slicePoints = [];

  function planeEquation(normal, point) {
    const D = -(
      normal[0] * point[0] +
      normal[1] * point[1] +
      normal[2] * point[2]
    );
    return { A: normal[0], B: normal[1], C: normal[2], D: D };
  }

  function linePlaneIntersection(plane, point1, point2) {
    const x1 = point1[0],
      y1 = point1[1],
      z1 = point1[2];
    const x2 = point2[0],
      y2 = point2[1],
      z2 = point2[2];
    const { A, B, C, D } = plane;

    const t =
      -(A * x1 + B * y1 + C * z1 + D) /
      (A * (x2 - x1) + B * (y2 - y1) + C * (z2 - z1));
    if (t < 0 || t > 1) return null; // No intersection

    return [x1 + t * (x2 - x1), y1 + t * (y2 - y1), z1 + t * (z2 - z1)];
  }

  for (const facet of data.facets) {
    const plane = planeEquation(facet.normal, facet.verts[0]);
    let previousPoint = facet.verts[facet.verts.length - 1];

    for (const currentPoint of facet.verts) {
      if ((previousPoint[2] - height) * (currentPoint[2] - height) < 0) {
        const intersection = linePlaneIntersection(
          plane,
          previousPoint,
          currentPoint
        );
        if (intersection) {
          slicePoints.push(intersection);
        }
      }
      previousPoint = currentPoint;
    }
  }

  // Additional logic to sort and construct the slice polygon might be needed here.

  return slicePoints;
}
function drawLayer(slicePoints, width, height, layerNumber) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Set up drawing styles
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

  // Draw the polygon
  ctx.beginPath();
  ctx.moveTo(slicePoints[0][0], slicePoints[0][1]);
  slicePoints.forEach((point) => ctx.lineTo(point[0], point[1]));
  ctx.closePath();
  ctx.stroke();

  // Save the canvas to an image file
  const out = fs.createWriteStream(`layer_${layerNumber}.png`);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log(`Layer ${layerNumber} image saved.`));
}

const layerHeights = [10, 20, 30]; // example layer heights
layerHeights.forEach((height, index) => {
  const slice = slicePolygonAtHeight(facets, height);
  drawLayer(slice, 500, 500, index);
});
