"use client";

import { useSyncExternalStore } from "react";

const SCROLL_THRESHOLD = 10;

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  document.addEventListener("scroll", onStoreChange, { passive: true, capture: true });
  return () => {
    window.removeEventListener("scroll", onStoreChange);
    document.removeEventListener("scroll", onStoreChange, { capture: true });
  };
};

const getSnapshot = () => {
  const scrollTop = window.scrollY || document.scrollingElement?.scrollTop || document.documentElement.scrollTop || 0;
  return scrollTop > SCROLL_THRESHOLD;
};

const getServerSnapshot = () => false;

export const useIsScrolled = (): boolean => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
