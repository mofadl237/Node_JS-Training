"use client";

import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import MobileNavMenu from "./MobileNavMenu";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { CartLink } from "./CartLink";
import { cn } from "@/lib/utils";
import { headerControlClass, headerSkeletonClass } from "./headerStyles";

interface IProps {
  className?: string;
}

const HeaderActions = ({ className }: IProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const t = useTranslations("header");

  const closeMenuAndRestoreFocus = useCallback(() => {
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector("[data-navbar-popover] [aria-expanded='true']")) return;
      closeMenuAndRestoreFocus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenuAndRestoreFocus, isMenuOpen]);

  return (
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      <div className="hidden items-center gap-2 sm:flex" data-navbar-popover="">
        <Suspense fallback={<div className={headerSkeletonClass} aria-hidden="true" />}>
          <LocaleSwitcher />
        </Suspense>
        <ThemeSwitcher />
      </div>
      <CartLink />
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isMenuOpen}
        aria-haspopup="dialog"
        aria-controls={isMenuOpen ? menuId : undefined}
        title={isMenuOpen ? t("closeMenu") : t("openMenu")}
        className={cn(headerControlClass, "sm:hidden")}
      >
        {isMenuOpen ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>
      <MobileNavMenu id={menuId} isOpen={isMenuOpen} onClose={closeMenuAndRestoreFocus} />
    </div>
  );
};

export default HeaderActions;
