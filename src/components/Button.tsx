"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  disabled?: boolean;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  // hover -> darker shade, active -> darker + inset border ring (US-010 §3)
  primary:
    "bg-[#2563EB] text-white border border-transparent hover:bg-[#1d4ed8] active:bg-[#1e40af] active:border-[#1e3a8a] focus-visible:ring-[#2563EB]",
  secondary:
    "bg-white text-[#2563EB] border border-[#2563EB] hover:bg-blue-50 active:bg-blue-100 active:border-[#1d4ed8] focus-visible:ring-[#2563EB]",
};

export function Button({
  variant = "primary",
  disabled = false,
  children,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-transparent disabled:hover:bg-gray-300 disabled:active:scale-100 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
