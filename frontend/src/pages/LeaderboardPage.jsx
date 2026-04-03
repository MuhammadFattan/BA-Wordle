import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3001";

const MEDAL = { 0: "🥇", 1: "🥈", 2: "🥉" };

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("ba_wordle_token");
  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1]))?.id
    : null;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat leaderboard.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 transition text-lg"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex-1">
            Leaderboard
          </h1>
          <span className="text-2xl">🏆</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8 text-red-500 text-sm">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && rows.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Belum ada data. Jadilah yang pertama main!
          </div>
        )}

        {/* Table */}
        {!loading && rows.length > 0 && (
          <div className="flex flex-col gap-2">
            {/* Column headers */}
            <div className="grid grid-cols-[32px_1fr_48px_48px_56px] gap-2 px-3 text-xs text-gray-400 uppercase font-semibold">
              <div>#</div>
              <div>Player</div>
              <div className="text-center">Main</div>
              <div className="text-center">Menang</div>
              <div className="text-center">Streak</div>
            </div>

            {rows.map((row, i) => {
              const isMe = row.id === currentUserId;
              return (
                <div
                  key={row.id}
                  className={`
                    grid grid-cols-[32px_1fr_48px_48px_56px] gap-2 items-center
                    px-3 py-3 rounded-xl border transition
                    ${
                      isMe
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-100"
                    }
                  `}
                >
                  {/* Rank */}
                  <div className="text-sm font-bold text-gray-500">
                    {MEDAL[i] ?? <span className="text-xs">{i + 1}</span>}
                  </div>

                  {/* Avatar + name */}
                  <div className="flex items-center gap-2 min-w-0">
                    {row.avatar ? (
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="w-8 h-8 rounded-full shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        {row.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <span
                      className={`text-sm truncate font-medium ${isMe ? "text-blue-700" : "text-gray-800"}`}
                    >
                      {row.name ?? "Anonymous"}
                      {isMe && (
                        <span className="ml-1 text-xs text-blue-400">
                          (kamu)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Played */}
                  <div className="text-center text-sm text-gray-600">
                    {row.played}
                  </div>

                  {/* Wins */}
                  <div className="text-center text-sm font-semibold text-green-600">
                    {row.wins}
                  </div>

                  {/* Max streak */}
                  <div className="text-center text-sm text-gray-600">
                    🔥 {row.max_streak}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
