// Storefront API contracts — literal copies from the backend so the two sides
// can never drift silently:
// - TStoreProductType .. IStoreProductCard: backend/src/modules/store/products/card.ts
// - IStoreContact .. IStoreSettings: backend/src/modules/store/settings/service.ts
// - IStoreSubcategoryNode .. IStoreCategoryNode: backend/src/modules/store/categories/service.ts
// - IStoreBanner: backend/src/modules/store/content/service.ts
// Money fields are always decimal strings, e.g. "45.0000".

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

export interface IStoreContact {
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  workingHours: string | null;
  address: string | null;
}

export interface IStoreSocial {
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
}

export interface IStoreSettings {
  currency: string;
  taxRate: number | null;
  // Free-shipping threshold from settings; null when the store has not
  // configured it (the frontend must not display a fake threshold).
  freeShippingThreshold: string | null;
  contact: IStoreContact;
  social: IStoreSocial;
}

// backend/src/modules/store/categories/service.ts
export interface IStoreSubcategoryNode {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  imageUrl: string | null;
  sortOrder: number;
  productsCount: number;
}

export interface IStoreCategoryNode {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  sortOrder: number;
  productsCount: number;
  subcategories: IStoreSubcategoryNode[];
}

// backend/src/modules/store/content/service.ts
export interface IStoreBanner {
  id: string;
  titleAr: string;
  titleEn: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
}
