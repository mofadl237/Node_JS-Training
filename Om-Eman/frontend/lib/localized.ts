export const pickLocalized = (
  locale: string,
  ar: string | null,
  en: string | null,
): string | null => (locale === "en" && en !== null && en.trim() !== "" ? en : ar);
