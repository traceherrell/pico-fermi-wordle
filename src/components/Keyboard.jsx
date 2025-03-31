// src/components/Keyboard.js
import React from "react";
import "./Keyboard.css";

function Keyboard({ onKeyPress, keyStatuses }) {
  const keysRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], // Keep digits together
    ["Enter", "Backspace"], // Special keys
  ];

  const handleClick = (key) => {
    onKeyPress(key); // Pass the key value directly
  };

  return (
    <div className="keyboard">
      {keysRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = keyStatuses[key] || ""; // 'correct', 'present', 'absent', ''
            // Make Enter/Backspace wider
            const isSpecialKey = key === "Enter" || key === "Backspace";
            const className = `key ${status} ${
              isSpecialKey ? "special-key" : ""
            }`;

            return (
              <button
                key={key}
                className={className}
                onClick={() => handleClick(key)}
              >
                {key === "Backspace" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
