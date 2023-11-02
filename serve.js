const express = require("express");
const { main, loop } = require("./gencolor.v2.js");
const config = require("./config.json");

const app = express();
app.use(express.static("fe/dist"));

app.get("/curve", (req, res) => {
  const bezierCurve = req.query.bezierCurve.split(",").map((x) => +x);
  const buf = main(0, true, bezierCurve);
  res.setHeader("Content-Type", "image/png");
  res.send(buf);
});

app.get("/generate", (req, res) => {
  const bezierCurve = req.query.bezierCurve.split(",").map((x) => +x);
  loop(bezierCurve);
  res.send("ok");
});

app.get("/config", (req, res) => {
  res.json(config);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
