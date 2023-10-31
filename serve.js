const express = require("express");
const { main } = require("./gencolor.v2.js");

const app = express();
app.use(express.static("fe/dist"));

app.get("/curve", (req, res) => {
  const bezierCurve = req.query.bezierCurve.split(",").map((x) => +x);
  const buf = main(0, true, bezierCurve);
  res.setHeader("Content-Type", "image/png");
  res.send(buf);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
