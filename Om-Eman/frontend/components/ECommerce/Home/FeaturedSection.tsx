import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ErrorState } from "@/components/shared/ErrorState";
import { getFeaturedProducts } from "@/lib/server/storeQueries";
import { FeaturedGrid } from "./FeaturedGrid";

export const FeaturedSection = async () => {
  // 1- state
  const [result, locale, t] = await Promise.all([
    getFeaturedProducts(),
    getLocale(),
    getTranslations("home.featured"),
  ]);

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <ErrorState title={t("errorTitle")} body={t("errorBody")} />
      </section>
    );
  }

  if (result.data.length === 0) return null;

  // 3- render
  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <FeaturedGrid products={result.data} locale={locale} />
    </section>
  );
};
