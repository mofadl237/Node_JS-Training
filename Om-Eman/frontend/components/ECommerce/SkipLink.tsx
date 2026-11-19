import { getTranslations } from "next-intl/server";

export const SkipLink = async () => {
  // 1- state
  const t = await getTranslations("a11y");

  // 3- render
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-floating"
    >
      {t("skipToContent")}
    </a>
  );
};
