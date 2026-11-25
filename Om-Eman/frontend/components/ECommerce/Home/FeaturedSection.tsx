import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getFeaturedProducts } from "@/lib/server/storeQueries";
import { FeaturedGrid } from "./FeaturedGrid";

export const FeaturedSection = async () => {
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

  if (result.data.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <FeaturedGrid products={result.data} locale={locale} />
    </section>
  );
};
