import { makeAutoObservable, runInAction } from "mobx";

class GameStore {
  word = "";
  guesses = [] as string[];
  currentGuess = 0;
  language = "en";
  difficulty = 1;
  modalVisible = true;
  flipRow = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get won() {
    return this.guesses[this.currentGuess - 1] === this.word;
  }

  get lost() {
    return this.currentGuess > 5;
  }

  get allGuesses() {
    return this.guesses.slice(0, this.currentGuess).join("").split("");
  }

  get exactGuesses() {
    return this.word.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.currentGuess)
        .map((word) => word[i])
        .includes(letter);
    });
  }

  get inexactGuesses() {
    return this.word
      .split("")
      .filter((letter) => this.allGuesses.includes(letter));
  }

  init = () => {
    this.setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log(apiUrl);
    fetch(
      `${apiUrl}/api/go/word?language=${this.language}&difficulty=${this.difficulty}`,
    )
      .then((response) => response.json())
      .then((data) => {
        runInAction(() => {
          this.word = data.word;
          this.guesses = new Array(6).fill("");
          this.currentGuess = 0;
          console.log(this.word);
        });
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  setLoading = (value: boolean) => {
    this.loading = value;
  }

  setLanguage = (language: string) => {
    this.language = language;
  }

  setDifficulty = (difficulty: number) => {
    this.difficulty = difficulty;
  }

  toggleModal = () => {
    this.modalVisible = !this.modalVisible;
  }

  toggleFlipRow = () => {
    this.flipRow = !this.flipRow;
  }

  submitGuess = () => {
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
  }

  handleKeyup = (e: KeyboardEvent) => {
    if (this.won || this.lost) {
      return;
    } else if (e.key === "Enter") {
      return this.submitGuess();
    } else if (e.key === "Backspace") {
      this.setGuess(
        this.guesses[this.currentGuess].slice(
          0,
          this.guesses[this.currentGuess].length - 1
        )
      );
    } else if (
      this.guesses[this.currentGuess].length < 5 &&
      e.key.match(/^[a-zA-Z]$/)
    ) {
      this.setGuess(this.guesses[this.currentGuess] + e.key.toLowerCase());
    }
  }

  setGuess = (guess: string) => {
    this.guesses[this.currentGuess] = guess;
  }

  handlePlayAgain = () => {
    this.toggleModal();
  }
}

const gameStore = new GameStore();
export default gameStore;