"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";

const NotFoundPage = () => {
  // 1- state
  const t = useTranslations("notFound");

  // 2- handlers

  // 3- render
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="text-ink-soft">{t("body")}</p>
        <Link href="/" className={buttonVariants()}>
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
