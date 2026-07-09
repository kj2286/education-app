"use client";

import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({ children, onClick, className = "" }: CardProps) {
  const interactive = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        interactive
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
