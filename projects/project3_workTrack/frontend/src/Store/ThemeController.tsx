"use client";

import { useEffect } from "react";
import {
  applyTheme,
  readStoredTheme,
  writeStoredTheme,
} from "@/src/lib/theme/theme-storage";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  hydrateTheme,
  selectTheme,
  selectThemeHydrated,
} from "./theme-slice";

export function ThemeController() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const isHydrated = useAppSelector(selectThemeHydrated);

  useEffect(() => {
    const storedTheme = readStoredTheme();

    if (storedTheme) {
      dispatch(hydrateTheme(storedTheme));
      applyTheme(storedTheme);
      return;
    }

    dispatch(hydrateTheme("light"));
    applyTheme("light");
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) return;

    applyTheme(theme);
    writeStoredTheme(theme);
  }, [isHydrated, theme]);

  return null;
}
