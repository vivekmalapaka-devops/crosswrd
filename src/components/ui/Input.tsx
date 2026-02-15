"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-surface border border-border rounded-xl text-[15px] text-text font-sans outline-none transition-all duration-200 focus:border-text placeholder:text-border ${className}`}
        {...props}
      />
    );
  }
);
