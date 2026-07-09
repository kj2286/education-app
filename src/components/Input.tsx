"use client";

import type { ChangeEvent, InputHTMLAttributes } from "react";

export type InputType = "text" | "email" | "password";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  type?: InputType;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** When true, renders the error state (red border + ring). US-010 §3. */
  error?: boolean;
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  error = false,
  className = "",
  ...props
}: InputProps) {
  // focus -> blue border, error -> red border (US-010 §3)
  const stateStyles = error
    ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/40"
    : "border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]/40";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-invalid={error || undefined}
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${stateStyles} ${className}`}
      {...props}
    />
  );
}
