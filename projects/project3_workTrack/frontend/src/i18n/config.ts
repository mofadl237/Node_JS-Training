export const locales = ["ar", "en"] as const;

export type TAppLocale = (typeof locales)[number];

export const defaultLocale: TAppLocale = "ar";

export const isAppLocale = (value: string | undefined): value is TAppLocale =>
  value !== undefined && locales.includes(value as TAppLocale);

export const getDirection = (locale: TAppLocale): "rtl" | "ltr" =>
  locale === "ar" ? "rtl" : "ltr";

export const getAlternateLocale = (locale: TAppLocale): TAppLocale =>
  locale === "ar" ? "en" : "ar";
