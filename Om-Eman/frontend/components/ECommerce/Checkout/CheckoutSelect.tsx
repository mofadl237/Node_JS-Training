"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ICheckoutSelectOption {
  value: string;
  label: string;
}

export interface ICheckoutSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly ICheckoutSelectOption[];
  hasError?: boolean;
}

export const CheckoutSelect = forwardRef<HTMLSelectElement, ICheckoutSelectProps>(
  ({ options, hasError, className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-sm border bg-surface px-3 text-ink transition-colors duration-150 focus:outline-2 focus:outline-offset-0 disabled:opacity-50",
        hasError
          ? "border-danger focus:outline-danger"
          : "border-ink/15 focus:outline-primary",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
);

CheckoutSelect.displayName = "CheckoutSelect";
