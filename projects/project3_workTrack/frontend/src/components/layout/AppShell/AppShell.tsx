"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import styles from "./AppShell.module.scss";

interface IAppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: IAppShellProps) {
  // 1- state
  const t = useTranslations("Shell");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 2- handlers
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((current) => !current);
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobile, isMobileOpen]);

  // 3- render
  return (
    <div
      className={[styles.shell, isCollapsed ? styles.collapsed : null]
        .filter(Boolean)
        .join(" ")}
    >
      <a className={styles.skipLink} href="#main-content">
        {t("skipToContent")}
      </a>

      {isMobileOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeMobile}
          aria-label={t("closeMenu")}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={toggleCollapse}
        onNavigate={closeMobile}
      />

      <div className={styles.main}>
        <Topbar onOpenMenu={openMobile} />
        <main className={styles.content} id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
