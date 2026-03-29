import { useEffect, useState } from "react";

const MODAL_DELAY = 1800;

const Result = ({ message, wikiInfo, isCorrect, gameOver }) => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!gameOver) return;

    const delayTimer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setShow(true), 10);
    }, MODAL_DELAY);

    return () => clearTimeout(delayTimer);
  }, [gameOver]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center px-4
        bg-black/60 backdrop-blur-sm
        transition-opacity duration-300
        ${show ? "opacity-100" : "opacity-0"}
      `}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`
          relative bg-white w-full max-w-md rounded-2xl shadow-xl
          flex flex-col gap-4 p-6
          transition-all duration-300
          ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <button
          onClick={handleClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition"
        >
          ✕
        </button>

        <div className="text-center">
          <span className="text-4xl">{isCorrect ? "🎉" : "😔"}</span>
          <h2
            className={`mt-2 text-xl font-bold ${
              isCorrect ? "text-green-700" : "text-gray-800"
            }`}
          >
            {message}
          </h2>
        </div>

        {wikiInfo && (
          <div
            className={`
              rounded-xl px-4 py-4 text-left border
              ${isCorrect ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
            `}
          >
            <h3 className="text-base font-bold text-gray-800">{wikiInfo.title}</h3>
            {wikiInfo.description && (
              <p className="mt-1 text-gray-600 text-sm leading-relaxed">
                {wikiInfo.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3">
              <a
                href={wikiInfo.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Baca di Wiki →
              </a>
              <span className="text-xs text-gray-400">• Blue Archive Wiki</span>
            </div>
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Result;