import type {
  IStoreProductCard,
  IStoreProductCategoryRef,
  IStoreProductImageSnapshot,
  TStoreProductType,
} from "./store";

export type TStoreSizeUnit = "G" | "KG" | "ML" | "L" | "PIECE" | "PACK" | "OTHER";

export interface IStorefrontImage extends IStoreProductImageSnapshot {
  isPrimary: boolean;
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

export interface IStorefrontBundleComponent {
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
  images: IStorefrontImage[];
  packages: IStorefrontPackage[];
  bundleComponents: IStorefrontBundleComponent[];
  category: IStoreProductCategoryRef;
  subcategory: IStoreProductCategoryRef;
  related: IStoreProductCard[];
}
