"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/src/components/ui/LanguageToggle/LanguageToggle";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle/ThemeToggle";
import { usePathname } from "@/src/i18n/navigation";
import { findNavigationItem } from "../navigation";
import { UserMenu } from "./UserMenu";
import styles from "./Topbar.module.scss";

interface ITopbarProps {
  onOpenMenu: () => void;
}

export function Topbar({ onOpenMenu }: ITopbarProps) {
  // 1- state
  const t = useTranslations("Shell");
  const nav = useTranslations("Shell.nav");
  const pathname = usePathname();
  const activeItem = findNavigationItem(pathname);
  const title = activeItem ? nav(activeItem.key) : t("navigation");

  // 2- handlers

  // 3- render
  return (
    <header className={styles.topbar}>
      <div className={styles.start}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onOpenMenu}
          aria-label={t("openMenu")}
        >
          <Menu size={20} />
        </button>

        <div className={styles.titleGroup}>
          <p className={styles.eyebrow}>{t("workspace")}</p>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>

      <div className={styles.actions}>
        <ThemeToggle />
        <LanguageToggle />
        <UserMenu />
      </div>
    </header>
  );
}
