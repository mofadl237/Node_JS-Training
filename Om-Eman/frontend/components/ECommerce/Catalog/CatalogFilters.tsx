import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pickLocalized } from "@/lib/localized";
import { cn } from "@/lib/utils";
import type { INormalizedCatalogQuery, TCatalogSort } from "@/lib/catalogQuery";
import type { IStoreCategoryNode } from "@/interface";

interface IProps {
  locale: string;
  query: INormalizedCatalogQuery;
  categories: IStoreCategoryNode[] | null;
  categoriesError: boolean;
}

const SORTS: TCatalogSort[] = ["newest", "price_asc", "price_desc", "name"];

const chip = (active: boolean) =>
  cn(
    "inline-flex h-8 items-center rounded-full border px-2.5 text-xs transition-colors",
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-ink/10 bg-surface text-ink-soft hover:text-ink",
  );

const buildHref = (query: Partial<INormalizedCatalogQuery>) => {
  const q: Record<string, string | number> = { sort: query.sort ?? "newest", page: query.page ?? 1 };
  if (query.category) q.category = query.category;
  if (query.subcategory) q.subcategory = query.subcategory;
  return { pathname: "/products" as const, query: q };
};

export const CatalogFilters = async ({ locale, query, categories, categoriesError }: IProps) => {
  const t = await getTranslations("catalog");
  const activeCategory = categories?.find((c) => c.slug === query.category) ?? null;
  const subs = activeCategory?.subcategories ?? [];

  return (
    <div className="space-y-3">
      {categoriesError ? <p className="text-sm text-danger">{t("filtersError")}</p> : null}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-ink">{t("category")}</p>
        <div className="flex flex-wrap gap-1.5">
          <Link href={buildHref({ sort: query.sort, page: 1 })} className={chip(!query.category)}>
            {t("allCategories")}
          </Link>
          {(categories ?? []).map((category) => {
            const name = pickLocalized(locale, category.nameAr, category.nameEn) ?? category.nameAr;
            return (
              <Link
                key={category.id}
                href={buildHref({ category: category.slug, sort: query.sort, page: 1 })}
                className={chip(query.category === category.slug)}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
      {query.category && subs.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-ink">{t("subcategory")}</p>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={buildHref({ category: query.category, sort: query.sort, page: 1 })}
              className={chip(!query.subcategory)}
            >
              {t("allSubcategories")}
            </Link>
            {subs.map((sub) => {
              const name = pickLocalized(locale, sub.nameAr, sub.nameEn) ?? sub.nameAr;
              return (
                <Link
                  key={sub.id}
                  href={buildHref({ category: query.category, subcategory: sub.slug, sort: query.sort, page: 1 })}
                  className={chip(query.subcategory === sub.slug)}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-ink">{t("sort")}</p>
        <div className="flex flex-wrap gap-1.5">
          {SORTS.map((sort) => (
            <Link
              key={sort}
              href={buildHref({ category: query.category, subcategory: query.subcategory, sort, page: 1 })}
              className={chip(query.sort === sort)}
            >
              {t(sort === "newest" ? "sortNewest" : sort === "price_asc" ? "sortPriceAsc" : sort === "price_desc" ? "sortPriceDesc" : "sortName")}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
