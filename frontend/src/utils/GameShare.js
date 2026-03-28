const EMOJI = {
  correct: "🟩",
  present: "🟨",
  absent: "⬛",
};

export function generateShareGrid(guesses) {
  return guesses
    .filter((row) => row.some((c) => c.status))
    .map((row) => row.map((cell) => EMOJI[cell.status]).join(""))
    .join("\n");
}

export function getShareText({ win, attempts, maxAttempts, dayIndex }) {
  const score = win ? `${attempts}/${maxAttempts}` : `X/${maxAttempts}`;
  return `Blue Archive Wordle #${dayIndex} ${score}`;
}

export function getDayIndex() {
  return Math.floor(
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")
      .split("")
      .reduce((a, b) => a + Number(b), 0)
  );
}

export async function shareResult(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Hasil disalin ke clipboard");
  } catch (error) {
    alert("Gagal menyalin", error);
  }
}