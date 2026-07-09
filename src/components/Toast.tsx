"use client";

import { useEffect, useState } from "react";

/**
 * Figma toast: dark pill, fixed bottom-center, supports an optional bold
 * title line plus a regular message line. Auto-dismisses after `duration`.
 *
 * Legacy props (`type`) are still accepted so older call sites keep
 * compiling; `type` no longer changes the visual style since the Figma
 * design uses a single dark pill for every toast.
 */
export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: number;
  title?: string;
  message: string;
}

export interface ToastProps {
  message: string;
  title?: string;
  /** @deprecated kept for backward compatibility; no longer affects style */
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const EXIT_MS = 200; // matches the toast-pill-out animation in globals.css

export function Toast({ message, title, duration = 2500, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
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
      className={`fixed left-1/2 z-50 -translate-x-1/2 rounded-full px-8 py-3.5 text-center text-white shadow-lg ${
        leaving ? "toast-pill-exit" : "toast-pill-enter"
      }`}
      style={{ bottom: "120px", backgroundColor: "#3A3A3FE6" }}
    >
      {title ? <p className="text-sm font-bold leading-snug">{title}</p> : null}
      <p className="text-sm font-normal leading-snug">{message}</p>
    </div>
  );
}

/**
 * Renders the currently active toast (if any). Used internally by
 * ToastProvider — page authors should call `useToast().toast(...)` instead
 * of rendering this directly.
 */
export function ToastViewport({
  toast,
  duration,
  onDismiss,
}: {
  toast: ToastData | null;
  duration: number;
  onDismiss: () => void;
}) {
  if (!toast) {
    return null;
  }
  return (
    <Toast
      key={toast.id}
      title={toast.title}
      message={toast.message}
      duration={duration}
      onDismiss={onDismiss}
    />
  );
}
