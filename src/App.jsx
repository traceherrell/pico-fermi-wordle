// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import MessageArea from "./components/MessageArea";
import {
  generateSecretNumber,
  getFeedback,
  isValidGuess,
  getKeyStatuses,
  DEFAULT_NUM_DIGITS,
  MIN_NUM_DIGITS,
  MAX_NUM_DIGITS,
  MAX_ATTEMPTS,
} from "./utils/gameLogic";

function App() {
  const [secretNumber, setSecretNumber] = useState("");
  const [numDigits, setNumDigits] = useState(DEFAULT_NUM_DIGITS);
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(null)); // Store { guess: string, feedback: string[] }
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success'
  const [keyStatuses, setKeyStatuses] = useState({});

  // Initialize game
  const initializeGame = useCallback(() => {
    const newSecret = generateSecretNumber(numDigits);
    console.log("Secret Number (for debugging):", newSecret); // Keep for debugging
    setSecretNumber(newSecret);
    setGuesses(Array(MAX_ATTEMPTS).fill(null));
    setCurrentGuess("");
    setCurrentAttempt(0);
    setGameStatus("playing");
    setMessage("");
    setMessageType("info");
    setKeyStatuses({});
  }, [numDigits]); // Re-create function when numDigits changes

  useEffect(() => {
    initializeGame();
  }, [initializeGame]); // Run initialization on mount

  // Handle keyboard input (both physical and virtual)
  const handleKeyPress = useCallback(
    (key) => {
      if (gameStatus !== "playing") return;

      setMessage(""); // Clear previous messages on new input
      setMessageType("info");

      if (key === "Enter") {
        if (currentGuess.length !== numDigits) {
          setMessage(`Guess must be ${numDigits} digits.`);
          setMessageType("error");
          return;
        }
        const validation = isValidGuess(currentGuess, numDigits);
        if (!validation.valid) {
          setMessage(validation.message);
          setMessageType("error");
          return;
        }

        // Process valid guess
        const feedback = getFeedback(currentGuess, secretNumber);
        const newGuesses = [...guesses];
        newGuesses[currentAttempt] = { guess: currentGuess, feedback };
        setGuesses(newGuesses);

        // Update key statuses after guess
        setKeyStatuses(getKeyStatuses(newGuesses));

        // Check game status
        if (currentGuess === secretNumber) {
          setGameStatus("won");
          setMessage(`You won in ${currentAttempt + 1} attempts!`);
          setMessageType("success");
        } else if (currentAttempt + 1 >= MAX_ATTEMPTS) {
          setGameStatus("lost");
          setMessage(`Game Over! The number was ${secretNumber}.`);
          setMessageType("error");
        } else {
          // Move to next attempt
          setCurrentAttempt((prev) => prev + 1);
          setCurrentGuess("");
        }
      } else if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < numDigits && /^[0-9]$/.test(key)) {
        // Append digit if it's not already in the current guess
        if (!currentGuess.includes(key)) {
          setCurrentGuess((prev) => prev + key);
        } else {
          // Optional: Provide feedback that digits must be unique while typing
          // setMessage("Digits must be unique.");
          // setMessageType('error');
        }
      }
    },
    [currentGuess, currentAttempt, gameStatus, guesses, secretNumber, numDigits]
  );

  // Handle physical keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return; // Ignore modifier keys

      if (event.key === "Enter") {
        handleKeyPress("Enter");
      } else if (event.key === "Backspace") {
        handleKeyPress("Backspace");
      } else if (/^[0-9]$/.test(event.key)) {
        handleKeyPress(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Cleanup listener
    };
  }, [handleKeyPress]); // Re-attach listener if handleKeyPress changes

  // Handle digit length change
  const handleDigitLengthChange = (length) => {
    if (gameStatus !== "playing" || currentGuess === "" && currentAttempt === 0) {
      setNumDigits(length);
      initializeGame();
    } else {
      setMessage("You cannot change digit length during an active game");
      setMessageType("error");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pico Fermi Bagel (Wordle Style)</h1>
      </header>
      <div className="digit-selector">
        <label htmlFor="digit-length">Number Length: </label>
        <select 
          id="digit-length" 
          value={numDigits} 
          onChange={(e) => handleDigitLengthChange(Number(e.target.value))}
          disabled={gameStatus === "playing" && (currentGuess !== "" || currentAttempt > 0)}
        >
          {Array.from({ length: MAX_NUM_DIGITS - MIN_NUM_DIGITS + 1 }, (_, i) => i + MIN_NUM_DIGITS).map(
            (length) => (
              <option key={length} value={length}>
                {length} digits
              </option>
            )
          )}
        </select>
      </div>
      <MessageArea message={message} type={messageType} />
      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        currentAttempt={currentAttempt}
        numDigits={numDigits}
      />
      {(gameStatus === "won" || gameStatus === "lost") && (
        <button onClick={initializeGame} className="play-again-button">
          Play Again?
        </button>
      )}
      <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />
    </div>
  );
}

export default App;
