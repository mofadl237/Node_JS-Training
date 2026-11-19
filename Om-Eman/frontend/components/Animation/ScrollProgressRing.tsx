"use client";

import { m, useTransform, type MotionValue } from "motion/react";

const SIZE = 48;
const CENTER = 24;
const RING_RADIUS = 22;
const INNER_RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface IProps {
  progress: MotionValue<number>;
}

export const ScrollProgressRing = ({ progress }: IProps) => {
  // 1- state
  const dashOffset = useTransform(progress, [0, 1], [CIRCUMFERENCE, 0]);
  const waterY = useTransform(progress, [0, 1], [44, 4]);

  // 3- render
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
      <defs>
        <clipPath id="back-to-top-water">
          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} />
        </clipPath>
      </defs>
      <g clipPath="url(#back-to-top-water)">
        <m.g style={{ y: waterY }}>
          <rect x="0" y="0" width={SIZE} height={SIZE} className="fill-primary/30" />
          <m.path
            d="M0 4 Q6 0 12 4 T24 4 T36 4 T48 4 T60 4 T72 4 V52 H0 Z"
            className="fill-primary/45"
            animate={{ x: [0, -24] }}
            transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
          />
        </m.g>
      </g>
      <circle cx={CENTER} cy={CENTER} r={RING_RADIUS} fill="none" strokeWidth="3" className="stroke-primary/20" />
      <m.circle
        cx={CENTER}
        cy={CENTER}
        r={RING_RADIUS}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-primary"
        transform={`rotate(-90 ${CENTER} ${CENTER})`}
        style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: dashOffset }}
      />
    </svg>
  );
};
