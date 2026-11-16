"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { DEFAULT_THEME, isThemeName, writeThemeCookie } from "@/lib/theme";
import type { TThemeName } from "@/lib/theme";

interface IThemeContext {
  theme: TThemeName;
  setTheme: (theme: TThemeName) => void;
}

const getThemeSnapshot = (): TThemeName => {
  const value = document.documentElement.getAttribute("data-theme");
  return isThemeName(value) ? value : DEFAULT_THEME;
};

const getServerTheme = (): TThemeName => DEFAULT_THEME;

const subscribeToTheme = (onStoreChange: () => void): (() => void) => {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

const ThemeContext = createContext<IThemeContext | null>(null);

interface IProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: IProps) => {
  // 1- state
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerTheme);

  // 2- handlers
  const setTheme = useCallback((next: TThemeName) => {
    document.documentElement.setAttribute("data-theme", next);
    writeThemeCookie(next);
  }, []);

  // 3- render
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
