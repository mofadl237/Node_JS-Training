import { routing } from "@/i18n/routing";

export type TLocale = (typeof routing.locales)[number];

export type TDirection = "rtl" | "ltr";

const DIRECTIONS: Record<TLocale, TDirection> = {
  ar: "rtl",
  en: "ltr",
};

export const isLocale = (value: string): value is TLocale =>
  (routing.locales as readonly string[]).includes(value);

export const getLocaleDirection = (locale: TLocale): TDirection => DIRECTIONS[locale];
