import { useEffect, useState } from "react";

const colorMap = {
  correct: "bg-green-500",
  present: "bg-yellow-500",
  absent: "bg-gray-400",
  "": "bg-gray-200",
};

export default function SharePreview({
  guesses = [],
  isCorrect,
  attempts,
  dayIndex,
  onClose,
  onCopy,
}) {
  const filledRows = guesses.filter((row) => row.some((cell) => cell.status));

  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    setVisibleRows(0);
    let i = 0;
    const interval = setInterval(() => {
      setVisibleRows((v) => v + 1);
      i++;
      if (i >= filledRows.length) clearInterval(interval);
    }, 400);

    return () => clearInterval(interval);
  }, [filledRows.length]);

  const handleCopy = () => {
    onCopy?.();
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-sm rounded-xl p-6 relative shadow-lg flex flex-col items-center gap-4">
        {/* tombol tutup */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 p-1 rounded-md"
        >
          X
        </button>

        <h2 className="font-bold text-gray-800 text-lg">
          Wordle BA #{dayIndex}
        </h2>

        <p className="text-sm text-gray-500">
          {isCorrect ? `✅ Selesai dalam ${attempts}/6` : "❌ Gagal"}
        </p>

        {/* grid animasi */}
        <div className="space-y-1">
          {filledRows.slice(0, visibleRows).map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-center">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className={`w-7 h-7 rounded-sm ${colorMap[cell.status] ?? colorMap[""]}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* tombol copy */}
        <button
          onClick={handleCopy}
          className="mt-2 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>📋</span>
          <span>Salin ke Clipboard</span>
        </button>
      </div>
    </div>
  );
}
