import { getTranslations } from "next-intl/server";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { THEMES } from "@/lib/theme";

export const ThemeRow = async () => {
  const t = await getTranslations("design");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">{t("themes")}</h2>
        <ThemeSwitcher />
      </div>
      <ul className="flex flex-wrap gap-4">
        {THEMES.map((option) => (
          <li key={option.name} className="flex flex-col items-center gap-2">
            <span
              className="size-14 rounded-full shadow-rest"
              style={{
                background: `linear-gradient(135deg, ${option.paper} 50%, ${option.primary} 50%)`,
              }}
            />
            <span className="text-sm text-ink-soft">{t(option.labelKey)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
