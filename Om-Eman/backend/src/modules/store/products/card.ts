import type { Prisma, ESizeUnit } from "@prisma/client";

export type TStoreProductType = "FINISHED" | "PREDEFINED_BUNDLE";

export interface IStoreProductImageSnapshot {
  url: string;
  altAr: string | null;
  altEn: string | null;
}

export interface IStoreProductPrice {
  // Cheapest published package price, as a decimal string.
  from: string;
  // compareAtPrice of the same cheapest package (the anchoring price).
  compareAtFrom: string | null;
  hasMultiplePackages: boolean;
}

export interface IStoreProductCategoryRef {
  slug: string;
  nameAr: string;
  nameEn: string | null;
}

// Everything a storefront product card renders. Shared by the product list,
// search results, and related products so all three look identical.
export interface IStoreProductCard {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  brand: string | null;
  productType: TStoreProductType;
  isFeatured: boolean;
  primaryImage: IStoreProductImageSnapshot | null;
  // Hover image for the card (first non-primary image).
  secondaryImage: { url: string } | null;
  price: IStoreProductPrice;
  defaultPackageId: string;
  // Flash-sale countdown anchor of the cheapest package (ISO string).
  saleEndsAt: string | null;
  inStock: boolean;
  subcategory: IStoreProductCategoryRef;
  category: IStoreProductCategoryRef;
}

export interface IListRow {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  brand: string | null;
  productType: string;
  isFeatured: boolean;
  primaryImageUrl: string | null;
  primaryImageAltAr: string | null;
  primaryImageAltEn: string | null;
  secondaryImageUrl: string | null;
  defaultPackageId: string | null;
  fromPrice: Prisma.Decimal | null;
  compareAtFrom: Prisma.Decimal | null;
  saleEndsAt: Date | null;
  packageCount: number | bigint;
  inStock: boolean;
  subcategorySlug: string;
  subcategoryNameAr: string;
  subcategoryNameEn: string | null;
  categorySlug: string;
  categoryNameAr: string;
  categoryNameEn: string | null;
}

export function toProductType(raw: string): TStoreProductType {
  return raw === "PREDEFINED_BUNDLE" ? "PREDEFINED_BUNDLE" : "FINISHED";
}

export function mapListRowToCard(row: IListRow): IStoreProductCard {
  return {
    id: row.id,
    slug: row.slug,
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    brand: row.brand,
    productType: toProductType(row.productType),
    isFeatured: row.isFeatured,
    primaryImage:
      row.primaryImageUrl !== null
        ? {
            url: row.primaryImageUrl,
            altAr: row.primaryImageAltAr,
            altEn: row.primaryImageAltEn,
          }
        : null,
    secondaryImage:
      row.secondaryImageUrl !== null ? { url: row.secondaryImageUrl } : null,
    price: {
      from: row.fromPrice !== null ? row.fromPrice.toString() : "0.0000",
      compareAtFrom:
        row.compareAtFrom !== null ? row.compareAtFrom.toString() : null,
      hasMultiplePackages: Number(row.packageCount) > 1,
    },
    defaultPackageId: row.defaultPackageId ?? "",
    saleEndsAt: row.saleEndsAt !== null ? row.saleEndsAt.toISOString() : null,
    inStock: row.inStock,
    subcategory: {
      slug: row.subcategorySlug,
      nameAr: row.subcategoryNameAr,
      nameEn: row.subcategoryNameEn,
    },
    category: {
      slug: row.categorySlug,
      nameAr: row.categoryNameAr,
      nameEn: row.categoryNameEn,
    },
  };
}
export type TStoreSizeUnit = ESizeUnit;

// Price per 100 g / 100 ml, for the "= X ج.م / 100 جم" anchoring line.
// Weight/volume packages are convertible; pieces, packs, and other units are
// not, so they return null instead of a meaningless number.
export function pricePer100(
  sizeValue: unknown,
  sizeUnit: string,
  sellingPrice: unknown,
): string | null {
  const size = Number(sizeValue);
  const price = Number(sellingPrice);
  if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(price)) {
    return null;
  }
  switch (sizeUnit) {
    case "KG":
    case "L":
      return (price / size * 100).toFixed(4);
    case "G":
    case "ML":
      return ((price / size) * 100).toFixed(4);
    default:
      return null;
  }
}

export interface IStorefrontPackage {
  id: string;
  sku: string;
  nameAr: string | null;
  nameEn: string | null;
  sizeValue: string;
  sizeUnit: TStoreSizeUnit;
  sellingPrice: string;
  compareAtPrice: string | null;
  saleEndsAt: string | null;
  stockStatus: string;
  pricePer100g: string | null;
}

export interface IStorefrontProduct {
  id: string;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  productType: TStoreProductType;
  brand: string | null;
  aliases: string[];
  publishedAt: string | null;
  updatedAt: string;
  images: { url: string; altAr: string | null; altEn: string | null; isPrimary: boolean }[];
  packages: IStorefrontPackage[];
  bundleComponents: {
    quantity: string;
    sortOrder: number;
    componentPackage: {
      sku: string;
      nameAr: string | null;
      sizeValue: string;
      sizeUnit: TStoreSizeUnit;
      sellingPrice: string;
      product: { nameAr: string; slug: string };
    };
  }[];
  category: { slug: string; nameAr: string; nameEn: string | null };
  subcategory: { slug: string; nameAr: string; nameEn: string | null };
  related: IStoreProductCard[];
}
