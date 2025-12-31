import { useEffect, useState, useCallback, useRef } from "react";
import Grid from "../components/Grid";
import Result from "../components/Result";
import Keyboard from "../components/Keyboard";
import StatsModal from "../components/StatsModal";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3001/api";

export default function Game() {
  const [currentRow, setCurrentRow] = useState(0);

  const [message, setMessage] = useState("");

  const [keyStatus, setKeyStatus] = useState({});

  const [wikiInfo, setWikiInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const finishTimeoutRef = useRef(null);

  const [gameOver, setGameOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const inputLockedRef = useRef(false);

  const navigate = useNavigate();
  const FLIP_DURATION = 1000;

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

  const updateKeyStatus = (guessWord, result) => {
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
  };

  const finishGame = ({ correct, wiki, answer }) => {
    if (inputLockedRef.current) return;
    inputLockedRef.current = true;

    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }

    finishTimeoutRef.current = setTimeout(async () => {
      setGameOver(true);
      setIsCorrect(correct);
      setWikiInfo(wiki);
      setMessage(
        correct ? "Selamat! Jawaban Benar!" : `Game Over! Jawaban: ${answer}`
      );

      try {
        await fetch(`${API_BASE_URL}/stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            win: correct,
            guesses: correct ? currentRow + 1 : null,
          }),
        });

        const res = await fetch(`${API_BASE_URL}/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }

      finishTimeoutRef.current = null;
    }, FLIP_DURATION);
  };

  const handleKeyPress = useCallback(
    (key) => {
      if (inputLockedRef.current) return;
      if (gameOver || isSubmitting || currentRow >= 6) return;

      if (key === "ENTER") {
        if (!guesses[currentRow].every((c) => c.letter)) {
          setMessage("Lengkapi baris terlebih dahulu!");
          return;
        }

        const guessWord = guesses[currentRow].map((c) => c.letter).join("");
        setIsSubmitting(true);

        fetch(`${API_BASE_URL}/game/guess`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guess: guessWord }),
        })
          .then((res) => res.json())
          .then((data) => {
            setIsSubmitting(false);

            if (data.error) {
              setMessage(data.error);
              return;
            }

            setGuesses((prev) => {
              const copy = prev.map((r) => r.map((c) => ({ ...c })));
              copy[currentRow] = copy[currentRow].map((cell, i) => ({
                letter: cell.letter,
                status: data.result[i].status,
              }));
              return copy;
            });

            updateKeyStatus(guessWord, data.result);

            if (data.correct) {
              finishGame({
                correct: true,
                wiki: data.wiki,
                attempts: currentRow + 1,
              });
            } else if (currentRow === 5) {
              finishGame({
                correct: false,
                wiki: data.wiki,
                answer: data.word,
                attempts: currentRow + 1,
              });
            } else {
              setCurrentRow((r) => r + 1);
              setMessage("");
            }
          })
          .catch(() => {
            setIsSubmitting(false);
            setMessage("Terjadi kesalahan!");
          });
      } else if (key === "BACKSPACE") {
        setGuesses((prev) => {
          const copy = prev.map((r) => r.map((c) => ({ ...c })));
          for (let i = 4; i >= 0; i--) {
            if (copy[currentRow][i].letter) {
              copy[currentRow][i].letter = "";
              break;
            }
          }
          return copy;
        });
      } else if (/^[A-Z]$/.test(key)) {
        setGuesses((prev) => {
          const copy = prev.map((r) => r.map((c) => ({ ...c })));
          for (let i = 0; i < 5; i++) {
            if (!copy[currentRow][i].letter) {
              copy[currentRow][i].letter = key;
              break;
            }
          }
          return copy;
        });
      }
    },
    [currentRow, gameOver, guesses, isSubmitting, finishGame]
  );

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

  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Blue Archive Wordle
        </h1>

        <button
          onClick={() => setShowStats(true)}
          className="text-2xl hover:scale-110 transition"
          aria-label="Show Statistics"
        >
          📊
        </button>
      </div>

      <Grid guesses={guesses} />

      <Result
        message={message}
        wikiInfo={wikiInfo}
        isCorrect={isCorrect}
        gameOver={gameOver}
      />

      {gameOver && (
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          Kembali Ke Menu
        </button>
      )}

      <Keyboard
        onKeyPress={handleKeyPress}
        keyStatus={keyStatus}
        disabled={gameOver || isSubmitting}
      />

      {showStats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}
