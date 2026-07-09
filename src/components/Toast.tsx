"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-[#DC2626] text-white",
  info: "bg-[#2563EB] text-white",
};

const EXIT_MS = 200; // matches the toast-out animation in globals.css

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Begin the fade-out shortly before the full duration elapses so the
    // 200ms exit animation finishes right around `duration`.
    const startExitAt = Math.max(duration - EXIT_MS, 0);

    const exitTimer = setTimeout(() => {
      setLeaving(true);
    }, startExitAt);

    const dismissTimer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, startExitAt + EXIT_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onDismiss]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
        leaving ? "toast-exit" : "toast-enter"
      } ${typeStyles[type]}`}
    >
      {message}
    </div>
  );
}
