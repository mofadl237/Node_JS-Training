"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface IProps {
  value: number;
  className?: string;
  suffix?: string;
}

export const CountUp = ({ value, className, suffix = "" }: IProps) => {
  // 1- state
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  // 2- handlers
  useEffect(() => {
    if (!isInView || ref.current === null) return undefined;

    const controls = animate(motionValue, value, {
      type: "spring",
      stiffness: 300,
      damping: 24,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, value, motionValue, suffix]);

  // 3- render
  return <span ref={ref} className={cn("tabular-nums", className)}>0</span>;
};
