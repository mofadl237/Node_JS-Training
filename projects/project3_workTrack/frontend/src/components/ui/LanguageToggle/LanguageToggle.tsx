"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocaleSwitcher } from "@/src/i18n/use-locale-switcher";
import { Spinner } from "../Spinner/Spinner";
import styles from "../Toggle/Toggle.module.scss";

interface ILanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: ILanguageToggleProps) {
  const t = useTranslations("Common");
  const { isPending, switchLocale } = useLocaleSwitcher();

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      onClick={switchLocale}
      disabled={isPending}
      aria-label={t("switchLanguage")}
      aria-busy={isPending || undefined}
    >
      {isPending ? <Spinner size="sm" /> : <Languages size={16} />}
      <span className={styles.name}>{t("languageName")}</span>
      <span className={styles.code}>{t("languageCode")}</span>
    </button>
  );
}
