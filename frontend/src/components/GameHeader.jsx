export default function GameHeader({ onShowStats }) {
  return (
    <div className="w-full max-w-md flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Blue Archive Wordle</h1>

      <button
        onClick={onShowStats}
        className="text-2xl hover:scale-110 transition"
        aria-label="Show Statistics"
      >
        📊
      </button>
    </div>
  );
}
