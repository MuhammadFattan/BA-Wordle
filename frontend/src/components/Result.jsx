import React from "react";

const Result = ({ message, wikiInfo, isCorrect, gameOver }) => {
  if (!message && !wikiInfo) return null;

  const messageClasses = gameOver
    ? isCorrect
      ? "text-green-800"
      : "text-gray-800"
    : "text-gray-700";

  const messageBg = gameOver
    ? isCorrect
      ? "bg-green-50 border border-green-200"
      : "bg-gray-50 border border-gray-200"
    : "bg-white";

  return (
    <div className="w-full flex flex-col items-center mb-4">
      {message && (
        <div className={`mb-4 w-full max-w-md px-4 py-3 rounded-lg shadow-sm ${messageBg}`}>
          <p className={`text-center text-lg font-semibold ${messageClasses}`}>{message}</p>
        </div>
      )}

      {wikiInfo && (
        <div className="w-full max-w-md bg-white rounded-lg shadow px-4 py-4 text-left">
          <h2 className="text-lg font-bold text-gray-800">{wikiInfo.title}</h2>
          {wikiInfo.description && (
            <p className="mt-2 text-gray-700 text-sm">{wikiInfo.description}</p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <a
              href={wikiInfo.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Baca di Wiki
            </a>

            <span className="text-xs text-gray-500">• Sumber terkait</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
