import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FeaturedGrid } from "@/components/ECommerce/Home/FeaturedGrid";
import { buttonVariants } from "@/components/ui/Button";
import { SITE_URL } from "@/lib/config";
import { pickLocalized } from "@/lib/localized";
import { getStoreCategories, getStoreProducts } from "@/lib/server/storeQueries";
import type { INormalizedCatalogQuery } from "@/lib/catalogQuery";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogPagination } from "./CatalogPagination";

interface IProps {
  locale: string;
  query: INormalizedCatalogQuery;
}

const allHref = (query: INormalizedCatalogQuery) => ({
  pathname: "/products" as const,
  query: { sort: query.sort, page: 1 },
});

export const CatalogSection = async ({ locale, query }: IProps) => {
  const [productsResult, categoriesResult, t] = await Promise.all([
    getStoreProducts(query),
    getStoreCategories(),
    getTranslations("catalog"),
  ]);

  const categories = categoriesResult.ok ? categoriesResult.data : null;
  const activeCategory = categories?.find((c) => c.slug === query.category) ?? null;
  const activeSub = activeCategory?.subcategories.find((s) => s.slug === query.subcategory) ?? null;
  const crumbs = [
    { name: t("home"), item: `${SITE_URL}/${locale}` },
    { name: t("title"), item: `${SITE_URL}/${locale}/products` },
  ];
  if (activeCategory) {
    crumbs.push({
      name: pickLocalized(locale, activeCategory.nameAr, activeCategory.nameEn) ?? activeCategory.nameAr,
      item: `${SITE_URL}/${locale}/products?category=${activeCategory.slug}`,
    });
  }
  if (activeCategory && activeSub) {
    crumbs.push({
      name: pickLocalized(locale, activeSub.nameAr, activeSub.nameEn) ?? activeSub.nameAr,
      item: `${SITE_URL}/${locale}/products?category=${activeCategory.slug}&subcategory=${activeSub.slug}`,
    });
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };

  const isOutOfRange =
    productsResult.ok &&
    Boolean(productsResult.meta) &&
    productsResult.meta!.total > 0 &&
    productsResult.meta!.page > productsResult.meta!.totalPages;

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
      <JsonLd data={breadcrumbLd} />
      <nav aria-label={t("breadcrumb")} className="text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">{t("home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            {crumbs.length === 2 ? (
              <span aria-current="page" className="text-ink">{t("title")}</span>
            ) : (
              <Link href="/products" className="hover:text-ink">{t("title")}</Link>
            )}
          </li>
          {activeCategory ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                {activeSub ? (
                  <Link href={{ pathname: "/products", query: { category: activeCategory.slug } }} className="hover:text-ink">
                    {pickLocalized(locale, activeCategory.nameAr, activeCategory.nameEn) ?? activeCategory.nameAr}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {pickLocalized(locale, activeCategory.nameAr, activeCategory.nameEn) ?? activeCategory.nameAr}
                  </span>
                )}
              </li>
            </>
          ) : null}
          {activeSub ? (
            <>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {pickLocalized(locale, activeSub.nameAr, activeSub.nameEn) ?? activeSub.nameAr}
              </li>
            </>
          ) : null}
        </ol>
      </nav>

      <div className="space-y-2">
        <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
        <p className="text-ink-soft">{t("subtitle")}</p>
      </div>

      <CatalogFilters locale={locale} query={query} categories={categories} categoriesError={!categoriesResult.ok} />

      {!productsResult.ok ? (
        <ErrorState title={t("errorTitle")} body={t("errorBody")} />
      ) : isOutOfRange ? (
        <EmptyState
          title={t("outOfRangeTitle")}
          body={t("outOfRangeBody")}
          action={<Link href={allHref(query)} className={buttonVariants()}>{t("backToResults")}</Link>}
        />
      ) : productsResult.data.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={<Link href={allHref(query)} className={buttonVariants({ variant: "soft" })}>{t("clearFilters")}</Link>}
        />
      ) : (
        <div className="space-y-8">
          <FeaturedGrid products={productsResult.data} locale={locale} />
          {productsResult.meta ? <CatalogPagination query={query} meta={productsResult.meta} /> : null}
        </div>
      )}
    </section>
  );
};
