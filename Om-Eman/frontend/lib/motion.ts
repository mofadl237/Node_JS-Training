import type { Transition } from "motion/react";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const SPRING_CARD: Transition = { type: "spring", stiffness: 300, damping: 24 };
