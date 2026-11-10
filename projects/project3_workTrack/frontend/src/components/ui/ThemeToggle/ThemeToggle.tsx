"use client";

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/src/Store/hooks";
import { selectTheme, toggleTheme } from "@/src/Store/theme-slice";
import styles from "../Toggle/Toggle.module.scss";

interface IThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: IThemeToggleProps) {
  const t = useTranslations("Common");
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      onClick={handleToggle}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className={styles.name}>
        {isDark ? t("themeLight") : t("themeDark")}
      </span>
    </button>
  );
}
