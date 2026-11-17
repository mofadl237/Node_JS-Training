"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IProps {
  children: ReactNode;
  className?: string;
}

// Ambient hover spotlight: a radial glow follows the pointer via two CSS
// custom properties written directly on the element (no React state, so no
// re-renders). The glow only exists under @media (hover: hover) — no glow on
// touch devices — and is painted from the theme token --color-glow.
export const Spotlight = ({ children, className }: IProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={cn("spotlight relative", className)}>
      {children}
      <div className="spotlight-overlay pointer-events-none" aria-hidden="true" />
    </div>
  );
};
