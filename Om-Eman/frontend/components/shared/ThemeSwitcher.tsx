"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/Providers/ThemeProvider";
import { THEMES } from "@/lib/theme";
import type { TThemeName } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
  labelNamespace?: "theme" | "design";
}

export const ThemeSwitcher = ({ className, labelNamespace = "theme" }: IProps) => {
  // 1- state
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations(labelNamespace);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // 2- handlers
  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const onToggle = useCallback(() => setIsOpen((previous) => !previous), []);
  const onSelect = useCallback(
    (name: TThemeName) => {
      setTheme(name);
      close();
    },
    [close, setTheme],
  );
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  const triggerLabel = labelNamespace === "design" ? t("themes") : t("label");

  // 3- render
  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? menuId : undefined}
        className="grid size-10 place-items-center rounded-sm bg-surface text-ink shadow-rest transition-transform duration-150 hover:scale-105"
      >
        <Palette className="size-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              className="fixed inset-0 z-40 cursor-default"
              onClick={close}
            />
            <m.div
              id={menuId}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute end-0 top-full z-50 mt-2 flex gap-3 rounded-md bg-surface p-3 shadow-floating"
            >
              {THEMES.map((option, index) => (
                <m.button
                  key={option.name}
                  type="button"
                  aria-label={t(option.labelKey)}
                  aria-pressed={theme === option.name}
                  onClick={() => onSelect(option.name)}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "relative grid size-9 place-items-center rounded-full shadow-rest transition-transform duration-150 hover:scale-110",
                    theme === option.name && "ring-2 ring-ink ring-offset-2 ring-offset-surface",
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${option.paper} 50%, ${option.primary} 50%)`,
                  }}
                >
                  <AnimatePresence>
                    {theme === option.name && (
                      <m.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="grid size-5 place-items-center rounded-full bg-surface text-ink shadow-rest"
                      >
                        <Check className="size-3" aria-hidden="true" />
                      </m.span>
                    )}
                  </AnimatePresence>
                </m.button>
              ))}
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
