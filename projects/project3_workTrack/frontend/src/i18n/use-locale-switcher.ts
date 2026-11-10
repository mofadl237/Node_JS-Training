"use client";

import { useCallback, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "./navigation";
import { getAlternateLocale, type TAppLocale } from "./config";

export const useLocaleSwitcher = () => {
  const locale = useLocale() as TAppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = useCallback(() => {
    const nextLocale = getAlternateLocale(locale);

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }, [locale, pathname, router, startTransition]);

  return { locale, isPending, switchLocale };
};
