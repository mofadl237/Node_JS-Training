"use client";

import { Suspense, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import MobileNavItems from "./MobileNavItems";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import useDialogFocus from "@/hooks/useDialogFocus";
import { cn } from "@/lib/utils";
import { headerControlClass, headerSkeletonClass } from "./headerStyles";

interface IProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavMenu = ({ id, isOpen, onClose }: IProps) => {
  const t = useTranslations("header");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useBodyScrollLock(isOpen);
  useDialogFocus({ isOpen, panelRef, initialFocusRef: closeButtonRef });

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <m.button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-28 z-40 cursor-default bg-ink/25 backdrop-blur-sm sm:hidden"
          />
          <m.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label={t("menuTitle")}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-28 z-50 overflow-x-hidden overflow-y-auto overscroll-contain border-t border-ink/10 bg-paper/95 px-4 pb-8 pt-5 shadow-floating backdrop-blur-xl sm:hidden"
          >
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate font-display text-lg font-bold text-ink">{t("menuTitle")}</p>
                  <p className="truncate text-xs text-ink-soft">{t("brandTagline")}</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label={t("closeMenu")}
                  title={t("closeMenu")}
                  className={cn(headerControlClass, "shrink-0")}
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
              <MobileNavItems onClose={onClose} />
              <div className="flex items-center gap-2 border-t border-ink/10 pt-4" data-navbar-popover="">
                <Suspense fallback={<div className={headerSkeletonClass} aria-hidden="true" />}>
                  <LocaleSwitcher />
                </Suspense>
                <ThemeSwitcher />
              </div>
            </div>
          </m.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileNavMenu;
