import { useState, useRef, useCallback } from "react";

const API_BASE_URL = "http://localhost:3001/api";
const FLIP_DURATION = 1000;

const priority = {
  absent: 0,
  present: 1,
  correct: 2,
};

const emptyCell = () => ({ letter: "", status: "" });

export function useGameLogic({ onToast } = {}) {
  const [currentRow, setCurrentRow] = useState(0);

  // message sekarang hanya untuk pesan permanen game over (tampil di Result.jsx)
  const [message, setMessage] = useState("");

  const [keyStatus, setKeyStatus] = useState({});
  const [wikiInfo, setWikiInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishTimeoutRef = useRef(null);
  const inputLockedRef = useRef(false);

  const [guesses, setGuesses] = useState(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => emptyCell())
    )
  );

  // Helper: kirim toast jika callback tersedia
  const toast = useCallback(
    (msg, type = "info", duration = 2000) => {
      onToast?.(msg, type, duration);
    },
    [onToast]
  );

  const updateKeyStatus = useCallback((guessWord, result) => {
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
  }, []);

  const finishGame = useCallback(
    ({ correct, wiki, answer }) => {
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

        // Pesan permanen di Result.jsx (tidak berubah)
        setMessage(
          correct ? "Selamat! Jawaban Benar!" : `Game Over! Jawaban: ${answer}`
        );

        // Toast singkat sebagai konfirmasi tambahan
        toast(
          correct ? "🎉 Jawaban benar!" : `Jawaban: ${answer}`,
          correct ? "success" : "error",
          3000
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
    },
    [currentRow, toast]
  );

  const handleGuess = useCallback(async () => {
    if (!guesses[currentRow].every((c) => c.letter)) {
      // Pakai toast untuk validasi, bukan message permanen
      toast("Lengkapi baris terlebih dahulu!", "error");
      return;
    }

    const guessWord = guesses[currentRow].map((c) => c.letter).join("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/game/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: guessWord }),
      });
      const data = await res.json();

      setIsSubmitting(false);

      if (data.error) {
        // Error dari server (misal: kata tidak valid) pakai toast
        toast(data.error, "error");
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
      }
    } catch {
      setIsSubmitting(false);
      toast("Terjadi kesalahan koneksi!", "error");
    }
  }, [currentRow, guesses, updateKeyStatus, finishGame, toast]);

  const handleLetter = useCallback(
    (key) => {
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
    },
    [currentRow]
  );

  const handleBackspace = useCallback(() => {
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
  }, [currentRow]);

  return {
    currentRow,
    message,
    keyStatus,
    wikiInfo,
    stats,
    gameOver,
    isCorrect,
    isSubmitting,
    guesses,
    inputLockedRef,
    finishTimeoutRef,
    setStats,
    handleGuess,
    handleLetter,
    handleBackspace,
  };
}