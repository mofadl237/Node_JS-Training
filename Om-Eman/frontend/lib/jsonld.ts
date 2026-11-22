import type { IStoreSettings, IStorefrontProduct } from "@/interface";
import { pickLocalized } from "./localized";
import { toSafeExternalUrl } from "./links";
import { productHref } from "./routes";

interface IOrganizationProps {
  siteUrl: string;
  locale: string;
  name: string;
  settings: IStoreSettings | null;
}

interface IWebSiteProps {
  siteUrl: string;
  locale: string;
  name: string;
  searchPath: string;
}

export const buildOrganizationJsonLd = ({
  siteUrl,
  locale,
  name,
  settings,
}: IOrganizationProps): Record<string, unknown> => {
  const url = `${siteUrl}/${locale}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };

  if (settings) {
    const sameAs = Object.values(settings.social)
      .map((value) => toSafeExternalUrl(value))
      .filter((value): value is string => value !== null);
    if (sameAs.length > 0) data.sameAs = sameAs;

    const contactPoint: Record<string, string> = { "@type": "ContactPoint", contactType: "customer service" };
    if (settings.contact.phone) contactPoint.telephone = settings.contact.phone;
    if (settings.contact.email) contactPoint.email = settings.contact.email;
    if (Object.keys(contactPoint).length > 2) data.contactPoint = contactPoint;
  }

  return data;
};

export const buildWebSiteJsonLd = ({
  siteUrl,
  locale,
  name,
  searchPath,
}: IWebSiteProps): Record<string, unknown> => {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/${locale}${searchPath}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return data;
};

interface IBuildBreadcrumbProps {
  siteUrl: string;
  locale: string;
  items: { name: string; path: string }[];
}

export const buildBreadcrumbJsonLd = ({
  siteUrl,
  locale,
  items,
}: IBuildBreadcrumbProps): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteUrl}/${locale}${item.path}`,
  })),
});

interface IBuildProductProps {
  siteUrl: string;
  locale: string;
  product: IStorefrontProduct;
  name: string;
  currency: string | null;
}

export const buildProductJsonLd = ({
  siteUrl,
  locale,
  product,
  name,
  currency,
}: IBuildProductProps): Record<string, unknown> => {
  const description = pickLocalized(locale, product.descriptionAr, product.descriptionEn);
  const images = product.images.map((image) => image.url).filter((url) => url.trim() !== "");
  const categoryName = pickLocalized(locale, product.category.nameAr, product.category.nameEn) ?? product.category.nameAr;
  const priceCurrency = currency?.trim() ?? "";
  const productUrl = `${siteUrl}/${locale}${productHref(product.slug)}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url: productUrl,
  };

  if (images.length > 0) data.image = images;
  if (description && description.trim() !== "") data.description = description;
  if (product.brand && product.brand.trim() !== "") {
    data.brand = { "@type": "Brand", name: product.brand };
  }
  if (categoryName.trim() !== "") data.category = categoryName;

  if (priceCurrency !== "" && product.packages.length > 0) {
    data.offers = product.packages.map((pkg) => {
      const availability =
        pkg.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : pkg.stockStatus === "OUT_OF_STOCK"
            ? "https://schema.org/OutOfStock"
            : null;

      return {
        "@type": "Offer",
        sku: pkg.sku,
        price: pkg.sellingPrice,
        priceCurrency,
        url: productUrl,
        ...(availability ? { availability } : {}),
      };
    });
  }

  return data;
};
