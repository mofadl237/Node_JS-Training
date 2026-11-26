"use client";

import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";

interface IProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const DashboardError = ({ reset }: IProps) => {
  const t = useTranslations("dashboard.error");

  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <ErrorState
        title={t("title")}
        body={t("body")}
        action={<Button onClick={reset}>{t("retry")}</Button>}
      />
    </main>
  );
};

export default DashboardError;
