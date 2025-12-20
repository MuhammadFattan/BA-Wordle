const Keyboard = ({ onKeyPress, keyStatus = {}, disabled = false }) => {
  const getKeyColor = (key) => {
    const map = {
      correct: "bg-green-500 text-white",
      present: "bg-yellow-400 text-white",
      absent: "bg-gray-500 text-white",
    };
    return map[keyStatus[key]] || "bg-gray-300 text-black";
  };
  
  return (
    <div className={`grid grid-rows-3 gap-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex justify-center gap-1">
        {"QWERTYUIOP".split("").map((key) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            disabled={disabled}
            className={`
              w-8 h-10 rounded
              flex items-center justify-center
              font-bold uppercase
              transition-colors duration-200
              ${getKeyColor(key)}
            `}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-1">
        {"ASDFGHJKL".split("").map((key) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            disabled={disabled}
            className={`w-8 h-10 rounded
              flex items-center justify-center
              font-bold uppercase
              transition-colors duration-200
              ${getKeyColor(key)}
            `}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-1">
        <button
          onClick={() => onKeyPress("ENTER")}
          disabled={disabled}
          className="px-4 h-10 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
        >
          ENTER
        </button>
        {"ZXCVBNM".split("").map((key) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            disabled={disabled}
            className={`w-8 h-10 rounded
              flex items-center justify-center
              font-bold uppercase
              transition-colors duration-200
              ${getKeyColor(key)}
            `}
          >
            {key}
          </button>
        ))}
        <button
          onClick={() => onKeyPress("BACKSPACE")}
          disabled={disabled}
          className="px-4 h-10 bg-red-500 hover:bg-red-600 text-white font-bold rounded flex items-center justify-center"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
