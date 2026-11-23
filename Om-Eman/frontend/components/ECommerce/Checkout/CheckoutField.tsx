"use client";

import { memo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface IProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  errorKey?: string;
  hint?: string;
  className?: string;
}

const CheckoutField = ({
  label,
  htmlFor,
  children,
  errorKey,
  hint,
  className,
}: IProps) => {
  const t = useTranslations();
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
      {errorKey ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {t(errorKey)}
        </p>
      ) : null}
    </div>
  );
};

export default memo(CheckoutField);
