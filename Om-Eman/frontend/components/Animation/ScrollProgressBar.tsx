"use client";

import { m, useScroll } from "motion/react";

export const ScrollProgressBar = () => {
  // 1- state
  const { scrollYProgress } = useScroll();

  // 2- handlers

  // 3- render
  return (
    <m.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary rtl:origin-right"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
