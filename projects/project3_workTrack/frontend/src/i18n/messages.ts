import ar from "../../messages/ar.json";
import en from "../../messages/en.json";
import type { TAppLocale } from "./config";

export const messagesByLocale = {
  ar,
  en,
} satisfies Record<TAppLocale, typeof ar>;
