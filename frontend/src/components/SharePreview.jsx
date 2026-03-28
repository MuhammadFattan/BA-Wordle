import { useEffect, useState } from "react";

export default function SharePreview({ results, isGameOver }) {
  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    if (!isGameOver) return;

    let i = 0;
    const interval = setInterval(() => {
      setVisibleRows(v => v + 1);
      i++;
      if (i >= results.length) clearInterval(interval);
    }, 400);

    return () => clearInterval(interval);
  }, [isGameOver, results]);

  if (!isGameOver) return null;

  return (
    <div className="mt-4 space-y-1">
      {results.slice(0, visibleRows).map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1 justify-center">
          {row.map((cell, cIdx) => (
            <div
              key={cIdx}
              className={`w-6 h-6 ${colorMap[cell]} flip`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}