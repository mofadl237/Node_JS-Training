import { getLocale, getTranslations } from "next-intl/server";
import { Stagger } from "@/components/Animation/Stagger";
import { StaggerItem } from "@/components/Animation/StaggerItem";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getStoreCategories } from "@/lib/server/storeQueries";
import type { TGlowCardAccent } from "@/components/shared/GlowCard";
import { CategoryCard } from "@/components/Card/CategoryCard";

const ACCENTS: TGlowCardAccent[] = ["card-1", "card-2", "card-3", "card-4"];

export const CategoriesSection = async () => {
  // 1- state
  const [result, locale, t] = await Promise.all([
    getStoreCategories(),
    getLocale(),
    getTranslations("home.categories"),
  ]);

  // 3- render
  return (
    <section id="categories" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        {!result.ok ? (
          <ErrorState title={t("errorTitle")} body={t("errorBody")} />
        ) : result.data.length === 0 ? (
          <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
        ) : (
          <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {result.data.map((category, index) => (
              <StaggerItem key={category.id}>
                <CategoryCard category={category} locale={locale} accent={ACCENTS[index % ACCENTS.length]} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
};
