import React, { useEffect, useRef, useState } from "react";

const FLIP_DELAY_PER_COL = 0.15;
const FLIP_DURATION = 0.5;

const Grid = ({ guesses = [] }) => {
  const [flippingRow, setFlippingRow] = useState(null);
  const prevGuessesRef = useRef(guesses);

  useEffect(() => {
    const prev = prevGuessesRef.current;

    for (let i = 0; i < guesses.length; i++) {
      const rowJustSubmitted =
        guesses[i].some((c) => c.status) &&
        prev[i].every((c) => !c.status);

      if (rowJustSubmitted) {
        setTimeout(() => setFlippingRow(i), 0);

        const totalDuration =
          (FLIP_DURATION + FLIP_DELAY_PER_COL * 4) * 1000 + 100;
        const timer = setTimeout(() => setFlippingRow(null), totalDuration);

        prevGuessesRef.current = guesses;
        return () => clearTimeout(timer);
      }
    }

    prevGuessesRef.current = guesses;
  }, [guesses]);

  const getCellStyle = (status, colIndex, isFlipping) => {
    const baseDelay = isFlipping ? colIndex * FLIP_DELAY_PER_COL : 0;

    if (!status) {
      return {
        backgroundColor: "white",
        color: "black",
        animationDelay: `${baseDelay}s`,
      };
    }

    const colors = {
      correct: { bg: "#22c55e", text: "white" },
      present: { bg: "#eab308", text: "white" },
      absent:  { bg: "#9ca3af", text: "white" },
    };

    const color = colors[status] ?? { bg: "white", text: "black" };

    return {
      backgroundColor: color.bg,
      color: color.text,
      animationDelay: `${baseDelay}s`,
    };
  };

  return (
    <div className="grid grid-rows-6 gap-2 mb-8">
      {guesses.map((row = Array.from({ length: 5 }, () => ({ letter: "", status: "" })), rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {row.map((cell, colIndex) => {
            const isFlipping = flippingRow === rowIndex;
            const cellStyle = getCellStyle(cell?.status, colIndex, isFlipping);

            return (
              <div
                key={colIndex}
                className={`
                  w-12 h-12 border-2
                  flex items-center justify-center
                  text-xl font-bold uppercase
                  ${isFlipping ? "tile-flip" : ""}
                  ${!cell?.status && !isFlipping ? "border-gray-300" : "border-transparent"}
                `}
                style={cellStyle}
              >
                {cell?.letter || ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;