package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type Word struct {
	Word       string `json:"word"`
	Language   string `json:"language"`
	Difficulty int    `json:"difficulty"`
}

func loadWordsFromJSON(filepath string) ([]Word, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var words []Word
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&words); err != nil {
		return nil, err
	}
	return words, nil
}

func insertWordsIntoDB(db *sql.DB, words []Word) error {
	query := `INSERT INTO words (word, language, difficulty) VALUES ($1, $2, $3)`
	for _, word := range words {
		_, err := db.Exec(query, word.Word, word.Language, word.Difficulty)
		if err != nil {
			return err
		}
	}
	return nil
}

func getWord(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		language := r.URL.Query().Get("language")
		difficultyStr := r.URL.Query().Get("difficulty")

		if language == "" || difficultyStr == "" {
			http.Error(w, "Missing language or difficulty", http.StatusBadRequest)
			return
		}

		difficulty, err := strconv.Atoi(difficultyStr)
		if err != nil {
			http.Error(w, "Invalid difficulty", http.StatusBadRequest)
			return
		}

		var word Word
		query := `
			SELECT word, language, difficulty 
			FROM words 
			WHERE language = $1 AND difficulty = $2
			ORDER BY RANDOM()
			LIMIT 1
		`
		err = db.QueryRow(query, language, difficulty).
			Scan(&word.Word, &word.Language, &word.Difficulty)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "No words found", http.StatusNotFound)
			} else {
				log.Printf("Database error: %v", err)
				http.Error(w, "Error querying database", http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(word)
	}
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow any origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Connect to database
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create words table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS words (
			id SERIAL PRIMARY KEY,
			word CHAR(5) NOT NULL,
			language VARCHAR(10),
			difficulty INT NOT NULL
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	// Load words from JSON
	words, err := loadWordsFromJSON("words.json")
	if err != nil {
		log.Fatal("Error loading words from JSON:", err)
	}

	// Insert words into db
	err = insertWordsIntoDB(db, words)
	if err != nil {
		log.Fatal("Error inserting words into the database:", err)
	}

	// Create router
	router := mux.NewRouter()
	router.HandleFunc("/api/go/word", getWord(db)).Methods("GET")

	// Wrap the router with CORS and JSON content type middlewares
	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

	// Start server
	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", enhancedRouter))
}
