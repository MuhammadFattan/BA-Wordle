import { useState } from "react";
import SharePreview from "./SharePreview";

export default function GameActions({ 
  onBackToMenu,
  onShare,
  guesses, 
  isCorrect, 
  attempts, 
  dayIndex 
}) {
  const [showSharePreview, setShowSharePreview] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Kembali Ke Menu
        </button>

        <button
          onClick={() => setShowSharePreview(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <span>🎯</span>
          <span>Share Hasil</span>
        </button>
      </div>

      {showSharePreview && (
        <SharePreview
          guesses={guesses}
          isCorrect={isCorrect}
          attempts={attempts}
          dayIndex={dayIndex}
          onClose={() => setShowSharePreview(false)}
          onCopy={onShare}
        />
      )}
    </>
  );
}