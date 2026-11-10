"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/src/components/ui/Spinner/Spinner";
import { useLogout } from "@/src/hooks/useLogout";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import styles from "./UserMenu.module.scss";

export function UserMenu() {
  // 1- state
  const t = useTranslations("Shell");
  const home = useTranslations("Home");
  const user = useAppSelector(selectCurrentUser);
  const { handleLogout, isLoggingOut } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    if (!user) return "";

    return user.name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  // 2- handlers
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Node && !rootRef.current?.contains(target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  // 3- render
  if (!user) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("userMenu")}
      >
        <span className={styles.avatar}>{initials}</span>
        <span className={styles.meta}>
          <span className={styles.name}>{user.name}</span>
          <span className={styles.role}>
            {home(`roles.${user.role}`)}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={[styles.chevron, isOpen ? styles.chevronOpen : null]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <div className={styles.account}>
            <span className={styles.accountName}>{user.name}</span>
            <span className={styles.accountEmail}>{user.email}</span>
          </div>

          <button
            type="button"
            className={styles.logout}
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-busy={isLoggingOut || undefined}
            role="menuitem"
          >
            {isLoggingOut ? <Spinner size="sm" /> : <LogOut size={17} />}
            <span>{isLoggingOut ? t("loggingOut") : t("logout")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
