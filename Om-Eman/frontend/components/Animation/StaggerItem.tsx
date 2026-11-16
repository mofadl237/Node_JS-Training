"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { staggerItem } from "./staggerVariants";

interface IProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className }: IProps) => (
  <m.div className={className} variants={staggerItem}>
    {children}
  </m.div>
);
