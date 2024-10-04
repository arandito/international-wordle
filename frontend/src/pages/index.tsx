import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Guess from "../components/Guess";
import Keyboard from "../components/Keyboard";
import GameStore from "../stores/GameStore";
import StartModal from "../components/StartModal";
import GameResultModal from "../components/GameResultModal";
import Footer from "@/components/Footer";

const Home = observer(() => {
  const store = useLocalObservable(() => GameStore);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleKeyup = (e) => {
    if (!store.modalVisible) {
      store.handleKeyup(e);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [store.modalVisible]);

  useEffect(() => {
    if (store.won || store.lost) {
      setTimeout(() => {
        setShowResultModal(true);
      }, 1500);
    } else {
      setShowResultModal(false);
    }
  }, [store.won, store.lost]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-5 gap-2">
      {new Array(30).fill(0).map((_, i) => (
        <div key={i} className="h-[3.5rem] w-[3.5rem] bg-slate-800 border-2 border-gray-700" />
      ))}
    </div>
  );

  return (
    <div className="bg-slate-950 flex flex-col items-center">
      <title>international wordle</title>
      <div className="flex h-screen max-w-4xl mx-auto flex-col text-white relative overflow-hidden">
        <div className="flex flex-col items-center flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center w-full max-w-lg px-4"
          >
            <h1 className="text-6xl font-bold mb-5 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text mt-5 md:mt-0 md:pt-8">
              WORDLE
            </h1>
            <div className="space-y-2 mb-5">
              {store.modalVisible ?
                renderSkeletons() :
              store.loading ? (
                renderSkeletons()
              ) : (
                store.guesses.map((_, i) => (
                  <Guess
                    key={i}
                    word={store.word}
                    guess={store.guesses[i]}
                    isGuessed={i < store.currentGuess}
                    animateRow={store.flipRow && i === store.currentGuess - 1}
                  />
                ))
              )}
            </div>
            <AnimatePresence>
              {showResultModal && (
                <GameResultModal
                  key="result-modal"
                  message={store.won ? "You won!" : "You lost!"}
                  onPlayAgain={store.handlePlayAgain}
                  word={store.word}
                />
              )}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Keyboard store={store} />
            </motion.div>
          </motion.div>
          <AnimatePresence>
            {store.modalVisible && <StartModal key="start-modal" />}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
});

export default Home;