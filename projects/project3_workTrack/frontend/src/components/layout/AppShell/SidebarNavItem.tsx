"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";
import type { INavigationItem } from "../navigation";
import styles from "./SidebarNav.module.scss";

interface ISidebarNavItemProps {
  item: INavigationItem;
  isCollapsed: boolean;
  onNavigate: () => void;
}

export const SidebarNavItem = memo(function SidebarNavItem({
  item,
  isCollapsed,
  onNavigate,
}: ISidebarNavItemProps) {
  // 1- state
  const t = useTranslations("Shell.nav");
  const pathname = usePathname();
  const Icon = item.icon;
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  // 2- handlers

  // 3- render
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={[styles.link, isActive ? styles.active : null]
          .filter(Boolean)
          .join(" ")}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? t(item.key) : undefined}
      >
        <span className={styles.icon} aria-hidden="true">
          <Icon size={19} strokeWidth={2} />
        </span>
        <span className={styles.label}>{t(item.key)}</span>
      </Link>
    </li>
  );
});
