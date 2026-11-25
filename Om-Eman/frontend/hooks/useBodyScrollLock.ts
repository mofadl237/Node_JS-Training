"use client";

import { useEffect } from "react";

const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked || typeof document === "undefined" || typeof window === "undefined") return;

    const media = window.matchMedia("(min-width: 640px)");
    let previous = document.body.style.overflow;

    const lock = () => {
      if (!media.matches && document.body.style.overflow !== "hidden") {
        previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
    };

    const unlock = () => {
      if (document.body.style.overflow === "hidden") document.body.style.overflow = previous;
    };

    const sync = () => {
      if (media.matches) unlock();
      else lock();
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      unlock();
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
