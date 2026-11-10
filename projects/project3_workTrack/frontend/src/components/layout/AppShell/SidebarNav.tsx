"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import type { INavigationGroup } from "../navigation";
import { SidebarNavItem } from "./SidebarNavItem";
import styles from "./SidebarNav.module.scss";

interface ISidebarNavProps {
  groups: INavigationGroup[];
  isCollapsed: boolean;
  onNavigate: () => void;
}

export const SidebarNav = memo(function SidebarNav({
  groups,
  isCollapsed,
  onNavigate,
}: ISidebarNavProps) {
  const t = useTranslations("Shell");

  return (
    <nav
      className={[styles.nav, isCollapsed ? styles.collapsed : null]
        .filter(Boolean)
        .join(" ")}
      aria-label={t("navigation")}
    >
      {groups.map((group) => (
        <div className={styles.group} key={group.key}>
          <p className={styles.groupLabel}>{t(`groups.${group.key}`)}</p>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.key}
                item={item}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
});
