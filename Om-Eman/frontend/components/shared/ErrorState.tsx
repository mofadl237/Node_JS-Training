import type { ReactNode } from "react";
import { ErrorIllustration } from "@/components/shared/ErrorIllustration";
import { cn } from "@/lib/utils";

interface IProps {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}

// Friendly error state (C6). Text is passed translated by the caller; the
// illustration paints with tokens only. Route-level fallback stays in
// error.tsx — this is for inline sections.
export const ErrorState = ({ title, body, action, className }: IProps) => (
  <div className={cn("flex flex-col items-center gap-4 py-16 text-center", className)}>
    <ErrorIllustration className="size-24 text-danger/70" />
    <h3 className="font-display text-xl text-ink">{title}</h3>
    <p className="max-w-sm text-ink-soft">{body}</p>
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);
