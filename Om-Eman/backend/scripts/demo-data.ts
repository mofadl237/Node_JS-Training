// DEMO seed data for local development only. NEVER run against production.
// Every demo row is identifiable (DEMO- skus, demo- groupKeys, demo slugs)
// so `npm run db:seed:demo -- --clean` can remove them later.

export type TDemoSizeUnit = "G" | "KG" | "ML" | "L" | "PIECE" | "PACK" | "OTHER";

export interface IDemoPackageData {
  readonly sku: string;
  readonly nameAr: string;
  readonly nameEn?: string;
  readonly sizeValue: string;
  readonly sizeUnit: TDemoSizeUnit;
  readonly sellingPrice: string;
  readonly compareAtPrice?: string;
  readonly saleEndsInDays?: number;
  readonly stockStatus?: "IN_STOCK" | "OUT_OF_STOCK";
}

export interface IDemoAliasData {
  readonly alias: string;
  readonly language: "AR" | "EN";
}

export interface IDemoProductData {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn?: string;
  readonly brand?: string;
  readonly descriptionAr?: string;
  readonly keywords?: string;
  readonly isFeatured?: boolean;
  readonly status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  readonly productType?: "FINISHED" | "PREDEFINED_BUNDLE";
  readonly aliases?: readonly IDemoAliasData[];
  readonly imageSeeds: readonly string[];
  readonly packages: readonly IDemoPackageData[];
}

export interface IDemoSubcategoryData {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn?: string;
  readonly descriptionAr?: string;
  readonly products: readonly IDemoProductData[];
}

export interface IDemoCategoryData {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn?: string;
  readonly descriptionAr?: string;
  readonly subcategories: readonly IDemoSubcategoryData[];
}

