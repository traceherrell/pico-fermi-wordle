// src/components/Tile.js
import React from "react";
import "./Tile.css";

function Tile({ digit, status }) {
  // status: 'empty', 'typing', 'correct', 'present', 'absent'
  const className = `tile ${status || "empty"}`;
  return <div className={className}>{digit}</div>;
}

export default Tile;
