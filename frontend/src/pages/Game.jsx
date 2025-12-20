import { useEffect, useState, useCallback, useRef } from "react";
import Grid from "../components/Grid";
import Result from "../components/Result";
import Keyboard from "../components/Keyboard";

const API_BASE_URL = "http://localhost:3001/api/game";

export default function Game() {
  const [currentRow, setCurrentRow] = useState(0);
  const [message, setMessage] = useState("");
  const [keyStatus, setKeyStatus] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [wikiInfo, setWikiInfo] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputLockedRef = useRef(false);

  const emptyCell = () => ({ letter: "", status: "" });

  const [guesses, setGuesses] = useState(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => emptyCell())
    )
  );

  const priority = {
    absent: 0,
    present: 1,
    correct: 2,
  };

  function updateKeyStatus(guessWord, result) {
    setKeyStatus((prev) => {
      const next = { ...prev };

      guessWord.split("").forEach((char, i) => {
        const newStatus = result[i].status;
        const oldStatus = next[char];

        if (!oldStatus || priority[newStatus] > priority[oldStatus]) {
          next[char] = newStatus;
        }
      });

      return next;
    });
  }

  const handleKeyPress = useCallback(
    (key) => {
      if (inputLockedRef.current) return;
      if (isSubmitting || gameOver || currentRow >= 6) return;
      if (key === "ENTER") {
        if (guesses[currentRow].every((cell) => cell.letter !== "")) {
          const guessWord = guesses[currentRow].map((c) => c.letter).join("");
          setIsSubmitting(true); // Set submitting true sebelum fetch

          fetch(`${API_BASE_URL}/guess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guess: guessWord }),
          })
            .then((res) => res.json())
            .then((data) => {
              setIsSubmitting(false); // Set submitting false setelah response
              if (data.error) {
                setMessage(data.error);
                return;
              }

              // Update grid dengan status warna
              setGuesses((prev) => {
                const newGuesses = prev.map((row) =>
                  row.map((cell) => ({ ...cell }))
                );
                newGuesses[currentRow] = newGuesses[currentRow].map(
                  (cell, i) => ({
                    letter: cell.letter,
                    status: data.result[i].status,
                  })
                );
                return newGuesses;
              });

              updateKeyStatus(guessWord, data.result);

              console.log("GUESS RESPONSE:", data);

              if (data.correct) {
                inputLockedRef.current = true;
                setIsCorrect(true);
                setGameOver(true);
                setWikiInfo(data.wiki);
                setMessage("🎉 Selamat! Jawaban Benar!");
              } else if (currentRow === 5) {
                inputLockedRef.current = true;
                setIsCorrect(false);
                setGameOver(true);
                setWikiInfo(data.wiki);
                setMessage(`Game Over! Jawaban: ${data.word}`);
              } else {
                setCurrentRow((r) => r + 1);
                setMessage("");
              }
            })
            .catch((err) => {
              setIsSubmitting(false); // Pastikan set false jika error
              console.error(err);
              setMessage("Terjadi kesalahan!");
            });
        } else {
          setMessage("Lengkapi baris terlebih dahulu!");
        }
      } else if (key === "BACKSPACE") {
        setGuesses((prev) => {
          const copy = prev.map((row) => row.map((cell) => ({ ...cell })));
          for (let i = 4; i >= 0; i--) {
            if (copy[currentRow][i].letter !== "") {
              copy[currentRow][i].letter = "";
              break;
            }
          }
          return copy;
        });
        setMessage("");
      } else if (/^[A-Z]$/.test(key)) {
        setGuesses((prev) => {
          const copy = prev.map((row) => row.map((cell) => ({ ...cell })));
          for (let i = 0; i < 5; i++) {
            if (copy[currentRow][i].letter === "") {
              copy[currentRow][i].letter = key;
              break;
            }
          }
          return copy;
        });
        setMessage("");
      }
    },
    [currentRow, gameOver, guesses, isSubmitting]
  );

  const handlePlayAgain = () => {
    inputLockedRef.current = false;
    setCurrentRow(0);
    setMessage("");
    setKeyStatus({});
    setGameOver(false);
    setWikiInfo(null);
    setIsCorrect(false);
    setIsSubmitting(false); // Reset isSubmitting
    setGuesses(
      Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => emptyCell())
      )
    );

    // Fetch kata baru
    fetch(`${API_BASE_URL}/new`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("New game started:", data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/today`)
      .then((res) => res.json())
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const handler = (e) => {
      if (inputLockedRef.current) return;

      if (e.key === "Enter") handleKeyPress("ENTER");
      else if (e.key === "Backspace") handleKeyPress("BACKSPACE");
      else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameOver, handleKeyPress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Blue Archive Wordle
      </h1>
      <Grid guesses={guesses} />
      <Result
        message={message}
        wikiInfo={wikiInfo}
        isCorrect={isCorrect}
        gameOver={gameOver}
      />
      {gameOver && (
        <button
          onClick={handlePlayAgain}
          className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
        >
          Main Lagi
        </button>
      )}
      <Keyboard
        onKeyPress={handleKeyPress}
        keyStatus={keyStatus}
        disabled={gameOver || isSubmitting}
      />{" "}
      {/* Tambahkan isSubmitting ke disabled */}
    </div>
  );
}
