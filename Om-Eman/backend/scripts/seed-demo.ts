import { prisma } from "../src/config/prisma.js";
import { normalizeArabic } from "../src/utils/arabic/normalize-arabic.js";
import {
  DEMO_BANNER,
  DEMO_BUNDLE,
  DEMO_CARRIER,
  DEMO_CATEGORIES,
  DEMO_COUPON,
  DEMO_FAQS,
  DEMO_PROMOTION,
  DEMO_STATIC_PAGES,
  DEMO_SYNONYMS,
  DEMO_TARIFFS,
  type IDemoCategoryData,
  type IDemoProductData,
} from "./demo-data.js";

// Demo seed for local development ONLY. Creates catalog/content/shipping
// demo rows so the storefront and dashboard have something to render.
// It never touches Employees, SystemSettings, Orders, Customers, or Payments -
// those come from the real `npm run db:seed` (seed.config.json).
//
//   npm run db:seed:demo          # upsert demo data (idempotent)
//   npm run db:seed:demo -- --clean   # remove all demo data

const DEMO_SKU_PREFIX = "DEMO-";
const DEMO_SYNONYM_PREFIX = "demo-";
const DEMO_PROMOTION_NAME = DEMO_PROMOTION.name;

function fail(message: string): never {
  console.error(`Demo seed aborted: ${message}`);
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  fail("refusing to run in production (NODE_ENV=production). Demo data must never reach production.");
}

const day = (days: number): Date => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

function buildSearchText(parts: readonly (string | null | undefined)[]): string | null {
  const normalized = normalizeArabic(parts.filter((part) => part && part.trim()).join(" "));
  return normalized.length > 0 ? normalized : null;
}

async function seedProduct(product: IDemoProductData, subcategoryId: string, categoryName: string, subcategoryName: string): Promise<void> {
  const status = product.status ?? "ACTIVE";
  const normalizedKeywords = buildSearchText([product.nameAr, product.nameEn, product.brand, subcategoryName, categoryName, product.keywords, product.descriptionAr]);
  const row = await prisma.product.upsert({
    where: { slug: product.slug },
    update: {
      nameAr: product.nameAr,
      nameEn: product.nameEn ?? null,
      brand: product.brand ?? null,
      descriptionAr: product.descriptionAr ?? null,
      status,
      productType: product.productType ?? "FINISHED",
      isFeatured: product.isFeatured ?? false,
      publishedAt: status === "ACTIVE" ? new Date() : null,
      searchNameArNormalized: normalizeArabic(product.nameAr),
      searchNameEnNormalized: product.nameEn ? normalizeArabic(product.nameEn) : null,
      searchKeywords: product.keywords ?? null,
      searchText: normalizedKeywords,
      primarySubcategoryId: subcategoryId,
    },
    create: {
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn ?? null,
      brand: product.brand ?? null,
      descriptionAr: product.descriptionAr ?? null,
      status,
      productType: product.productType ?? "FINISHED",
      publishedAt: status === "ACTIVE" ? new Date() : null,
      searchNameArNormalized: normalizeArabic(product.nameAr),
      searchNameEnNormalized: product.nameEn ? normalizeArabic(product.nameEn) : null,
      searchKeywords: product.keywords ?? null,
      searchText: normalizedKeywords,
      primarySubcategoryId: subcategoryId,
    },
    select: { id: true },
  });

  for (const pkg of product.packages) {
    await prisma.productPackage.upsert({
      where: { sku: pkg.sku },
      update: {
        nameAr: pkg.nameAr,
        nameEn: pkg.nameEn ?? null,
        sizeValue: pkg.sizeValue,
        sizeUnit: pkg.sizeUnit,
        sellingPrice: pkg.sellingPrice,
        compareAtPrice: pkg.compareAtPrice ?? null,
        saleEndsAt: pkg.saleEndsInDays !== undefined ? day(pkg.saleEndsInDays) : null,
        stockStatus: pkg.stockStatus ?? "IN_STOCK",
        isPublished: true,
        isActive: true,
        productId: row.id,
      },
      create: {
        sku: pkg.sku,
        productId: row.id,
        nameAr: pkg.nameAr,
        nameEn: pkg.nameEn ?? null,
        sizeValue: pkg.sizeValue,
        sizeUnit: pkg.sizeUnit,
        sellingPrice: pkg.sellingPrice,
        compareAtPrice: pkg.compareAtPrice ?? null,
        saleEndsAt: pkg.saleEndsInDays !== undefined ? day(pkg.saleEndsInDays) : null,
        stockStatus: pkg.stockStatus ?? "IN_STOCK",
        isPublished: true,
        isActive: true,
      },
    });
  }

  for (const alias of product.aliases ?? []) {
    const normalizedAlias = normalizeArabic(alias.alias);
    await prisma.productAlias.upsert({
      where: { productId_normalizedAlias: { productId: row.id, normalizedAlias } },
      update: { alias: alias.alias, language: alias.language },
      create: { productId: row.id, alias: alias.alias, language: alias.language, normalizedAlias },
    });
  }

  for (const [index, seed] of product.imageSeeds.entries()) {
    const url = `https://picsum.photos/seed/${seed}/600/600`;
    const existing = await prisma.productImage.findFirst({ where: { productId: row.id, url }, select: { id: true } });
    if (!existing) {
      await prisma.productImage.create({
        data: { productId: row.id, url, sortOrder: index, isPrimary: index === 0 },
      });
    }
  }
  console.log(`✔ product ${product.slug} (${product.packages.length} packages)`);
}

