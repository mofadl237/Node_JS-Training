"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALES = ["ar", "en"] as const;

export const LocaleSwitcher = () => {
  // 1- state
  const locale = useLocale();
  const t = useTranslations("locale");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const code = locale === "ar" ? "AR" : "EN";
  const queryEntries = Array.from(searchParams.entries());
  const href =
    queryEntries.length > 0 ? { pathname, query: Object.fromEntries(queryEntries) } : pathname;

  // 2- handlers
  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const menu = document.getElementById(menuId);
      if (menu?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen, menuId]);

  // 3- render
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={tHeader("language")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        className="inline-flex h-10 items-center gap-1.5 rounded-sm bg-surface px-2.5 text-sm font-semibold text-ink shadow-rest transition-transform duration-150 hover:scale-105"
      >
        <Globe aria-hidden="true" className="size-4 text-primary" />
        <span>{code}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 text-ink-soft transition-transform duration-150", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <m.div
            id={menuId}
            role="menu"
            aria-label={tHeader("languageMenu")}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-md bg-surface p-1 shadow-floating"
          >
            {LOCALES.map((itemLocale) => {
              const selected = itemLocale === locale;
              const languageName = t(itemLocale);
              return (
                <Link
                  key={itemLocale}
                  href={href}
                  locale={itemLocale}
                  hrefLang={itemLocale}
                  lang={itemLocale}
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm text-ink transition-colors duration-150 hover:bg-surface-2",
                    selected && "bg-surface-2 font-semibold",
                  )}
                >
                  <span>{languageName}</span>
                  {selected ? <Check aria-hidden="true" className="size-4 text-primary" /> : <span className="size-4" />}
                </Link>
              );
            })}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
