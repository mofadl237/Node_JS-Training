import { getTranslations } from "next-intl/server";

export const FontRow = async () => {
  const t = await getTranslations("design");

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl text-ink">{t("fonts")}</h2>
      <div className="space-y-3 rounded-lg bg-surface p-6 shadow-rest">
        <p className="text-sm text-ink-soft">{t("fontDisplay")}</p>
        <p className="font-display text-3xl text-ink">{t("fontSample")}</p>
      </div>
      <div className="space-y-3 rounded-lg bg-surface p-6 shadow-rest">
        <p className="text-sm text-ink-soft">{t("fontBody")}</p>
        <p className="text-xl text-ink">{t("fontSample")}</p>
      </div>
    </section>
  );
};