async function seedCategoryTree(category: IDemoCategoryData): Promise<void> {
  const categoryRow = await prisma.category.upsert({
    where: { slug: category.slug },
    update: { nameAr: category.nameAr, nameEn: category.nameEn ?? null, descriptionAr: category.descriptionAr ?? null, isActive: true },
    create: { slug: category.slug, nameAr: category.nameAr, nameEn: category.nameEn ?? null, descriptionAr: category.descriptionAr ?? null, isActive: true },
    select: { id: true },
  });

  for (const [subIndex, subcategory] of category.subcategories.entries()) {
    const subcategoryRow = await prisma.subcategory.upsert({
      where: { slug: subcategory.slug },
      update: { categoryId: categoryRow.id, nameAr: subcategory.nameAr, nameEn: subcategory.nameEn ?? null, descriptionAr: subcategory.descriptionAr ?? null, isActive: true },
      create: {
        slug: subcategory.slug,
        categoryId: categoryRow.id,
        nameAr: subcategory.nameAr,
        nameEn: subcategory.nameEn ?? null,
        descriptionAr: subcategory.descriptionAr ?? null,
        isActive: true,
        sortOrder: subIndex,
      },
      select: { id: true },
    });
    for (const product of subcategory.products) {
      await seedProduct(product, subcategoryRow.id, category.nameAr, subcategory.nameAr);
    }
  }
  console.log(`✔ category ${category.slug}`);
}

async function seedBundle(): Promise<void> {
  const bundle = await prisma.product.findUnique({
    where: { slug: DEMO_BUNDLE.bundleSlug },
    select: { id: true, packages: { select: { id: true, sku: true } } },
  });
  if (!bundle || bundle.packages.length !== 1) {
    fail(`bundle product ${DEMO_BUNDLE.bundleSlug} must exist with exactly one package`);
  }
  for (const component of DEMO_BUNDLE.components) {
    const pkg = await prisma.productPackage.findUnique({
      where: { sku: component.packageSku },
      select: { id: true, product: { select: { slug: true, productType: true } } },
    });
    if (!pkg) fail(`component package ${component.packageSku} not found`);
    if (pkg.product.productType === "PREDEFINED_BUNDLE") {
      fail(`component ${component.packageSku} belongs to a bundle; nested bundles are forbidden`);
    }
    await prisma.productBundleComponent.upsert({
      where: { bundleProductId_componentPackageId: { bundleProductId: bundle.id, componentPackageId: pkg.id } },
      update: { quantity: component.quantity },
      create: { bundleProductId: bundle.id, componentPackageId: pkg.id, quantity: component.quantity },
    });
  }
  console.log(`✔ bundle components (${DEMO_BUNDLE.components.length})`);
}

