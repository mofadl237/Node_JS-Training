"use client";

import { memo, useMemo } from "react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandMark } from "@/src/components/ui/BrandMark/BrandMark";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { getVisibleNavigationGroups } from "../navigation";
import { SidebarNav } from "./SidebarNav";
import styles from "./Sidebar.module.scss";

interface ISidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onNavigate: () => void;
}

export const Sidebar = memo(function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onNavigate,
}: ISidebarProps) {
  // 1- state
  const t = useTranslations("Shell");
  const common = useTranslations("Common");
  const user = useAppSelector(selectCurrentUser);
  const isCompact = isCollapsed && !isMobileOpen;

  const groups = useMemo(
    () => (user ? getVisibleNavigationGroups(user.role) : []),
    [user],
  );

  // 2- handlers

  // 3- render
  return (
    <aside
      className={[
        styles.sidebar,
        isCompact ? styles.collapsed : null,
        isMobileOpen ? styles.mobileOpen : null,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={t("navigation")}
    >
      <div className={styles.header}>
        <BrandMark
          name={common("brandName")}
          tagline={common("brandTagline")}
          iconOnly={isCompact}
          className={styles.brand}
        />
        <button
          type="button"
          className={styles.close}
          onClick={onNavigate}
          aria-label={t("closeMenu")}
        >
          <X size={18} />
        </button>
      </div>

      <SidebarNav
        groups={groups}
        isCollapsed={isCompact}
        onNavigate={onNavigate}
      />

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.collapse}
          onClick={onToggleCollapse}
          aria-label={
            isCollapsed ? t("expandSidebar") : t("collapseSidebar")
          }
          title={isCollapsed ? t("expandSidebar") : t("collapseSidebar")}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
          <span className={styles.collapseLabel}>
            {t("collapseSidebar")}
          </span>
        </button>
      </div>
    </aside>
  );
});
