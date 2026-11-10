import type { TTheme } from "./types";

export const THEME_STORAGE_KEY = "worktrack.theme";

const isTheme = (value: string | null): value is TTheme =>
  value === "light" || value === "dark";

export const readStoredTheme = (): TTheme | null => {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isTheme(value) ? value : null;
};

export const writeStoredTheme = (theme: TTheme): void => {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const applyTheme = (theme: TTheme): void => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};