async function seedContentAndShipping(): Promise<void> {
  const carrier = await prisma.shippingCarrier.upsert({
    where: { code: DEMO_CARRIER.code },
    update: { name: DEMO_CARRIER.name, phone: DEMO_CARRIER.phone, notes: DEMO_CARRIER.notes, isActive: true },
    create: { name: DEMO_CARRIER.name, code: DEMO_CARRIER.code, phone: DEMO_CARRIER.phone, notes: DEMO_CARRIER.notes, isActive: true },
    select: { id: true },
  });
  for (const tariff of DEMO_TARIFFS) {
    const existing = await prisma.shippingTariff.findFirst({
      where: { carrierId: carrier.id, governorate: tariff.governorate, city: null },
      select: { id: true },
    });
    if (!existing) {
      await prisma.shippingTariff.create({
        data: {
          carrierId: carrier.id,
          governorate: tariff.governorate,
          city: null,
          baseCost: tariff.baseCost,
          etaMinDays: tariff.etaMinDays,
          etaMaxDays: tariff.etaMaxDays,
        },
      });
    }
  }
  console.log(`✔ shipping carrier ${DEMO_CARRIER.code} + ${DEMO_TARIFFS.length} tariffs`);

  const existingBanner = await prisma.banner.findFirst({ where: { imageUrl: DEMO_BANNER.imageUrl }, select: { id: true } });
  if (!existingBanner) {
    await prisma.banner.create({
      data: {
        titleAr: DEMO_BANNER.titleAr,
        titleEn: DEMO_BANNER.titleEn,
        imageUrl: DEMO_BANNER.imageUrl,
        linkUrl: DEMO_BANNER.linkUrl,
        sortOrder: DEMO_BANNER.sortOrder,
        startsAt: day(-1),
        endsAt: day(90),
      },
    });
  }
  console.log("✔ banner");

  for (const faq of DEMO_FAQS) {
    const existing = await prisma.faq.findFirst({ where: { questionAr: faq.questionAr }, select: { id: true } });
    if (!existing) {
      await prisma.faq.create({
        data: { questionAr: faq.questionAr, answerAr: faq.answerAr, category: faq.category, isActive: true },
      });
    }
  }
  console.log(`✔ ${DEMO_FAQS.length} FAQs`);

  for (const [index, page] of DEMO_STATIC_PAGES.entries()) {
    await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: { titleAr: page.titleAr, bodyAr: page.bodyAr, status: "PUBLISHED", publishedAt: new Date() },
      create: { slug: page.slug, titleAr: page.titleAr, bodyAr: page.bodyAr, status: "PUBLISHED", publishedAt: new Date() },
    });
  }
  console.log(`✔ ${DEMO_STATIC_PAGES.length} static pages`);

  for (const synonym of DEMO_SYNONYMS) {
    const normalizedTerm = normalizeArabic(synonym.term);
    await prisma.searchSynonym.upsert({
      where: { groupKey_normalizedTerm: { groupKey: synonym.groupKey, normalizedTerm } },
      update: { term: synonym.term, language: synonym.language, isActive: true },
      create: { groupKey: synonym.groupKey, term: synonym.term, language: synonym.language, normalizedTerm, isActive: true },
    });
  }
  console.log(`✔ ${DEMO_SYNONYMS.length} search synonyms`);
}

