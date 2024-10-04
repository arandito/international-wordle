import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function Keyboard({ store }) {
  const qwerty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  const handleButtonClick = (key) => {
    const event = { key };
    store.handleKeyup(event);
  };

  const KeyButton = ({ children, onClick, className }) => (
    <motion.button
      whileHover={{ scale: 1.10 }}
      whileTap={{ scale: 0.95 }}
      className={`m-0.5 sm:m-1 rounded-md flex items-center justify-center uppercase font-bold ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="mt-1 w-full max-w-lg">
      {qwerty.map((row, rowIndex) => (
        <div key={row} className="flex justify-center">
          {rowIndex === qwerty.length - 1 && (
            <KeyButton
              onClick={() => handleButtonClick("Enter")}
              className="w-14 sm:w-16 md:w-20 h-11 sm:h-12 md:h-14 bg-slate-700 text-white text-xs md:text-lg"
            >
              Enter
            </KeyButton>
          )}

          {row.split("").map((key) => {
            const bgColor = store.exactGuesses.includes(key)
              ? "bg-green-500"
              : store.inexactGuesses.includes(key)
              ? "bg-yellow-400"
              : store.allGuesses.includes(key)
              ? "bg-slate-500"
              : "bg-slate-700";
            const textColor = "text-white";
            return (
              <KeyButton
                key={key}
                onClick={() => handleButtonClick(key)}
                className={`w-8 sm:w-9 md:w-11 h-11 sm:h-12 md:h-14 ${bgColor} ${textColor} text-sm md:text-xl`}
              >
                {key}
              </KeyButton>
            );
          })}

          {rowIndex === qwerty.length - 1 && (
            <KeyButton
              onClick={() => handleButtonClick("Backspace")}
              className="w-12 sm:w-14 md:w-16 h-11 sm:h-12 md:h-14 bg-slate-700 text-white text-xl"
            >
              &#x232B;
            </KeyButton>
          )}
        </div>
      ))}
    </div>
  );
}

Keyboard.propTypes = {
  store: PropTypes.shape({
    exactGuesses: PropTypes.arrayOf(PropTypes.string).isRequired,
    inexactGuesses: PropTypes.arrayOf(PropTypes.string).isRequired,
    allGuesses: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleKeyup: PropTypes.func.isRequired,
  }).isRequired,
};