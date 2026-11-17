import type { ReactNode } from "react";
import { EmptyIllustration } from "@/components/shared/EmptyIllustration";
import { cn } from "@/lib/utils";

interface IProps {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}

// Friendly empty state (C6). Text is passed translated by the caller; the
// illustration paints with tokens only.
export const EmptyState = ({ title, body, action, className }: IProps) => (
  <div className={cn("flex flex-col items-center gap-4 py-16 text-center", className)}>
    <EmptyIllustration className="size-24 text-ink-soft/60" />
    <h3 className="font-display text-xl text-ink">{title}</h3>
    <p className="max-w-sm text-ink-soft">{body}</p>
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);
