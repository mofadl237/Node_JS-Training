"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
  isShaking: boolean;
}

export const Shake = ({ children, className, isShaking }: IProps) => (
  <m.div
    className={className}
    animate={isShaking ? { x: [0, -8, 8, -8, 8, -6, 0] } : { x: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </m.div>
);
