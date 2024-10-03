import React from 'react';
import { motion } from 'framer-motion';

export default function Guess({ guess, word, isGuessed, animateRow }) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-2">
      {new Array(5).fill(0).map((_, i) => {
        const bgColor = !isGuessed
          ? "bg-slate-800"
          : guess[i] === word[i]
          ? "bg-green-500"
          : word.includes(guess[i])
          ? "bg-yellow-400"
          : "bg-slate-500";
        const textColor = "text-white";
        const border = isGuessed ? "" : guess[i] ? "border-2 border-gray-600" : "border-2 border-gray-700";
        const animateInput = !isGuessed && guess[i];
        const animateGuess = isGuessed && animateRow;
        const squishDelay = `${i * 0.25}s`;
        const colorDelay = `${i * 0.25 + 0.25}s`;

        return (
          <motion.div
            key={i}
            style={
              animateGuess
                ? {
                    animationDelay: squishDelay,
                    transitionDelay: colorDelay,
                  }
                : {}
            }
            className={
              `flex items-center justify-center h-[3.5rem] w-[3.5rem]
              text-3xl font-bold uppercase
              ${textColor} ${border} ${bgColor}
              ${animateInput ? "animate-pop" : "" } ${animateGuess ? "squish" : ""}`
            }
          >
            {guess[i]}
          </motion.div>
        );
      })}
    </div>
  );
}
