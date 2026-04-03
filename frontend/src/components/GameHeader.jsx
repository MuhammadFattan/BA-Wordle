export default function GameHeader({
  onShowStats,
  onShowLeaderboard,
  hardMode,
  onToggleHardMode,
}) {
  return (
    <div className="w-full max-w-md flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Blue Archive Wordle</h1>

      <div className="flex items-center gap-3">
        {/* Hard Mode toggle */}
        <button
          onClick={onToggleHardMode}
          title={hardMode ? "Hard Mode: ON" : "Hard Mode: OFF"}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            border transition-all duration-200
            ${
              hardMode
                ? "bg-red-500 border-red-600 text-white"
                : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
            }
          `}
        >
          🔥 {hardMode ? "HARD" : "NORMAL"}
        </button>

        {/* Leaderboard button */}
        <button
          onClick={onShowLeaderboard}
          className="text-2xl hover:scale-110 transition"
          aria-label="Leaderboard"
        >
          🏆
        </button>

        {/* Stats button */}
        <button
          onClick={onShowStats}
          className="text-2xl hover:scale-110 transition"
          aria-label="Show Statistics"
        >
          📊
        </button>
      </div>
    </div>
  );
}
