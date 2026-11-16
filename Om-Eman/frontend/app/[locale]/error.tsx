"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface IProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: IProps) => {
  // 1- state
  const t = useTranslations("errors");

  // 2- handlers
  useEffect(() => {
    console.error(error);
  }, [error]);

  // 3- render
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="text-ink-soft">{t("body")}</p>
        <Button onClick={reset}>{t("retry")}</Button>
      </div>
    </main>
  );
};

export default ErrorPage;
