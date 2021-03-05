//import React from "react";
//import React, { useState, useEffect, useRef, useReducer } from "react";
import xtype from "xtypejs";

function StateViewerClient(props) {
  return (
    <div className="actualState">
      <h4>Actual State</h4>
      {Object.entries(props).map(([name, value]) => (
        <div key={name}>
          <strong>{name}</strong>: {value.toString()}
          <br />
          <sup style={{ color: "gray" }}>
            [{xtype.type(value)} ({xtype(value)})]
          </sup>
        </div>
      ))}
    </div>
  );
}
export default StateViewerClient;
