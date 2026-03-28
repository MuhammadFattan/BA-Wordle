import { useState, useCallback, useRef } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timerRefs = useRef({});

  const showToast = useCallback((message, type = "info", duration = 2000) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    timerRefs.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timerRefs.current[id];
    }, duration);

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    if (timerRefs.current[id]) {
      clearTimeout(timerRefs.current[id]);
      delete timerRefs.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}