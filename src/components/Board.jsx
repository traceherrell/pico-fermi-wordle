// src/components/Board.js
import React from "react";
import Row from "./Row";
import { MAX_ATTEMPTS, NUM_DIGITS } from "../utils/gameLogic";
import "./Board.css";

function Board({ guesses, currentGuess, currentAttempt }) {
  const rows = [];

  // Set CSS variable for number of digits
  const boardStyle = {
    "--num-digits": NUM_DIGITS,
  };

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (i < currentAttempt) {
      // Past guess
      rows.push(<Row key={i} guessData={guesses[i]} />);
    } else if (i === currentAttempt) {
      // Current typing row
      rows.push(<Row key={i} currentGuess={currentGuess} />);
    } else {
      // Future row
      rows.push(<Row key={i} />);
    }
  }

  return (
    <div className="board" style={boardStyle}>
      {rows}
    </div>
  );
}

export default Board;
