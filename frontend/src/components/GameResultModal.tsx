import React from "react";
import { motion } from "framer-motion";
import { Repeat } from "lucide-react";

const GameResultModal = ({ message, onPlayAgain, word }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-slate-950 bg-opacity-80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-gray-950/60 p-8 rounded-2xl shadow-2xl shadow-sky-600/80 text-center text-white max-w-md w-full mx-4"
      >
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text uppercase">
          {message}
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          The word was:{" "}
          <span className="font-bold text-2xl uppercase bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            {word}
          </span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:shadow-lg flex items-center justify-center space-x-2 w-full"
        >
          <Repeat size={24} />
          <span>Play Again</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GameResultModal;