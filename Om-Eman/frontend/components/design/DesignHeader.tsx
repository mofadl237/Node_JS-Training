import { getTranslations } from "next-intl/server";

interface IProps {
  locale: string;
}

export const DesignHeader = async ({ locale }: IProps) => {
  const t = await getTranslations({ locale, namespace: "design" });

  return (
    <header className="space-y-2">
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="text-ink-soft">{t("subtitle")}</p>
    </header>
  );
};
