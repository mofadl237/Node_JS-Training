export type TThemeName = "zafran" | "attar" | "cinnamon" | "hibiscus";

export interface IThemeOption {
  name: TThemeName;
  labelKey: string;
  paper: string;
  primary: string;
  isDark: boolean;
}

export const DEFAULT_THEME: TThemeName = "zafran";

export const THEME_COOKIE = "oe-theme";

export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const THEME_NAMES: readonly TThemeName[] = ["zafran", "attar", "cinnamon", "hibiscus"];

export const THEMES: readonly IThemeOption[] = [
  { name: "zafran", labelKey: "themeZafran", paper: "#FBF4E6", primary: "#B8451F", isDark: false },
  { name: "attar", labelKey: "themeAttar", paper: "#F6F3E8", primary: "#3F6B3A", isDark: false },
  { name: "cinnamon", labelKey: "themeCinnamon", paper: "#1E130E", primary: "#E8892B", isDark: true },
  { name: "hibiscus", labelKey: "themeHibiscus", paper: "#FBF1EE", primary: "#A3203A", isDark: false },
];

export const THEME_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);var v=m&&m[1];if(!v||${JSON.stringify(THEME_NAMES)}.indexOf(v)<0){v=window.matchMedia("(prefers-color-scheme: dark)").matches?"cinnamon":"zafran";}document.documentElement.setAttribute("data-theme",v);}catch(e){}})();`;

export const isThemeName = (value: string | null | undefined): value is TThemeName =>
  THEME_NAMES.includes(value as TThemeName);

export const readThemeCookie = (): TThemeName | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`));
  const value = match?.[1];
  return isThemeName(value) ? value : null;
};

export const writeThemeCookie = (theme: TThemeName): void => {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};
