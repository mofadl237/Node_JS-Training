"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_CARD } from "@/lib/motion";

interface IProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export const ScaleOnHover = ({ children, className, scale = 1.02 }: IProps) => (
  <m.div
    className={className}
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={SPRING_CARD}
  >
    {children}
  </m.div>
);
