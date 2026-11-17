"use client";

import { useEffect, useState } from "react";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Rotates a card index on an interval (B3) — used to move the BorderBeam to
// one card at a time. React 19 forbids synchronous setState in effects, so
// the state only changes inside the interval callback. Rotation pauses while
// the tab is hidden and under prefers-reduced-motion.
export const useRotatingIndex = (count: number, intervalMs: number): number => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1 || prefersReducedMotion()) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % count);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [count, intervalMs]);

  return index;
};
