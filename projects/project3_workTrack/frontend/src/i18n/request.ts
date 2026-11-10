import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  isAppLocale,
  type TAppLocale,
} from "./config";
import { messagesByLocale } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: TAppLocale = isAppLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
