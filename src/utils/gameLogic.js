// src/utils/gameLogic.js

export const DEFAULT_NUM_DIGITS = 4;
export const MIN_NUM_DIGITS = 3;
export const MAX_NUM_DIGITS = 8;
export const MAX_ATTEMPTS = 6;

export function generateSecretNumber(numDigits = DEFAULT_NUM_DIGITS) {
  if (numDigits > MAX_NUM_DIGITS || numDigits < MIN_NUM_DIGITS) {
    throw new Error(`Number of digits must be between ${MIN_NUM_DIGITS} and ${MAX_NUM_DIGITS}.`);
  }
  const digits = Array.from({ length: 10 }, (_, i) => i.toString());
  let secret = "";
  for (let i = 0; i < numDigits; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    secret += digits.splice(randomIndex, 1)[0];
  }
  return secret;
}

export function isValidGuess(guess, numDigits = DEFAULT_NUM_DIGITS) {
  if (guess.length !== numDigits) {
    return {
      valid: false,
      message: `Guess must be ${numDigits} digits long.`,
    };
  }
  if (!/^\d+$/.test(guess)) {
    return { valid: false, message: "Guess must only contain digits." };
  }
  if (new Set(guess).size !== numDigits) {
    return { valid: false, message: "Digits in the guess must be unique." };
  }
  return { valid: true, message: "" };
}

/**
 * Calculates Wordle-style feedback for a guess.
 * Returns an array of status strings ('correct', 'present', 'absent')
 */
export function getFeedback(guess, secret) {
  const numDigits = secret.length;
  const feedback = Array(numDigits).fill("absent"); // gray
  const secretDigits = secret.split("");
  const guessDigits = guess.split("");

  // 1st Pass: Check for correct digits in the correct position (Fermi/Green)
  for (let i = 0; i < numDigits; i++) {
    if (guessDigits[i] === secretDigits[i]) {
      feedback[i] = "correct"; // green
      secretDigits[i] = null; // Mark as used
      guessDigits[i] = null; // Mark guess digit as processed
    }
  }

  // 2nd Pass: Check for correct digits in the wrong position (Pico/Yellow)
  for (let i = 0; i < numDigits; i++) {
    // Only check digits not already marked correct
    if (guessDigits[i] !== null) {
      const secretIndex = secretDigits.indexOf(guessDigits[i]);
      if (secretIndex !== -1) {
        feedback[i] = "present"; // yellow
        secretDigits[secretIndex] = null; // Mark as used in secret
      }
    }
  }

  return feedback;
}

// Helper to determine keyboard key status
export function getKeyStatuses(guesses) {
  const charStatuses = {}; // 'correct', 'present', 'absent'

  guesses.forEach((entry) => {
    if (!entry || !entry.guess || !entry.feedback) return; // Skip invalid entries
    const { guess, feedback } = entry;
    guess.split("").forEach((char, index) => {
      const currentStatus = feedback[index];
      const existingStatus = charStatuses[char];

      // If status is correct, it overrides any previous status
      if (currentStatus === "correct") {
        charStatuses[char] = "correct";
      }
      // If status is present, it overrides absent, but not correct
      else if (currentStatus === "present" && existingStatus !== "correct") {
        charStatuses[char] = "present";
      }
      // If status is absent, only set it if no status exists yet
      else if (currentStatus === "absent" && !existingStatus) {
        charStatuses[char] = "absent";
      }
    });
  });
  return charStatuses;
}
