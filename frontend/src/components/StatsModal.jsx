const StatsModal = ({ stats, onClose }) => {
  if (!stats) return null;

  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  const distributionValues = Object.values(stats.guessDistribution || {});
  const maxValue = distributionValues.length ? Math.max(...distributionValues) : 1;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Statistics"
    >
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-lg">
        <button
          onClick={onClose}
          aria-label="Close statistics"
          className="absolute top-3 right-3 text-gray-600 hover:bg-gray-100 p-1 rounded-md"
        >
          ✕
        </button>

        <h2 className="text-center font-bold text-lg text-gray-800 mb-4">
          STATISTICS
        </h2>

        <div className="grid grid-cols-4 gap-4 text-center mb-4">
          <Stat label="Played" value={stats.played} />
          <Stat label="Wins" value={stats.wins} />
          <Stat label="Win %" value={`${winRate}%`} />
          <Stat label="Streak" value={stats.currentStreak} />
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Guess Distribution</h3>

        {stats.played === 0 ? (
          <div className="text-sm text-gray-600">Belum ada statistik.</div>
        ) : (
          <div className="space-y-2">
            {Object.entries(stats.guessDistribution)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <div className="w-6 text-right text-gray-700">{k}</div>

                  <div className="flex-1 bg-gray-200 h-6 rounded overflow-hidden">
                    <div
                      className="bg-green-500 h-full text-white flex items-center px-3 text-sm"
                      style={{ width: `${(v / maxValue) * 100}%` }}
                    >
                      {v}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-xs uppercase text-gray-500">{label}</div>
  </div>
);

export default StatsModal;
