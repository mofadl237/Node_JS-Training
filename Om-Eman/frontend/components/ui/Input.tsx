"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-sm border bg-surface px-4 text-ink transition-colors duration-150 placeholder:text-ink-soft focus:outline-2 focus:outline-offset-0 disabled:opacity-50",
        hasError ? "border-danger focus:outline-danger" : "border-ink/15 focus:outline-primary",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