export const DEMO_CATEGORIES: readonly IDemoCategoryData[] = [
  {
    slug: "spices",
    nameAr: "بهارات",
    nameEn: "Spices",
    descriptionAr: "بهارات مطحونة وحبوب كاملة بجودة يومية.",
    subcategories: [
      {
        slug: "ground-spices",
        nameAr: "بهارات مطحونة",
        nameEn: "Ground Spices",
        descriptionAr: "تُطحن طازجة عند الطلب.",
        products: [
          {
            slug: "turmeric",
            nameAr: "كركم",
            nameEn: "Turmeric",
            brand: "Om Eman",
            descriptionAr: "كركم مطحون نقي بلون ذهبي ورائحة قوية.",
            keywords: "kurkum turmeric بهار أصفر",
            isFeatured: true,
            aliases: [{ alias: "ألزعفران الفلاحي", language: "AR" }],
            imageSeeds: ["omeman-turmeric-1", "omeman-turmeric-2"],
            packages: [
              { sku: "DEMO-TUR-100G", nameAr: "كيس 100 جرام", sizeValue: "100", sizeUnit: "G", sellingPrice: "22", compareAtPrice: "26", saleEndsInDays: 30 },
              { sku: "DEMO-TUR-250G", nameAr: "كيس 250 جرام", sizeValue: "250", sizeUnit: "G", sellingPrice: "48" },
            ],
          },
          {
            slug: "black-pepper",
            nameAr: "فلفل أسود",
            nameEn: "Black Pepper",
            brand: "Om Eman",
            descriptionAr: "فلفل أسود مطحون طازج بحرارة متوازنة.",
            keywords: "filfil aswad pepper",
            isFeatured: true,
            imageSeeds: ["omeman-pepper-1", "omeman-pepper-2"],
            packages: [
              { sku: "DEMO-PPR-100G", nameAr: "كيس 100 جرام", sizeValue: "100", sizeUnit: "G", sellingPrice: "35" },
            ],
          },
          {
            slug: "cumin",
            nameAr: "كمون",
            nameEn: "Cumin",
            brand: "Om Eman",
            descriptionAr: "كمون مصري مطحون برائحة قوية.",
            keywords: "kmoun cumin",
            aliases: [{ alias: "كمنون", language: "AR" }],
            imageSeeds: ["omeman-cumin-1", "omeman-cumin-2"],
            packages: [
              { sku: "DEMO-CUM-100G", nameAr: "كيس 100 جرام", sizeValue: "100", sizeUnit: "G", sellingPrice: "18" },
            ],
          },
          {
            slug: "chili-powder",
            nameAr: "شطة",
            nameEn: "Chili Powder",
            brand: "Om Eman",
            descriptionAr: "شطة حمراء درجة حرارة متوسطة.",
            keywords: "shatta chili filfil har",
            aliases: [{ alias: "فلفل حار", language: "AR" }],
            imageSeeds: ["omeman-chili-1", "omeman-chili-2"],
            packages: [
              { sku: "DEMO-CHL-100G", nameAr: "كيس 100 جرام", sizeValue: "100", sizeUnit: "G", sellingPrice: "20" },
            ],
          },
        ],
      },
      {
        slug: "whole-spices",
        nameAr: "حبوب كاملة",
        nameEn: "Whole Spices",
        descriptionAr: "حبوب كاملة تُطحن في البيت.",
        products: [
          {
            slug: "coriander-seeds",
            nameAr: "كزبرة ناشفة",
            nameEn: "Coriander Seeds",
            brand: "Om Eman",
            descriptionAr: "بذور كزبرة كاملة للطحن المنزلي.",
            keywords: "kuzbara coriander haboub",
            imageSeeds: ["omeman-coriander-1", "omeman-coriander-2"],
            packages: [
              { sku: "DEMO-COR-200G", nameAr: "كيس 200 جرام", sizeValue: "200", sizeUnit: "G", sellingPrice: "24" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "herbs",
    nameAr: "أعشاب طبيعية",
    nameEn: "Natural Herbs",
    descriptionAr: "أعشاب مجففة طبيعية للشرب والتحضير.",
    subcategories: [
      {
        slug: "herbal-drinks",
        nameAr: "مشروبات أعشاب",
        nameEn: "Herbal Drinks",
        descriptionAr: "أعشاب للشاي والمشروبات الساخنة.",
        products: [
          {
            slug: "hibiscus",
            nameAr: "كركديه",
            nameEn: "Hibiscus",
            brand: "Om Eman",
            descriptionAr: "كركديه أحمر فاتح اللون مجفف بالظل.",
            keywords: "karkade hibiscus كوب",
            isFeatured: true,
            aliases: [{ alias: "كوب", language: "AR" }],
            imageSeeds: ["omeman-hibiscus-1", "omeman-hibiscus-2"],
            packages: [
              { sku: "DEMO-HIB-200G", nameAr: "كيس 200 جرام", sizeValue: "200", sizeUnit: "G", sellingPrice: "30", compareAtPrice: "38", saleEndsInDays: 14 },
            ],
          },
          {
            slug: "anise",
            nameAr: "ينسون",
            nameEn: "Anise",
            brand: "Om Eman",
            descriptionAr: "ينسون مصري حبوب كاملة برائحة حلوة.",
            keywords: "yansoon anise",
            imageSeeds: ["omeman-anise-1", "omeman-anise-2"],
            packages: [
              { sku: "DEMO-ANS-100G", nameAr: "كيس 100 جرام", sizeValue: "100", sizeUnit: "G", sellingPrice: "16" },
            ],
          },
          {
            slug: "mint-dried",
            nameAr: "نعناع مجفف",
            nameEn: "Dried Mint",
            brand: "Om Eman",
            descriptionAr: "أوراق نعناع مجففة للشاي.",
            keywords: "naanaa mint tea",
            imageSeeds: ["omeman-mint-1", "omeman-mint-2"],
            packages: [
              { sku: "DEMO-MNT-50G", nameAr: "كيس 50 جرام", sizeValue: "50", sizeUnit: "G", sellingPrice: "12" },
            ],
          },
          {
            slug: "fenugreek",
            nameAr: "حلبة",
            nameEn: "Fenugreek",
            brand: "Om Eman",
            descriptionAr: "حلبة مصري حبوب كاملة.",
            keywords: "halba fenugreek",
            status: "INACTIVE",
            imageSeeds: ["omeman-fenugreek-1"],
            packages: [
              { sku: "DEMO-HLB-100G", nameAr: "كيس 100 جرام", sizeValue: "100", sizeUnit: "G", sellingPrice: "14" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "gift-bundles",
    nameAr: "سلات وهدايا",
    nameEn: "Gift Bundles",
    descriptionAr: "سلات جاهزة تجمع أكثر من منتج بسعر أوفر.",
    subcategories: [
      {
        slug: "home-bundles",
        nameAr: "سلات منزلية",
        nameEn: "Home Bundles",
        descriptionAr: "سلات جاهزة للمطبخ المنزلي.",
        products: [
          {
            slug: "home-starter-bundle",
            nameAr: "سلة المطبخ الأساسية",
            nameEn: "Kitchen Starter Bundle",
            brand: "Om Eman",
            descriptionAr: "سلة تجمع كركم وفلفل أسود وكمون بسعر أوفر من شرائها منفردة.",
            keywords: "sala bundle هدية",
            isFeatured: true,
            productType: "PREDEFINED_BUNDLE",
            imageSeeds: ["omeman-bundle-1", "omeman-bundle-2"],
            packages: [
              { sku: "DEMO-BND-SET1", nameAr: "سلة 3 عبوات", sizeValue: "1", sizeUnit: "PACK", sellingPrice: "65", compareAtPrice: "75", saleEndsInDays: 60 },
            ],
          },
        ],
      },
    ],
  },
];

// Bundle components reference FINISHED product packages only (the SQL trigger
// rejects nested bundles). The bundle product has exactly ONE package (trigger
// enforced).
export const DEMO_BUNDLE = {
  bundleSlug: "home-starter-bundle",
  components: [
    { productSlug: "turmeric", packageSku: "DEMO-TUR-100G", quantity: "1" },
    { productSlug: "black-pepper", packageSku: "DEMO-PPR-100G", quantity: "1" },
    { productSlug: "cumin", packageSku: "DEMO-CUM-100G", quantity: "1" },
  ],
} as const;

export const DEMO_SYNONYMS: readonly { readonly groupKey: string; readonly term: string; readonly language: "AR" | "EN" }[] = [
  { groupKey: "demo-shatta", term: "شطة", language: "AR" },
  { groupKey: "demo-shatta", term: "فلفل حار", language: "AR" },
  { groupKey: "demo-karkade", term: "كركديه", language: "AR" },
  { groupKey: "demo-karkade", term: "كوب", language: "AR" },
  { groupKey: "demo-yansoon", term: "ينسون", language: "AR" },
  { groupKey: "demo-yansoon", term: "ينسون سوري", language: "AR" },
];

export const DEMO_BANNER = {
  titleAr: "خصم على الأعشاب الطبيعية",
  titleEn: "Discount on natural herbs",
  imageUrl: "https://picsum.photos/seed/omeman-banner/1200/400",
  linkUrl: "/ar?category=herbs",
  sortOrder: 0,
} as const;

export const DEMO_FAQS: readonly { readonly questionAr: string; readonly answerAr: string; readonly category: string }[] = [
  {
    questionAr: "هل يوجد دفع عند الاستلام؟",
    answerAr: "نعم، الدفع عند الاستلام متاح لكل محافظات مصر.",
    category: "الدفع",
  },
  {
    questionAr: "كم مدة الشحن؟",
    answerAr: "من 2 إلى 5 أيام عمل حسب المحافظة.",
    category: "الشحن",
  },
  {
    questionAr: "هل يمكن استبدال منتج تالف؟",
    answerAr: "نعم، خلال 14 يومًا من الاستلام بشرط سلامة العبوة.",
    category: "الاستبدال",
  },
];

export const DEMO_STATIC_PAGES: readonly { readonly slug: string; readonly titleAr: string; readonly bodyAr: string }[] = [
  {
    slug: "about",
    titleAr: "عن Om Eman",
    bodyAr: "متجر مصري للأعشاب والتوابل والمنتجات الطبيعية (صفحة تجريبية للعرض).",
  },
  {
    slug: "shipping-policy",
    titleAr: "سياسة الشحن",
    bodyAr: "الشحن لكل محافظات مصر، والدفع عند الاستلام أو تحويل بنكي (صفحة تجريبية).",
  },
];

export const DEMO_CARRIER = {
  name: "شركة الشحن التجريبية",
  code: "DEMO-EXPRESS",
  phone: "01000000000",
  notes: "بيانات تجريبية للتطوير فقط",
} as const;

export const DEMO_TARIFFS: readonly { readonly governorate: string; readonly baseCost: string; readonly etaMinDays: number; readonly etaMaxDays: number }[] = [
  { governorate: "القاهرة", baseCost: "30", etaMinDays: 2, etaMaxDays: 4 },
  { governorate: "الجيزة", baseCost: "30", etaMinDays: 2, etaMaxDays: 4 },
  { governorate: "الإسكندرية", baseCost: "45", etaMinDays: 3, etaMaxDays: 5 },
  { governorate: "أسيوط", baseCost: "55", etaMinDays: 4, etaMaxDays: 6 },
];

export const DEMO_PROMOTION = {
  name: "DEMO خصم أعشاب 10%",
  description: "خصم تجريبي 10% على قسم الأعشاب الطبيعية.",
  promotionType: "CATEGORY_DISCOUNT",
  discountType: "PERCENTAGE",
  value: "10",
  durationDays: 30,
  usageLimitTotal: 100,
  usageLimitPerCustomer: 1,
  categorySlug: "herbs",
} as const;

export const DEMO_COUPON = {
  code: "DEMO10",
  usageLimit: 100,
  perCustomerLimit: 1,
} as const;
