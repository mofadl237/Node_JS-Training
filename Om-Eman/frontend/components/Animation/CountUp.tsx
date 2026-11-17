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

// SSR renders the final value (D2-01): SEO/no-JS users and reduced-motion
// users always see `${value}${suffix}`. The 0->value count-up runs only for
// elements that were below the fold at mount and enter the viewport later.
export const CountUp = ({ value, className, suffix = "", decimals = 0 }: IProps) => {
  // 1- state
  const ref = useRef<HTMLSpanElement>(null);
  const wasVisibleAtMount = useRef<boolean | null>(null);
  const hasAnimated = useRef(false);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  // 2- handlers
  useEffect(() => {
    const element = ref.current;
    if (element === null) return undefined;

    const writeFinal = () => {
      element.textContent = `${value.toFixed(decimals)}${suffix}`;
    };

    if (wasVisibleAtMount.current === null) {
      wasVisibleAtMount.current = element.getClientRects().length > 0;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = isInView && wasVisibleAtMount.current === false && !hasAnimated.current && !reducedMotion;

    if (!shouldAnimate) {
      writeFinal();
      return undefined;
    }

    hasAnimated.current = true;
    motionValue.jump(0);
    element.textContent = `${(0).toFixed(decimals)}${suffix}`;
    const controls = animate(motionValue, value, {
      type: "spring",
      stiffness: 300,
      damping: 24,
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${latest.toFixed(decimals)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, motionValue, suffix, decimals]);

  // 3- render
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
