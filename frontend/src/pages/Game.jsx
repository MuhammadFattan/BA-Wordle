import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../components/Grid";
import Result from "../components/Result";
import Keyboard from "../components/Keyboard";
import StatsModal from "../components/StatsModal";
import GameHeader from "../components/GameHeader";
import GameActions from "../components/GameActions";
import Toast from "../components/Toast";
import { useGameLogic } from "../hooks/useGameLogic";
import { useKeyboardHandler } from "../hooks/useKeyboardHandler";
import { useToast } from "../hooks/useToast";
import {
  generateShareGrid,
  getShareText,
  getDayIndex,
} from "../utils/GameShare";

const API_BASE_URL = "http://localhost:3001/api";

export default function Game() {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  const [hardMode, setHardMode] = useState(false);

  const { toasts, showToast, dismissToast } = useToast();

  const dayIndex = getDayIndex();

  const handleShowLeaderboard = () => navigate("/leaderboard");

  const {
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
  } = useGameLogic({ onToast: showToast, hardMode, dayIndex });

  const handleToggleHardMode = () => {
    if (gameOver) return;

    const gameStarted = guesses.some((row) =>
      row.some((c) => c.letter || c.status),
    );
    if (gameStarted && hardMode) {
      showToast(
        "Hard mode tidak bisa dimatikan setelah game dimulai!",
        "error",
      );
      return;
    }
    setHardMode((prev) => !prev);
  };

  const handleKeyPress = useKeyboardHandler({
    gameOver,
    isSubmitting,
    inputLockedRef,
    onEnter: handleGuess,
    onBackspace: handleBackspace,
    onLetter: handleLetter,
  });

  const shareText = `${getShareText({
    win: isCorrect,
    attempts: currentRow + 1,
    maxAttempts: 6,
    dayIndex,
  })}\n\n${generateShareGrid(guesses)}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      showToast("Disalin ke clipboard!", "copied", 2000);
    } catch {
      showToast("Gagal menyalin teks.", "error", 2000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("ba_wordle_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE_URL}/stats`, { headers })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, [setStats]);

  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }
    };
  }, [finishTimeoutRef]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <GameHeader
        onShowStats={() => setShowStats(true)}
        onShowLeaderboard={handleShowLeaderboard}
        hardMode={hardMode}
        onToggleHardMode={handleToggleHardMode}
      />

      <Grid guesses={guesses} />

      <Result
        message={message}
        wikiInfo={wikiInfo}
        isCorrect={isCorrect}
        gameOver={gameOver}
      />

      {gameOver && (
        <GameActions
          onBackToMenu={() => navigate("/")}
          onShare={handleShare}
          guesses={guesses}
          isCorrect={isCorrect}
          attempts={currentRow + 1}
          dayIndex={dayIndex}
        />
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
