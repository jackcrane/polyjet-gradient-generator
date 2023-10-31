import React, { useState, useEffect } from "react";
import { BezierCurveEditor } from "react-bezier-curve-editor";

export default () => {
  const [points, setPoints] = useState([0, 0, 1, 1]);
  const [deferredPoints, setDeferredPoints] = useState([0, 0, 1, 1]);
  let timerId;

  useEffect(() => {
    timerId = setTimeout(() => {
      setDeferredPoints(points);
    }, 100);

    return () => {
      clearTimeout(timerId);
    };
  }, [points]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <BezierCurveEditor onChange={(e) => setPoints(e)} value={points} />
      </div>
      <img
        src={`http://localhost:3000/curve?bezierCurve=${deferredPoints.join(
          ","
        )}`}
      />
    </div>
  );
};
