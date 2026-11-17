"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IProps {
  children: ReactNode;
  className?: string;
  durationSeconds?: number;
}

// Infinite horizontal loop (B5): children are rendered twice — the copy is
// aria-hidden and only feeds the 0→-50% translate so the loop is seamless.
// RTL reverses via animation-direction, hover pauses, edges fade by mask.
// With prefers-reduced-motion the track stops animating (the reduced-motion
// fallback keeps items wrapped instead of overflowing).
export const Marquee = ({ children, className, durationSeconds = 30 }: IProps) => (
  <div className={cn("marquee-edge overflow-hidden", className)}>
    <div
      className="marquee-track min-w-full gap-4 motion-reduce:flex-wrap motion-reduce:min-w-0"
      style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
    >
      <div className="flex shrink-0 items-center gap-4 motion-reduce:flex-wrap">{children}</div>
      <div className="flex shrink-0 items-center gap-4 motion-reduce:flex-wrap" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);
