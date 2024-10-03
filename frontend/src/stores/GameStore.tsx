import { makeAutoObservable } from "mobx";

const gameStore = {
  word: "",
  guesses: [],
  currentGuess: 0,
  language: "en",
  difficulty: 1,
  modalVisible: true,
  flipRow: false,
  loading: false,
  get won() {
    return this.guesses[this.currentGuess - 1] === this.word;
  },
  get lost() {
    return this.currentGuess > 5;
  },
  get allGuesses() {
    return this.guesses.slice(0, this.currentGuess).join("").split("");
  },
  get exactGuesses() {
    return this.word.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.currentGuess)
        .map((word) => word[i])
        .includes(letter);
    });
  },
  get inexactGuesses() {
    return this.word
      .split("")
      .filter((letter) => this.allGuesses.includes(letter));
  },
  init() {
    this.loading = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(
      `${apiUrl}/api/go/word?language=${this.language}&difficulty=${this.difficulty}`,
    )
      .then((response) => response.json())
      .then((data) => {
        this.word = data.word;
        this.guesses.replace(new Array(6).fill(""));
        this.currentGuess = 0;
        console.log(this.word);
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  setLanguage(language: string) {
    this.language = language;
  },
  setDifficulty(difficulty: number) {
    this.difficulty = difficulty;
  },
  toggleModal() {
    this.modalVisible = !this.modalVisible;
  },
  toggleFlipRow() {
    this.flipRow = !this.flipRow;
  },
  submitGuess() {
    // TODO: add error checking api and call it here
    const guessedWord = this.guesses[this.currentGuess];
    if (
      guessedWord.length === 5 &&
      this.currentGuess < 6 &&
      (this.currentGuess === 0 ||
        !this.guesses.slice(0, this.currentGuess).includes(guessedWord))
    ) {
      this.currentGuess += 1;
      this.toggleFlipRow();
      setTimeout(() => {
        this.toggleFlipRow();
      }, 1500);
    }
  },
  handleKeyup(e) {
    if (this.won || this.lost) {
      return;
    } else if (e.key === "Enter") {
      return this.submitGuess();
    } else if (e.key === "Backspace") {
      this.guesses[this.currentGuess] = this.guesses[this.currentGuess].slice(
        0,
        this.guesses[this.currentGuess].length - 1,
      );
    } else if (
      this.guesses[this.currentGuess].length < 5 &&
      e.key.match(/^[a-zA-Z]$/)
    ) {
      this.guesses[this.currentGuess] =
        this.guesses[this.currentGuess] + e.key.toLowerCase();
    }
  },
  handlePlayAgain: () => {
    gameStore.toggleModal();
  },
};

makeAutoObservable(gameStore);

export default gameStore
