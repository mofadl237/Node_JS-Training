"use client";

import { cn } from "@/lib/utils";

interface IProps {
  isActive?: boolean;
  className?: string;
}

// Rotating conic-gradient edge (B2). All paint lives in .border-beam (styles/
// animations.css) — tokens only, masked to a 2px ring, radius inherited from
// the wrapper. isActive toggles via data-active (opacity + play-state); where
// @property is unsupported the edge stays static.
export const BorderBeam = ({ isActive = false, className }: IProps) => (
  <div
    aria-hidden="true"
    data-active={isActive}
    className={cn("border-beam", className)}
  />
);
