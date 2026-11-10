-- Om Eman MVP dry run
-- Run after:
--   1. the Prisma migration has created the MVP tables and enum types
--   2. prisma/mvp/manual_constraints.sql has been applied
--
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/mvp/dry-run.sql
--
-- The sample rows use fixed IDs and ON CONFLICT DO NOTHING, so this file can be
-- run more than once on the same test database.

BEGIN;

-- ---------------------------------------------------------------------------
-- Sample catalog
-- ---------------------------------------------------------------------------

INSERT INTO "Category" ("id", "nameAr", "slug", "isActive", "createdAt", "updatedAt")
VALUES ('cat_mvp', 'اختبار', 'mvp-test', true, now(), now())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Subcategory" ("id", "categoryId", "nameAr", "slug", "isActive", "createdAt", "updatedAt")
VALUES ('sub_mvp', 'cat_mvp', 'اختبار', 'mvp-test-sub', true, now(), now())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Product"
  ("id", "primarySubcategoryId", "nameAr", "nameEn", "slug", "productType", "status",
   "searchNameArNormalized", "searchNameEnNormalized", "searchText", "isFeatured",
   "createdAt", "updatedAt")
VALUES
  ('prod_milk', 'sub_mvp', 'حليب نيدو', 'Nido Milk', 'nido-milk', 'FINISHED', 'ACTIVE',
   normalize_arabic('حليب نيدو'), normalize_arabic('Nido Milk'),
   normalize_arabic('حليب نيدو Nido Milk لبن'), true, now(), now()),
  ('prod_chipsy', 'sub_mvp', 'شيبسي', 'Chipsy', 'chipsy', 'FINISHED', 'ACTIVE',
   normalize_arabic('شيبسي'), normalize_arabic('Chipsy'),
   normalize_arabic('شيبسي Chipsy شيبسى'), false, now(), now()),
  ('prod_tea', 'sub_mvp', 'شاي العروسة', 'El Arosa Tea', 'el-arosa-tea', 'FINISHED', 'ACTIVE',
   normalize_arabic('شاي العروسة'), normalize_arabic('El Arosa Tea'),
   normalize_arabic('شاي العروسة El Arosa Tea'), false, now(), now())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductPackage"
  ("id", "productId", "sku", "nameAr", "sizeValue", "sizeUnit", "sellingPrice",
   "stockStatus", "isActive", "isPublished", "createdAt", "updatedAt")
VALUES
  ('pkg_milk', 'prod_milk', 'NIDO-1KG', '1 كجم', 1, 'KG', 250, 'IN_STOCK', true, true, now(), now()),
  ('pkg_chipsy', 'prod_chipsy', 'CHIPSY-1', 'عبوة', 1, 'PACK', 10, 'IN_STOCK', true, true, now(), now()),
  ('pkg_tea', 'prod_tea', 'TEA-1', 'عبوة', 1, 'PACK', 45, 'IN_STOCK', true, true, now(), now())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductAlias"
  ("id", "productId", "alias", "language", "normalizedAlias", "weight", "isSearchable", "createdAt", "updatedAt")
VALUES
  ('alias_milk_1', 'prod_milk', 'لبن', 'AR', normalize_arabic('لبن'), 10, true, now(), now()),
  ('alias_milk_2', 'prod_milk', 'حليب', 'AR', normalize_arabic('حليب'), 10, true, now(), now()),
  ('alias_chipsy_1', 'prod_chipsy', 'شيبسى', 'AR', normalize_arabic('شيبسى'), 5, true, now(), now())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "SearchSynonym"
  ("id", "groupKey", "term", "normalizedTerm", "language", "isActive", "createdAt", "updatedAt")
VALUES
  ('syn_milk_1', 'milk', 'لبن', normalize_arabic('لبن'), 'AR', true, now(), now()),
  ('syn_milk_2', 'milk', 'حليب', normalize_arabic('حليب'), 'AR', true, now(), now()),
  ('syn_tea_1', 'tea', 'شاي', normalize_arabic('شاي'), 'AR', true, now(), now()),
  ('syn_tea_2', 'tea', 'اتاي', normalize_arabic('اتاي'), 'AR', true, now(), now())
ON CONFLICT ("id") DO NOTHING;

\echo 'Normalization checks:'
SELECT input, normalize_arabic(input) AS normalized
FROM (VALUES
  ('شيبسى'),
  ('شيبسي'),
  ('مدرسة'),
  ('أحمد'),
  ('إسلام'),
  ('آمن'),
  ('مُحَمَّد'),
  ('١٢٣'),
  ('۱۲۳'),
  ('  لبن   '),
  ('Milk!'),
  ('الحليب'),
  ('مؤمن'),
  ('رئيس'),
  ('كلمــــة'),
  ('حليب-نيدو')
) AS samples(input);

\echo 'Exact alias: شيبسى'
SELECT * FROM search_products('شيبسى', 10);

\echo 'Exact product name: حليب'
SELECT * FROM search_products('حليب', 10);

\echo 'Alias: لبن'
SELECT * FROM search_products('لبن', 10);

\echo 'Prefix: شيب'
SELECT * FROM search_products('شيب', 10);

\echo 'Synonym expansion: اتاي -> شاي'
SELECT * FROM search_products('اتاي', 10);

\echo 'Deliberate typo (trigram): شيبسو'
SELECT * FROM search_products('شيبسو', 10);

\echo 'Expected empty: قهوة فرنسية'
SELECT * FROM search_products('قهوة فرنسية', 10);

\echo 'Suggestions for the empty query: قهوة فرنسية'
SELECT * FROM suggest_similar('قهوة فرنسية', 5);

\echo 'Suggestions for the typo: شيبسو'
SELECT * FROM suggest_similar('شيبسو', 5);

\echo 'Views:'
SELECT * FROM "customer_order_stats_drift" LIMIT 5;
SELECT * FROM "cod_awaiting_settlement" LIMIT 5;
SELECT * FROM "bundle_pricing" LIMIT 5;
SELECT * FROM "report_sales_daily" LIMIT 5;
SELECT * FROM "report_top_products" LIMIT 5;
SELECT * FROM "report_top_products_monthly" LIMIT 5;
SELECT * FROM "report_customers_summary" LIMIT 5;
SELECT * FROM "report_customer_segments" LIMIT 5;
SELECT * FROM "report_payments_pending" LIMIT 5;
SELECT * FROM "report_promotions_performance" LIMIT 5;
SELECT * FROM "report_zero_result_searches" LIMIT 5;
SELECT * FROM "report_top_searches" LIMIT 5;

COMMIT;
