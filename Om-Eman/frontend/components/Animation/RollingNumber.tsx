"use client";

import { useEffect, useRef } from "react";
import { useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

interface IProps {
  value: number;
  className?: string;
  suffix?: string;
}

export const RollingNumber = ({ value, className, suffix = "" }: IProps) => {
  // 1- state
  const [scope, animate] = useAnimate();
  const previousValue = useRef(value);

  // 2- handlers
  useEffect(() => {
    if (previousValue.current === value) return undefined;
    previousValue.current = value;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    void animate(
      scope.current,
      { rotateX: [-100, 18, 0], rotateZ: [-12, 6, 0], scale: [0.65, 1.2, 1], opacity: [0.2, 1] },
      { duration: 0.55, ease: "easeOut" },
    );
    return undefined;
  }, [value, animate, scope]);

  // 3- render
  return (
    <span ref={scope} className={cn("inline-block tabular-nums [transform-style:preserve-3d]", className)}>
      {value}
      {suffix}
    </span>
  );
};
