// src/components/Row.js
import React from "react";
import Tile from "./Tile";
import { NUM_DIGITS } from "../utils/gameLogic";
import "./Row.css";

function Row({ guessData, currentGuess }) {
  const tiles = [];

  for (let i = 0; i < NUM_DIGITS; i++) {
    let digit = "";
    let status = "empty"; // Default status

    if (guessData) {
      // Past guess row
      digit = guessData.guess[i] || "";
      status = guessData.feedback[i] || "empty";
    } else if (currentGuess !== undefined) {
      // Current typing row
      digit = currentGuess[i] || "";
      if (digit) {
        status = "typing";
      }
    }
    // Else: Future row (remains 'empty')

    tiles.push(<Tile key={i} digit={digit} status={status} />);
  }

  // Add shake animation if needed (e.g., on invalid guess)
  // const rowClass = `row ${isShaking ? 'shake' : ''}`;
  const rowClass = "row";

  return <div className={rowClass}>{tiles}</div>;
}

export default Row;
