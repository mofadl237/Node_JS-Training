"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

interface IProps {
  children: ReactNode;
  className?: string;
  pulseKey?: number;
}

// The cart target (B7): renders children with data-cart-target so useFlyToCart
// can find it. When pulseKey changes (e.g. an item arrived) it bounces via
// useAnimate — the element never remounts.
export const CartBounce = ({ children, className, pulseKey = 0 }: IProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (pulseKey === 0) return;
    void animate(
      scope.current,
      { scale: [1, 1.25, 0.95, 1] },
      { duration: 0.45, ease: "easeOut" },
    );
  }, [pulseKey, scope, animate]);

  return (
    <div ref={scope} data-cart-target className={cn("inline-flex", className)}>
      {children}
    </div>
  );
};
