import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";
import { pickLocalized } from "@/lib/localized";
import { productHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { getStorefrontProduct } from "@/lib/server/storeQueries";
import { isStoreProductSlug } from "@/lib/storeSlug";

interface IProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "productDetail" });
  const fallback = () => buildMetadata({
    title: t("title"),
    description: t("description"),
    path: productHref(slug),
    locale: safeLocale,
  });

  if (!isStoreProductSlug(slug)) return fallback();

  const result = await getStorefrontProduct(slug);
  if (!result.ok) return fallback();

  const product = result.data;
  const name = pickLocalized(safeLocale, product.nameAr, product.nameEn) ?? product.nameAr;
  const description =
    pickLocalized(safeLocale, product.descriptionAr, product.descriptionEn) ?? t("metaDescription", { name });

  return buildMetadata({
    title: t("metaTitle", { name }),
    description,
    path: productHref(slug),
    locale: safeLocale,
  });
}
