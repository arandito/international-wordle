import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import gameState from "../stores/GameStore";

const StartModal = observer(() => {
  const [selectedLanguage, setSelectedLanguage] = useState(gameState.language);
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    gameState.difficulty
  );

  const handleSubmit = () => {
    gameState.setLanguage(selectedLanguage);
    gameState.setDifficulty(selectedDifficulty);
    gameState.toggleModal();
    gameState.init();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-slate-950 bg-opacity-80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-slate-950/25 p-8 rounded-2xl shadow-2xl shadow-sky-600/80 w-96 text-white"
      >
        <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">
          WORDLE
        </h1>
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-300">
          GAME SETTINGS
        </h2>
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" size={20} />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(parseInt(e.target.value))}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full mt-8 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:shadow-lg"
        >
          Start Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
});

export default StartModal;