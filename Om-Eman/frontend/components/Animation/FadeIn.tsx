"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

export type TFadeDirection = "up" | "down" | "start" | "end";

interface IProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: TFadeDirection;
}

const OFFSETS: Record<TFadeDirection, { x?: number; y?: number }> = {
  up: { y: 16 },
  down: { y: -16 },
  start: { x: -16 },
  end: { x: 16 },
};

export const FadeIn = ({ children, className, delay = 0, direction = "up" }: IProps) => (
  <m.div
    initial={{ opacity: 0, ...OFFSETS[direction] }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay, ease: EASE_OUT }}
    className={className}
  >
    {children}
  </m.div>
);