async function seedPromotion(): Promise<void> {
  const category = await prisma.category.findUnique({ where: { slug: DEMO_PROMOTION.categorySlug }, select: { id: true } });
  if (!category) fail(`promotion category ${DEMO_PROMOTION.categorySlug} not found`);

  let promotion = await prisma.promotion.findFirst({ where: { name: DEMO_PROMOTION_NAME }, select: { id: true } });
  const startsAt = day(-1);
  const endsAt = day(DEMO_PROMOTION.durationDays);
  if (promotion) {
    await prisma.promotion.update({
      where: { id: promotion.id },
      data: { endsAt, isActive: true, usageLimitTotal: DEMO_PROMOTION.usageLimitTotal, usageLimitPerCustomer: DEMO_PROMOTION.usageLimitPerCustomer },
    });
  } else {
    promotion = await prisma.promotion.create({
      data: {
        name: DEMO_PROMOTION_NAME,
        description: DEMO_PROMOTION.description,
        promotionType: DEMO_PROMOTION.promotionType,
        discountType: DEMO_PROMOTION.discountType,
        value: DEMO_PROMOTION.value,
        startsAt,
        endsAt,
        usageLimitTotal: DEMO_PROMOTION.usageLimitTotal,
        usageLimitPerCustomer: DEMO_PROMOTION.usageLimitPerCustomer,
        isActive: true,
      },
      select: { id: true },
    });
  }
  const existingTarget = await prisma.promotionTarget.findFirst({
    where: { promotionId: promotion.id, scope: "CATEGORY", categoryId: category.id },
    select: { id: true },
  });
  if (!existingTarget) {
    await prisma.promotionTarget.create({
      data: { promotionId: promotion.id, scope: "CATEGORY", categoryId: category.id },
    });
  }
  await prisma.coupon.upsert({
    where: { code: DEMO_COUPON.code },
    update: { promotionId: promotion.id, usageLimit: DEMO_COUPON.usageLimit, perCustomerLimit: DEMO_COUPON.perCustomerLimit, isActive: true },
    create: {
      promotionId: promotion.id,
      code: DEMO_COUPON.code,
      usageLimit: DEMO_COUPON.usageLimit,
      perCustomerLimit: DEMO_COUPON.perCustomerLimit,
      isActive: true,
    },
  });
  console.log(`✔ promotion + coupon ${DEMO_COUPON.code}`);
}

async function cleanDemoData(): Promise<void> {
  const demoProducts = await prisma.product.findMany({
    where: { packages: { some: { sku: { startsWith: DEMO_SKU_PREFIX } } } },
    select: { id: true },
  });
  const productIds = demoProducts.map((row) => row.id);
  await prisma.productBundleComponent.deleteMany({ where: { bundleProductId: { in: productIds } } });
  await prisma.productPackage.deleteMany({ where: { sku: { startsWith: DEMO_SKU_PREFIX } } });
  await prisma.product.deleteMany({ where: { id: { in: productIds } } });
  await prisma.coupon.deleteMany({ where: { code: DEMO_COUPON.code } });
  await prisma.promotionTarget.deleteMany({ where: { promotion: { name: DEMO_PROMOTION_NAME } } });
  await prisma.promotion.deleteMany({ where: { name: DEMO_PROMOTION_NAME } });
  await prisma.shippingCarrier.deleteMany({ where: { code: DEMO_CARRIER.code } });
  await prisma.banner.deleteMany({ where: { imageUrl: DEMO_BANNER.imageUrl } });
  await prisma.faq.deleteMany({ where: { questionAr: { in: DEMO_FAQS.map((faq) => faq.questionAr) } } });
  await prisma.staticPage.deleteMany({ where: { slug: { in: DEMO_STATIC_PAGES.map((page) => page.slug) } } });
  await prisma.searchSynonym.deleteMany({ where: { groupKey: { startsWith: DEMO_SYNONYM_PREFIX } } });
  console.log("Demo data cleaned.");
}

async function main(): Promise<void> {
  if (process.argv.includes("--clean")) {
    await cleanDemoData();
    return;
  }
  for (const category of DEMO_CATEGORIES) {
    await seedCategoryTree(category);
  }
  await seedBundle();
  await seedContentAndShipping();
  await seedPromotion();
  console.log("Demo seed completed. (بيانات تجريبية للتطوير فقط — ازيلها بـ -- --clean قبل الإطلاق)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Demo seed failed:", error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  });
