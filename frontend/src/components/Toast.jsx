import { useEffect, useState } from "react";

const TOAST_STYLES = {
  error: {
    bg: "bg-red-500",
    icon: "✕",
    iconBg: "bg-red-600",
  },
  success: {
    bg: "bg-green-500",
    icon: "✓",
    iconBg: "bg-green-600",
  },
  info: {
    bg: "bg-gray-800",
    icon: "!",
    iconBg: "bg-gray-700",
  },
  copied: {
    bg: "bg-blue-500",
    icon: "⧉",
    iconBg: "bg-blue-600",
  },
};

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  // trigger enter animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const style = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info;

  return (
    <div
      onClick={() => onDismiss(toast.id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg cursor-pointer text-white text-sm font-medium max-w-xs w-full transition-all duration-300  ease-out select-none ${style.bg} ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
      role="alert"
    >
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${style.iconBg}`}
      >
        {style.icon}
      </span>
      <span className="flex-1">{toast.message}</span>
    </div>
  );
}

export default function Toast({ toasts, onDismiss}) {
  if (!toasts.length) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}