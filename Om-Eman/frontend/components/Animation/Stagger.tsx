"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { staggerContainer } from "./staggerVariants";

interface IProps {
  children: ReactNode;
  className?: string;
}

export const Stagger = ({ children, className }: IProps) => (
  <m.div
    className={className}
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    {children}
  </m.div>
);
