import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_URL } from "@/lib/config";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { pickLocalized } from "@/lib/localized";
import { categoryHref, productHref } from "@/lib/routes";
import type { IStoreProductCategoryRef } from "@/interface";

interface IProps {
  locale: string;
  slug: string;
  name: string;
  category: IStoreProductCategoryRef;
  subcategory: IStoreProductCategoryRef;
}

export const ProductBreadcrumb = async ({ locale, slug, name, category, subcategory }: IProps) => {
  const t = await getTranslations("catalog");
  const categoryName = pickLocalized(locale, category.nameAr, category.nameEn) ?? category.nameAr;
  const subcategoryName = pickLocalized(locale, subcategory.nameAr, subcategory.nameEn) ?? subcategory.nameAr;
  const categoryPath = `/products?${new URLSearchParams({ category: category.slug }).toString()}`;
  const subcategoryPath = `/products?${new URLSearchParams({
    category: category.slug,
    subcategory: subcategory.slug,
  }).toString()}`;

  const items = [
    { name: t("home"), path: "" },
    { name: t("title"), path: "/products" },
    { name: categoryName, path: categoryPath },
    { name: subcategoryName, path: subcategoryPath },
    { name, path: productHref(slug) },
  ];

  return (
    <div className="space-y-3">
      <JsonLd data={buildBreadcrumbJsonLd({ siteUrl: SITE_URL, locale, items })} />
      <nav aria-label={t("breadcrumb")} className="text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">{t("home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-ink">{t("title")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={categoryHref(category.slug)} className="hover:text-ink">{categoryName}</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={{ pathname: "/products", query: { category: category.slug, subcategory: subcategory.slug } }}
              className="hover:text-ink"
            >
              {subcategoryName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{name}</li>
        </ol>
      </nav>
    </div>
  );
};
