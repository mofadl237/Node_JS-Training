"use client";

import { useEffect, type RefObject } from "react";

interface IProps<T extends HTMLElement> {
  isOpen: boolean;
  panelRef: RefObject<T | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const useDialogFocus = <T extends HTMLElement>({
  isOpen,
  panelRef,
  initialFocusRef,
}: IProps<T>) => {
  useEffect(() => {
    if (!isOpen) return;
    initialFocusRef?.current?.focus();
  }, [initialFocusRef, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLES);
      if (!panel || !focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen, panelRef]);
};

export default useDialogFocus;
