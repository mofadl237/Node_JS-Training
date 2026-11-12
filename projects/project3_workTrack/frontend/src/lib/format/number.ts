export const formatNumber = (
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string => new Intl.NumberFormat(locale, options).format(value);
