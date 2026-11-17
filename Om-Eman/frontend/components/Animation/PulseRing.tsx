"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface IProps {
  children?: ReactNode;
  className?: string;
  ringClassName?: string;
}

// Two expanding rings (0s + 0.3s delay) that fire every 6s (B4) — ambient
// layer, colors from the passed token class (default bg-primary). Pauses via
// data-paused when the wrapper leaves the viewport (useInView), so nothing
// animates off-screen. No full WhatsApp button here yet (needs the real
// number from store settings).
export const PulseRing = ({ children, className, ringClassName = "bg-primary" }: IProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });

  return (
    <div ref={ref} data-paused={!isInView} className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className={cn("pulse-ring-layer pointer-events-none absolute inset-0 rounded-full", ringClassName)}
      />
      <span
        aria-hidden="true"
        style={{ animationDelay: "0.3s" }}
        className={cn("pulse-ring-layer pointer-events-none absolute inset-0 rounded-full", ringClassName)}
      />
      {children}
    </div>
  );
};
