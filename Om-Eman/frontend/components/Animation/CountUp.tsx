"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface IProps {
  value: number;
  className?: string;
  suffix?: string;
  decimals?: number;
}

export const CountUp = ({ value, className, suffix = "", decimals = 0 }: IProps) => {
  // 1- state
  const ref = useRef<HTMLSpanElement>(null);
  const wasVisibleAtMount = useRef<boolean | null>(null);
  const hasAnimated = useRef(false);
  const previousValue = useRef(value);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  // 2- handlers
  useEffect(() => {
    const element = ref.current;
    if (element === null) return undefined;

    const format = (input: number) => `${input.toFixed(decimals)}${suffix}`;
    const writeFinal = () => {
      element.textContent = format(value);
    };

    if (wasVisibleAtMount.current === null) {
      wasVisibleAtMount.current = element.getClientRects().length > 0;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const valueChanged = previousValue.current !== value;
    previousValue.current = value;

    const shouldAnimate =
      valueChanged || (isInView && wasVisibleAtMount.current === false && !hasAnimated.current);

    if (!shouldAnimate || reducedMotion) {
      writeFinal();
      return undefined;
    }

    hasAnimated.current = true;
    motionValue.jump(0);
    element.textContent = format(0);
    const controls = animate(motionValue, value, {
      type: "spring",
      stiffness: 300,
      damping: 24,
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = format(latest);
        }
      },
    });
    const spin = animate(
      element,
      { rotateX: [-100, 18, 0], rotateZ: [-10, 5, 0], scale: [0.7, 1.15, 1], opacity: [0.3, 1] },
      { duration: 0.55, ease: "easeOut" },
    );

    return () => {
      controls.stop();
      spin.stop();
    };
  }, [value, isInView, motionValue, suffix, decimals]);

  // 3- render
  return (
    <span ref={ref} className={cn("inline-block tabular-nums [transform-style:preserve-3d]", className)}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
