/**
 * Central brand/storefront asset paths (Gate 4).
 * Only list assets that actually exist in `public/`. Do not invent supplied assets.
 */
export interface IHomeImageCollection {
  hero: string;
  categories: {
    herbs: string;
    spices: string;
    blends: string;
    naturalProducts: string;
  };
}

export const HOME_IMAGE_COLLECTIONS = {
  "/Set_01_Brand_Collection": {
    hero: "01_wooden_logo_hero.png",
    categories: {
      herbs: "03_herbs_category.png",
      spices: "04_spices_category.png",
      blends: "05_blends_category.png",
      naturalProducts: "06_natural_products_category.png",
    },
  },
  "/Set_02_Modern_Organic_Collection": {
    hero: "01_wooden_logo_hero.png",
    categories: {
      herbs: "03_herbs_category.png",
      spices: "04_spices_category.png",
      blends: "05_blends_category.png",
      naturalProducts: "06_natural_products_category.png",
    },
  },
  "/Set_03_Campaign_And_Product_Collection": {
    hero: "01_wooden_logo_hero.png",
    categories: {
      herbs: "03_herbs_category.png",
      spices: "04_spices_category.png",
      blends: "05_blends_category.png",
      naturalProducts: "06_natural_products_category.png",
    },
  },
} as const satisfies Record<string, IHomeImageCollection>;

export type THomeImageCollection = keyof typeof HOME_IMAGE_COLLECTIONS;

export const HOME_IMAGE_COLLECTION: THomeImageCollection =
  "/Set_03_Campaign_And_Product_Collection";

const selectedHomeCollection = HOME_IMAGE_COLLECTIONS[HOME_IMAGE_COLLECTION];

const homeAssetPath = (fileName: string): string => `${HOME_IMAGE_COLLECTION}/${fileName}`;

export const HOME_ASSETS = {
  hero: homeAssetPath(selectedHomeCollection.hero),
  categories: {
    herbs: homeAssetPath(selectedHomeCollection.categories.herbs),
    spices: homeAssetPath(selectedHomeCollection.categories.spices),
    blends: homeAssetPath(selectedHomeCollection.categories.blends),
    naturalProducts: homeAssetPath(selectedHomeCollection.categories.naturalProducts),
  },
} as const;

export const HOME_OG_ASSET = {
  url: HOME_ASSETS.hero,
  width: 881,
  height: 432,
} as const;

const HOME_CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  herbs: HOME_ASSETS.categories.herbs,
  spices: HOME_ASSETS.categories.spices,
  blends: HOME_ASSETS.categories.blends,
  "natural-products": HOME_ASSETS.categories.naturalProducts,
};

export const getHomeCategoryImage = (slug: string): string | null =>
  HOME_CATEGORY_IMAGE_BY_SLUG[slug.trim().toLowerCase()] ?? null;

export const BRAND_ASSETS = {
  jarMark: "/assets/brand/jar-mark.png",
  fullLogo: "/logo.png",
  hero: {
    desktop: HOME_ASSETS.hero,
    mobile: HOME_ASSETS.hero,
    poster: null as string | null,
  },
  brandVideo: {
    src: null as string | null,
    poster: null as string | null,
  },
} as const;

export const HERO_SLIDES = [
  "/hero/2.jpg",
  "/hero/3.jpg",
  "/hero/\u0644\u0627\u0641\u062a\u0629 \u0639\u0631\u0648\u0636 \u0627\u0644\u0628\u062f\u0627\u064a\u0629 \u0644\u0623\u0639\u0634\u0627\u0628 \u0623\u0645 \u0625\u064a\u0645\u0627\u0646-1.png",
] as const;
