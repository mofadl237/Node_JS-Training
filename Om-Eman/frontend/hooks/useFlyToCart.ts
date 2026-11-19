"use client";

import { useCallback } from "react";
import { animate } from "motion/react";

interface IFlyOptions {
  source: HTMLElement;
  onArrive?: () => void;
}

const FLIGHT_MS = 700;

const findCartTarget = (): HTMLElement | null => {
  const candidates = document.querySelectorAll<HTMLElement>("[data-cart-target]");
  for (const candidate of candidates) {
    if (candidate.getClientRects().length > 0) return candidate;
  }
  return null;
};

// Fly-to-cart (B7, named useFlyToCart — DESIGN_SYSTEM §5.5 lists "FlyToCart"):
// clones the source element once (position:fixed, pointer-events none) and
// flies it to the first visible [data-cart-target] with a curved path (x and y
// use different easings) + scale down + fade. Without a visible target or under
// prefers-reduced-motion it calls onArrive() immediately with no animation.
export const useFlyToCart = (): ((options: IFlyOptions) => void) =>
  useCallback(({ source, onArrive }: IFlyOptions) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = findCartTarget();

    if (reducedMotion || !target) {
      onArrive?.();
      return;
    }

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const clone = source.cloneNode(true) as HTMLElement;

    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.style.cssText = [
      "position:fixed",
      `left:${from.left}px`,
      `top:${from.top}px`,
      `width:${from.width}px`,
      `height:${from.height}px`,
      "margin:0",
      "pointer-events:none",
      "z-index:60",
      "opacity:1",
    ].join(";");

    document.body.appendChild(clone);

    const targetX = to.left + to.width / 2 - (from.left + from.width / 2);
    const targetY = to.top + to.height / 2 - (from.top + from.height / 2);
    const done = () => {
      clone.remove();
      onArrive?.();
    };

    animate(
      clone,
      { x: [0, targetX], y: [0, targetY * 0.4, targetY], scale: [1, 0.9, 0.3], opacity: [1, 1, 0] },
      { duration: FLIGHT_MS / 1000, ease: ["easeIn", "easeOut"] },
    ).finished.then(done, () => clone.remove());
  }, []);
