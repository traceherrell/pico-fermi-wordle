// src/components/Board.js
import React from "react";
import Row from "./Row";
import { MAX_ATTEMPTS, DEFAULT_NUM_DIGITS } from "../utils/gameLogic";
import "./Board.css";

function Board({ guesses, currentGuess, currentAttempt, numDigits = DEFAULT_NUM_DIGITS }) {
  const rows = [];

  // Set CSS variable for number of digits
  const boardStyle = {
    "--num-digits": numDigits,
  };

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (i < currentAttempt) {
      // Past guess
      rows.push(<Row key={i} guessData={guesses[i]} numDigits={numDigits} />);
    } else if (i === currentAttempt) {
      // Current typing row
      rows.push(<Row key={i} currentGuess={currentGuess} numDigits={numDigits} />);
    } else {
      // Future row
      rows.push(<Row key={i} numDigits={numDigits} />);
    }
  }

  return (
    <div className="board" style={boardStyle}>
      {rows}
    </div>
  );
}

export default Board;
