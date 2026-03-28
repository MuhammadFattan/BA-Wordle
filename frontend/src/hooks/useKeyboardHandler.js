import { useCallback, useEffect } from "react";

export function useKeyboardHandler({
  gameOver,
  isSubmitting,
  inputLockedRef,
  onEnter,
  onBackspace,
  onLetter,
}) {
  const handleKeyPress = useCallback(
    (key) => {
      if (inputLockedRef.current) return;
      if (gameOver || isSubmitting) return;

      if (key === "ENTER") {
        onEnter();
      } else if (key === "BACKSPACE") {
        onBackspace();
      } else if (/^[A-Z]$/.test(key)) {
        onLetter(key);
      }
    },
    [gameOver, isSubmitting, inputLockedRef, onEnter, onBackspace, onLetter]
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
  }, [gameOver, handleKeyPress, inputLockedRef]);

  return handleKeyPress;
}