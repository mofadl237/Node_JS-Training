import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/shared/ErrorState";
import { JsonLd } from "@/components/shared/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { FeaturedGrid } from "@/components/ECommerce/Home/FeaturedGrid";
import { SITE_URL } from "@/lib/config";
import { buildProductJsonLd } from "@/lib/jsonld";
import { pickLocalized } from "@/lib/localized";
import { getStorefrontProduct, getStoreSettings } from "@/lib/server/storeQueries";
import { BundleContents } from "./BundleContents";
import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { ProductGallery } from "./ProductGallery";
import { ProductPackageSelector } from "./ProductPackageSelector";

interface IProps {
  locale: string;
  slug: string;
}

export const ProductDetails = async ({ locale, slug }: IProps) => {
  const [productResult, settingsResult, t, tProduct] = await Promise.all([
    getStorefrontProduct(slug),
    getStoreSettings(),
    getTranslations("productDetail"),
    getTranslations("product"),
  ]);

  if (!productResult.ok) {
    if (productResult.code === "PRODUCT_NOT_FOUND") notFound();
    return <ErrorState title={t("errorTitle")} body={t("errorBody")} />;
  }

  const product = productResult.data;
  const name = pickLocalized(locale, product.nameAr, product.nameEn) ?? product.nameAr;
  const description = pickLocalized(locale, product.descriptionAr, product.descriptionEn);
  const currency = settingsResult.ok ? settingsResult.data.currency : null;
  const productLd = buildProductJsonLd({ siteUrl: SITE_URL, locale, product, name, currency });

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
      <JsonLd data={productLd} />
      <ProductBreadcrumb
        locale={locale}
        slug={product.slug}
        name={name}
        category={product.category}
        subcategory={product.subcategory}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          locale={locale}
          name={name}
          fallbackLabel={t("imageFallback")}
        />
        <div className="space-y-6">
          <div className="space-y-3">
            {product.brand ? <p className="text-sm text-ink-soft">{product.brand}</p> : null}
            <h1 className="font-display text-3xl text-ink md:text-4xl">{name}</h1>
            {product.productType === "PREDEFINED_BUNDLE" ? (
              <Badge variant="bundle">{tProduct("bundle")}</Badge>
            ) : null}
            {description && description.trim() !== "" ? (
              <p className="leading-relaxed text-ink-soft">{description}</p>
            ) : null}
          </div>
          <ProductPackageSelector key={product.slug} locale={locale} packages={product.packages} productName={name} />
          {product.bundleComponents.length > 0 ? (
            <BundleContents components={product.bundleComponents} />
          ) : null}
        </div>
      </div>
      {product.related.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-ink">{t("relatedTitle")}</h2>
          <FeaturedGrid products={product.related} locale={locale} />
        </section>
      ) : null}
    </section>
  );
};
