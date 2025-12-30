const StatsModal = ({ stats, onClose }) => {
  if (!stats) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-80 rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-center font-bold text-lg mb-4">
          STATISTICS
        </h2>

        <div className="grid grid-cols-4 text-center gap-2 mb-6">
          <Stat label="Played" value={stats.played} />
          <Stat label="Wins" value={stats.wins} />
          <Stat label="Streak" value={stats.currentStreak} />
          <Stat label="Max" value={stats.maxStreak} />
        </div>

        <h3 className="font-semibold mb-2">Guess Distribution</h3>

        {Object.entries(stats.guessDistribution).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 text-sm">
            <span className="w-3">{k}</span>
            <div className="bg-green-500 h-5 px-2 text-white flex items-center"
                 style={{ width: `${v * 20 + 20}px` }}>
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs uppercase">{label}</div>
  </div>
);

export default StatsModal;
