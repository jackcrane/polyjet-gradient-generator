import React, { useState, useEffect } from "react";
import { BezierCurveEditor } from "react-bezier-curve-editor";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const EditorContainer = styled.div`
  position: relative;
  margin: 20px;
`;

const Label = styled.div`
  position: absolute;
  top: -10%;
  left: -10px;
`;

const PreviewContainer = styled.div`
  margin: 20px;
`;

const GenerateButton = styled.button`
  padding: 5px 10px;
  margin-top: 10px;
  margin-left: 10px;
  cursor: pointer;
`;

const ConfigTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    border: 1px solid #ccc;
    padding: 10px;
  }

  th {
    background-color: #f2f2f2;
  }
`;

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

  const generateLayers = () => {
    alert("Generating layers");
    fetch(
      `http://localhost:3000/generate?bezierCurve=${deferredPoints.join(",")}`
    );
  };

  const [config, setConfig] = useState({});
  useEffect(() => {
    fetch("http://localhost:3000/config")
      .then((res) => res.json())
      .then((res) => setConfig(res));
  }, []);

  return (
    <Container>
      <EditorContainer>
        <Label>
          <BezierCurveEditor
            onChange={(e) => setPoints(e)}
            value={points}
            outerAreaColor="#ffffff00"
            innerAreaColor="#ffffff00"
            rowColor="#ffffff00"
            pointColor="#ffffff00"
            startHandleColor="#0089a6"
            endHandleColor="#b4b4b4"
            size={600}
          />
          {points.map((p) => p.toFixed(2)).join(",")}
          <GenerateButton onClick={generateLayers}>
            Generate layers
          </GenerateButton>
        </Label>
        <img
          src={`http://localhost:3000/curve?bezierCurve=${deferredPoints.join(
            ","
          )}`}
          style={{
            width: 600,
            height: 600,
          }}
        />
      </EditorContainer>
      <PreviewContainer>
        <img
          src={`http://localhost:3000/curve?bezierCurve=${deferredPoints.join(
            ","
          )}`}
          style={{
            maxWidth: 400,
            maxHeight: 400,
          }}
        />
        <h3>Config</h3>
        <ConfigTable>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
          {Object.keys(config).map((key) => (
            <tr>
              <td>{key}</td>
              <td>{JSON.stringify(config[key])}</td>
            </tr>
          ))}
        </ConfigTable>
      </PreviewContainer>
    </Container>
  );
};
