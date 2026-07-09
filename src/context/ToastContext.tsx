"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ToastViewport, type ToastData } from "@/components/Toast";

export interface ToastInput {
  title?: string;
  message: string;
}

export interface ToastContextType {
  toast: (input: ToastInput) => void;
}

const DEFAULT_DURATION = 2500;

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [current, setCurrent] = useState<ToastData | null>(null);
  const idCounter = useRef(0);

  const toast = useCallback((input: ToastInput) => {
    idCounter.current += 1;
    setCurrent({ id: idCounter.current, title: input.title, message: input.message });
  }, []);

  const dismiss = useCallback(() => {
    setCurrent(null);
  }, []);

  const value: ToastContextType = { toast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toast={current} duration={DEFAULT_DURATION} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
