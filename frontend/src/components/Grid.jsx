import React from "react";

const Grid = ({ guesses = [] }) => {
  const getCellColor = (status) => {
    if (status === "correct") return "bg-green-500 text-white";
    if (status === "present") return "bg-yellow-500 text-white";
    if (status === "absent") return "bg-gray-400 text-white";
    return "bg-white text-black";
  };
  
  return (
    <div className="grid grid-rows-6 gap-2 mb-8">
      {guesses.map(
        (
          row = Array.from({ length: 5 }, () => ({ letter: "", status: "" })),
          rowIndex
        ) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`
                w-12 h-12 border-2
                flex items-center justify-center
                text-xl font-bold uppercase
                transition-all duration-300
                ${getCellColor(cell?.status)}
                ${cell?.status ? "flip" : ""}
                delay-${colIndex}
              `}
              >
                {cell?.letter || ""}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Grid;
