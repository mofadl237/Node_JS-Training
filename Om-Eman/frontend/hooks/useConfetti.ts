"use client";

import { useCallback } from "react";
import type { TFireConfetti } from "@/lib/confetti";

// Lazy confetti hook (B6): the canvas engine is imported on the first fire —
// zero cost until something actually celebrates. Nothing fires under
// prefers-reduced-motion.
export const useConfetti = (): TFireConfetti =>
  useCallback((options) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void import("@/lib/confetti").then(({ fire }) => fire(options));
  }, []);
