-- Om Eman MVP - manual PostgreSQL objects
-- Apply after the Prisma migration has created the tables and enum types:
--   npx prisma db execute --file prisma/mvp/manual_constraints.sql
--
-- This file is intentionally idempotent. It only creates extensions, functions,
-- triggers, CHECK constraints, indexes, and views that Prisma does not manage.
-- It never drops or alters a Prisma-managed table, column, enum, or FK.
--
-- Identifier convention:
--   Prisma model "ProductPackage" -> table "ProductPackage"
--   Prisma field "productId"      -> column "productId"
--   Prisma enum  "EOrderStatus"   -> type "EOrderStatus"
-- All mixed-case identifiers below are double-quoted on purpose.
--
-- Arabic normalization rules (must match src/utils/arabic/normalize-arabic.ts):
--   1. lower-case
--   2. remove tashkeel and tatweel
--   3. alef forms -> bare alef
--   4. alef maqsura -> ya
--   5. ta marbuta -> ha
--   6. waw/ya hamza -> waw/ya
--   7. Arabic-Indic and extended Arabic-Indic digits -> ASCII digits
--   8. non-letter/non-digit -> space, collapse whitespace, trim
-- The definite article "ال" is intentionally preserved by default, exactly like
-- the TypeScript implementation. A caller that needs article-insensitive search
-- must opt in with normalize_arabic(value, true) or add an alias/synonym.
--
-- Quick checks:
--   SELECT normalize_arabic('شيبسى');  -- شيبسي
--   SELECT normalize_arabic('شيبسي');  -- شيبسي
--   SELECT normalize_arabic('مدرسة');  -- مدرسه
--   SELECT normalize_arabic('ة');      -- ه
--   SELECT normalize_arabic('  لبن   '); -- لبن

BEGIN;

SET search_path TO public;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;

-- ---------------------------------------------------------------------------
-- Arabic normalization
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION normalize_arabic(
  input text,
  strip_definite_article boolean DEFAULT false
)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  WITH lowered AS (
    SELECT lower(coalesce(input, '')) AS value
  ),
  unaccented AS (
    SELECT unaccent(value) AS value FROM lowered
  ),
  marks_removed AS (
    -- U+064B..U+065F, U+0670, and U+0640 (tatweel).
    SELECT regexp_replace(value, '[ً-ٰٟـ]', '', 'g') AS value FROM unaccented
  ),
  letters AS (
    SELECT translate(
      value,
      'أإآٱىةؤئپچژگکیۀە',
      'اااايهويبجزككيهه'
    ) AS value FROM marks_removed
  ),
  digits AS (
    SELECT translate(
      value,
      '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹',
      '01234567890123456789'
    ) AS value FROM letters
  ),
  cleaned AS (
    -- Keep ASCII letters/digits plus the Arabic letter block. This drops
    -- punctuation such as ! ? - _ / and Arabic punctuation such as ، ؛ ؟.
    SELECT regexp_replace(value, '[^a-z0-9ء-ي٠-٩۰-۹]+', ' ', 'g') AS value
    FROM digits
  ),
  collapsed AS (
    SELECT regexp_replace(value, '[[:space:]]+', ' ', 'g') AS value FROM cleaned
  ),
  trimmed AS (
    SELECT btrim(value) AS value FROM collapsed
  )
  SELECT CASE
    WHEN strip_definite_article THEN
      btrim(regexp_replace(value, '(^| )ال', '\1', 'g'))
    ELSE value
  END
  FROM trimmed;
$$;

COMMENT ON FUNCTION normalize_arabic(text, boolean) IS
  'Immutable Arabic search normalization matching src/utils/arabic/normalize-arabic.ts. "ال" is preserved by default.';

-- ---------------------------------------------------------------------------
-- Search indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "Product_searchText_trgm_idx"
  ON "Product" USING gin ("searchText" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Product_searchNameArNormalized_trgm_idx"
  ON "Product" USING gin ("searchNameArNormalized" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Product_searchNameEnNormalized_trgm_idx"
  ON "Product" USING gin ("searchNameEnNormalized" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "ProductAlias_normalizedAlias_trgm_idx"
  ON "ProductAlias" USING gin ("normalizedAlias" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "SearchSynonym_normalizedTerm_trgm_idx"
  ON "SearchSynonym" USING gin ("normalizedTerm" gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Search functions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION search_products(q text, lim integer DEFAULT 20)
RETURNS TABLE (
  "productId" text,
  "nameAr" text,
  "nameEn" text,
  "slug" text,
  "isFeatured" boolean,
  "matchTier" integer,
  "score" real,
  "matchedTerm" text
)
LANGUAGE sql
STABLE
AS $$
  WITH params AS (
    SELECT normalize_arabic(coalesce(q, '')) AS norm
  ),
  tokens AS (
    SELECT DISTINCT token
    FROM params, regexp_split_to_table(params.norm, '[[:space:]]+') AS token
    WHERE token <> ''
  ),
  synonym_groups AS (
    SELECT DISTINCT s."groupKey"
    FROM "SearchSynonym" s
    JOIN tokens t ON t.token = s."normalizedTerm"
    WHERE s."isActive"
  ),
  query_terms AS (
    SELECT token FROM tokens
    UNION
    SELECT s."normalizedTerm"
    FROM "SearchSynonym" s
    JOIN synonym_groups g ON g."groupKey" = s."groupKey"
    WHERE s."isActive"
  ),
  eligible AS (
    SELECT
      p.id,
      p."nameAr",
      p."nameEn",
      p."slug",
      p."isFeatured",
      p."searchText",
      p."searchNameArNormalized",
      p."searchNameEnNormalized",
      COALESCE((
        SELECT MAX(pa."weight")
        FROM "ProductAlias" pa
        WHERE pa."productId" = p.id
          AND pa."isSearchable"
          AND pa."normalizedAlias" IN (SELECT token FROM query_terms)
      ), 0) AS alias_weight
    FROM "Product" p
    WHERE p.status = 'ACTIVE'
      AND EXISTS (
        SELECT 1
        FROM "ProductPackage" pp
        WHERE pp."productId" = p.id
          AND pp."isPublished"
          AND pp."isActive"
      )
  ),
  matches AS (
    -- Tier 1: exact normalized name or alias.
    SELECT
      e.id,
      1 AS tier,
      (1000.0 + e.alias_weight * 10 + CASE WHEN e."isFeatured" THEN 5 ELSE 0 END)::real AS score,
      p.norm AS matched_term
    FROM eligible e, params p
    WHERE p.norm <> ''
      AND (
        e."searchNameArNormalized" = p.norm
        OR e."searchNameEnNormalized" = p.norm
        OR EXISTS (
          SELECT 1 FROM "ProductAlias" pa
          WHERE pa."productId" = e.id
            AND pa."isSearchable"
            AND pa."normalizedAlias" = p.norm
        )
      )

    UNION ALL

    -- Tier 2: prefix match on normalized name or alias.
    SELECT
      e.id,
      2 AS tier,
      (800.0 + e.alias_weight * 10 + CASE WHEN e."isFeatured" THEN 5 ELSE 0 END)::real AS score,
      p.norm AS matched_term
    FROM eligible e, params p
    WHERE p.norm <> ''
      AND (
        e."searchNameArNormalized" LIKE p.norm || '%'
        OR e."searchNameEnNormalized" LIKE p.norm || '%'
        OR EXISTS (
          SELECT 1 FROM "ProductAlias" pa
          WHERE pa."productId" = e.id
            AND pa."isSearchable"
            AND pa."normalizedAlias" LIKE p.norm || '%'
        )
      )

    UNION ALL

    -- Tier 3: synonym-expanded term match.
    SELECT
      e.id,
      3 AS tier,
      (600.0 + e.alias_weight * 10 + CASE WHEN e."isFeatured" THEN 5 ELSE 0 END)::real AS score,
      t.token AS matched_term
    FROM eligible e, query_terms t
    WHERE t.token <> ''
      AND (
        e."searchNameArNormalized" LIKE '%' || t.token || '%'
        OR e."searchNameEnNormalized" LIKE '%' || t.token || '%'
        OR e."searchText" LIKE '%' || t.token || '%'
        OR EXISTS (
          SELECT 1 FROM "ProductAlias" pa
          WHERE pa."productId" = e.id
            AND pa."isSearchable"
            AND pa."normalizedAlias" LIKE '%' || t.token || '%'
        )
      )

    UNION ALL

    -- Tier 4: trigram fallback for typos.
    SELECT
      e.id,
      4 AS tier,
      (300.0 + similarity(coalesce(e."searchText", ''), p.norm) * 100)::real AS score,
      p.norm AS matched_term
    FROM eligible e, params p
    WHERE p.norm <> ''
      AND similarity(coalesce(e."searchText", ''), p.norm) >= 0.15
  ),
  best AS (
    SELECT
      id,
      MIN(tier) AS tier,
      MAX(score) AS score,
      (array_agg(matched_term ORDER BY tier, score DESC))[1] AS matched_term
    FROM matches
    GROUP BY id
  )
  SELECT
    e.id,
    e."nameAr",
    e."nameEn",
    e."slug",
    e."isFeatured",
    b.tier,
    b.score,
    b.matched_term
  FROM best b
  JOIN eligible e ON e.id = b.id
  ORDER BY b.tier ASC, e."isFeatured" DESC, b.score DESC, e."nameAr" ASC
  LIMIT greatest(coalesce(lim, 20), 1);
$$;

COMMENT ON FUNCTION search_products(text, integer) IS
  'Four-tier product search: exact, prefix, synonym-expanded, trigram. Only ACTIVE products with at least one published+active package are returned.';

CREATE OR REPLACE FUNCTION suggest_similar(q text, lim integer DEFAULT 5)
RETURNS TABLE (
  "suggestion" text,
  "score" real,
  "productId" text,
  "source" text
)
LANGUAGE sql
STABLE
AS $$
  WITH params AS (
    SELECT normalize_arabic(coalesce(q, '')) AS norm
  ),
  candidates AS (
    SELECT
      p.id AS product_id,
      p."nameAr" AS suggestion,
      'product_name_ar'::text AS source
    FROM "Product" p
    WHERE p.status = 'ACTIVE'
      AND EXISTS (
        SELECT 1 FROM "ProductPackage" pp
        WHERE pp."productId" = p.id AND pp."isPublished" AND pp."isActive"
      )

    UNION ALL

    SELECT
      p.id,
      p."nameEn",
      'product_name_en'::text
    FROM "Product" p
    WHERE p.status = 'ACTIVE'
      AND p."nameEn" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "ProductPackage" pp
        WHERE pp."productId" = p.id AND pp."isPublished" AND pp."isActive"
      )

    UNION ALL

    SELECT
      pa."productId",
      pa."alias",
      'alias'::text
    FROM "ProductAlias" pa
    JOIN "Product" p ON p.id = pa."productId"
    WHERE p.status = 'ACTIVE'
      AND pa."isSearchable"
      AND EXISTS (
        SELECT 1 FROM "ProductPackage" pp
        WHERE pp."productId" = p.id AND pp."isPublished" AND pp."isActive"
      )

    UNION ALL

    SELECT
      NULL::text,
      s."term",
      'synonym'::text
    FROM "SearchSynonym" s
    WHERE s."isActive"
  )
  SELECT
    c.suggestion,
    similarity(normalize_arabic(c.suggestion), p.norm)::real AS score,
    c.product_id,
    c.source
  FROM candidates c, params p
  WHERE p.norm <> ''
    AND c.suggestion IS NOT NULL
    AND similarity(normalize_arabic(c.suggestion), p.norm) >= 0.15
  ORDER BY score DESC, c.suggestion ASC
  LIMIT greatest(coalesce(lim, 5), 1);
$$;

COMMENT ON FUNCTION suggest_similar(text, integer) IS
  'Trigram suggestions from active product names, aliases, and synonym terms.';

-- ---------------------------------------------------------------------------
-- CHECK constraints
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION mvp_ensure_check_constraint(
  p_table regclass,
  p_name text,
  p_expression text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = p_table
      AND conname = p_name
  ) THEN
    EXECUTE format(
      'ALTER TABLE %s ADD CONSTRAINT %I CHECK (%s)',
      p_table,
      p_name,
      p_expression
    );
  END IF;
END;
$$;

-- CartItem uniqueness:
--   Prisma already creates the unique constraint
--   "CartItem_cartId_productPackageId_key" from @@unique([cartId, productPackageId]).
--   Both columns are NOT NULL in the MVP, so no partial index or
--   NULLS NOT DISTINCT variant is needed. If either column becomes nullable,
--   replace the Prisma constraint with a unique index using NULLS NOT DISTINCT.

SELECT mvp_ensure_check_constraint(
  '"CartItem"'::regclass,
  'CartItem_quantity_positive',
  $check$"quantity" > 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"OrderItem"'::regclass,
  'OrderItem_quantity_positive',
  $check$"quantity" > 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"Order"'::regclass,
  'Order_money_nonnegative',
  $check$"subtotal" >= 0 AND "discountTotal" >= 0 AND "shippingTotal" >= 0 AND "taxTotal" >= 0 AND "grandTotal" >= 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"OrderItem"'::regclass,
  'OrderItem_money_nonnegative',
  $check$"unitPrice" >= 0 AND "discountAmount" >= 0 AND "taxAmount" >= 0 AND "lineTotal" >= 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"Invoice"'::regclass,
  'Invoice_money_nonnegative',
  $check$"subtotal" >= 0 AND "discountTotal" >= 0 AND "shippingTotal" >= 0 AND "taxTotal" >= 0 AND "grandTotal" >= 0 AND "taxAmount" >= 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"Payment"'::regclass,
  'Payment_amount_nonnegative',
  $check$"amount" >= 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"ShippingTariff"'::regclass,
  'ShippingTariff_baseCost_nonnegative',
  $check$"baseCost" >= 0$check$
);

SELECT mvp_ensure_check_constraint(
  '"Promotion"'::regclass,
  'Promotion_money_nonnegative',
  $check$"value" >= 0 AND ("maxDiscountAmount" IS NULL OR "maxDiscountAmount" >= 0) AND ("minOrderValue" IS NULL OR "minOrderValue" >= 0) AND ("audienceMinSpent" IS NULL OR "audienceMinSpent" >= 0)$check$
);

SELECT mvp_ensure_check_constraint(
  '"ProductPackage"'::regclass,
  'ProductPackage_compareAtPrice_gt_sellingPrice',
  $check$"compareAtPrice" IS NULL OR "compareAtPrice" > "sellingPrice"$check$
);

SELECT mvp_ensure_check_constraint(
  '"Notification"'::regclass,
  'Notification_recipient_exactly_one',
  $check$(
    ("recipientType" = 'CUSTOMER' AND "customerId" IS NOT NULL AND "employeeId" IS NULL)
    OR
    ("recipientType" = 'EMPLOYEE' AND "employeeId" IS NOT NULL AND "customerId" IS NULL)
  )$check$
);

SELECT mvp_ensure_check_constraint(
  '"PromotionTarget"'::regclass,
  'PromotionTarget_scope_target_exactly_one',
  $check$(
    ("scope" IN ('ORDER', 'SHIPPING')
      AND "productId" IS NULL AND "productPackageId" IS NULL
      AND "categoryId" IS NULL AND "subcategoryId" IS NULL)
    OR
    ("scope" = 'PRODUCT'
      AND "productId" IS NOT NULL AND "productPackageId" IS NULL
      AND "categoryId" IS NULL AND "subcategoryId" IS NULL)
    OR
    ("scope" = 'PACKAGE'
      AND "productPackageId" IS NOT NULL AND "productId" IS NULL
      AND "categoryId" IS NULL AND "subcategoryId" IS NULL)
    OR
    ("scope" = 'CATEGORY'
      AND "categoryId" IS NOT NULL AND "productId" IS NULL
      AND "productPackageId" IS NULL AND "subcategoryId" IS NULL)
    OR
    ("scope" = 'SUBCATEGORY'
      AND "subcategoryId" IS NOT NULL AND "productId" IS NULL
      AND "productPackageId" IS NULL AND "categoryId" IS NULL)
  )$check$
);

SELECT mvp_ensure_check_constraint(
  '"Promotion"'::regclass,
  'Promotion_endsAt_after_startsAt',
  $check$"endsAt" IS NULL OR "endsAt" >= "startsAt"$check$
);

SELECT mvp_ensure_check_constraint(
  '"Coupon"'::regclass,
  'Coupon_endsAt_after_startsAt',
  $check$"endsAt" IS NULL OR "startsAt" IS NULL OR "endsAt" >= "startsAt"$check$
);

SELECT mvp_ensure_check_constraint(
  '"Banner"'::regclass,
  'Banner_endsAt_after_startsAt',
  $check$"endsAt" IS NULL OR "startsAt" IS NULL OR "endsAt" >= "startsAt"$check$
);

SELECT mvp_ensure_check_constraint(
  '"ShippingTariff"'::regclass,
  'ShippingTariff_etaMax_gte_etaMin',
  $check$"etaMaxDays" >= "etaMinDays"$check$
);

SELECT mvp_ensure_check_constraint(
  '"Shipment"'::regclass,
  'Shipment_etaMax_gte_etaMin',
  $check$"etaMaxDays" IS NULL OR "etaMinDays" IS NULL OR "etaMaxDays" >= "etaMinDays"$check$
);

SELECT mvp_ensure_check_constraint(
  '"Promotion"'::regclass,
  'Promotion_audienceMax_gte_audienceMin',
  $check$"audienceMaxOrders" IS NULL OR "audienceMinOrders" IS NULL OR "audienceMaxOrders" >= "audienceMinOrders"$check$
);

SELECT mvp_ensure_check_constraint(
  '"Payment"'::regclass,
  'Payment_confirmed_requires_confirmedAt',
  $check$"status" <> 'CONFIRMED' OR "confirmedAt" IS NOT NULL$check$
);

-- ---------------------------------------------------------------------------
-- Append-only triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION reject_history_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% is append-only; UPDATE and DELETE are not allowed', TG_TABLE_NAME
    USING ERRCODE = '55000';
END;
$$;

DROP TRIGGER IF EXISTS "OrderStatusHistory_append_only" ON "OrderStatusHistory";
CREATE TRIGGER "OrderStatusHistory_append_only"
  BEFORE UPDATE OR DELETE ON "OrderStatusHistory"
  FOR EACH ROW EXECUTE FUNCTION reject_history_mutation();

DROP TRIGGER IF EXISTS "ShipmentStatusHistory_append_only" ON "ShipmentStatusHistory";
CREATE TRIGGER "ShipmentStatusHistory_append_only"
  BEFORE UPDATE OR DELETE ON "ShipmentStatusHistory"
  FOR EACH ROW EXECUTE FUNCTION reject_history_mutation();

DROP TRIGGER IF EXISTS "AuditLog_append_only" ON "AuditLog";
CREATE TRIGGER "AuditLog_append_only"
  BEFORE UPDATE OR DELETE ON "AuditLog"
  FOR EACH ROW EXECUTE FUNCTION reject_history_mutation();

-- Bundle components must point to a normal FINISHED product package, never to
-- the package of another PREDEFINED_BUNDLE product.
CREATE OR REPLACE FUNCTION reject_bundle_component_bundle()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  component_type "EProductType";
BEGIN
  SELECT p."productType"
  INTO component_type
  FROM "ProductPackage" pp
  JOIN "Product" p ON p.id = pp."productId"
  WHERE pp.id = NEW."componentPackageId";

  IF component_type = 'PREDEFINED_BUNDLE' THEN
    RAISE EXCEPTION
      'ProductBundleComponent % cannot use package % from a PREDEFINED_BUNDLE product',
      NEW."bundleProductId",
      NEW."componentPackageId"
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "ProductBundleComponent_no_nested_bundles" ON "ProductBundleComponent";
CREATE TRIGGER "ProductBundleComponent_no_nested_bundles"
  BEFORE INSERT OR UPDATE ON "ProductBundleComponent"
  FOR EACH ROW EXECUTE FUNCTION reject_bundle_component_bundle();

-- ---------------------------------------------------------------------------
-- Reporting views
-- ---------------------------------------------------------------------------

-- Uses: Order(customerId, status, deliveredAt), Customer(completedOrdersCount,
-- lastOrderAt). No extra index is needed at MVP scale.
CREATE OR REPLACE VIEW "customer_order_stats_drift" AS
WITH actual AS (
  SELECT
    o."customerId",
    COUNT(*)::integer AS "actualCompletedOrdersCount",
    coalesce(sum(o."grandTotal"), 0)::numeric(18, 4) AS "actualTotalSpent",
    min(o."deliveredAt") AS "actualFirstOrderAt",
    max(o."deliveredAt") AS "actualLastOrderAt"
  FROM "Order" o
  WHERE o.status = 'DELIVERED'
  GROUP BY o."customerId"
)
SELECT
  c.id AS "customerId",
  c.phone,
  c."completedOrdersCount" AS "cachedCompletedOrdersCount",
  coalesce(a."actualCompletedOrdersCount", 0) AS "actualCompletedOrdersCount",
  c."totalSpent" AS "cachedTotalSpent",
  coalesce(a."actualTotalSpent", 0)::numeric(18, 4) AS "actualTotalSpent",
  c."firstOrderAt" AS "cachedFirstOrderAt",
  a."actualFirstOrderAt",
  c."lastOrderAt" AS "cachedLastOrderAt",
  a."actualLastOrderAt"
FROM "Customer" c
LEFT JOIN actual a ON a."customerId" = c.id
WHERE c."completedOrdersCount" IS DISTINCT FROM coalesce(a."actualCompletedOrdersCount", 0)
   OR c."totalSpent" IS DISTINCT FROM coalesce(a."actualTotalSpent", 0)::numeric(18, 4)
   OR c."firstOrderAt" IS DISTINCT FROM a."actualFirstOrderAt"
   OR c."lastOrderAt" IS DISTINCT FROM a."actualLastOrderAt";

-- Uses: Shipment(status, codSettledAt). No extra index is needed.
CREATE OR REPLACE VIEW "cod_awaiting_settlement" AS
SELECT
  s.id AS "shipmentId",
  s."shipmentNumber",
  s."orderId",
  o."orderNumber",
  s."carrierId",
  c.name AS "carrierName",
  s."codAmount",
  s."codCollected",
  s."deliveredAt",
  s."createdAt"
FROM "Shipment" s
JOIN "Order" o ON o.id = s."orderId"
JOIN "ShippingCarrier" c ON c.id = s."carrierId"
WHERE s.status = 'DELIVERED'
  AND s."codSettledAt" IS NULL
ORDER BY s."deliveredAt" ASC NULLS LAST;

-- Uses: Product(productType, status), ProductPackage(productId, isActive),
-- ProductBundleComponent(bundleProductId, componentPackageId). No extra index.
-- isLosingMoney means the bundle price is below the sum of component selling
-- prices. It is a pricing signal, not a cost/profit calculation.
CREATE OR REPLACE VIEW "bundle_pricing" AS
SELECT
  p.id AS "bundleProductId",
  p."nameAr" AS "bundleNameAr",
  bp.id AS "bundlePackageId",
  bp.sku AS "bundleSku",
  bp."sellingPrice" AS "bundleSellingPrice",
  coalesce(sum(pbc."quantity" * cp."sellingPrice"), 0)::numeric(18, 4) AS "componentTotal",
  (bp."sellingPrice" - coalesce(sum(pbc."quantity" * cp."sellingPrice"), 0))::numeric(18, 4) AS "savings",
  (bp."sellingPrice" < coalesce(sum(pbc."quantity" * cp."sellingPrice"), 0)) AS "isLosingMoney",
  count(pbc.id)::integer AS "componentCount"
FROM "Product" p
JOIN "ProductPackage" bp ON bp."productId" = p.id
LEFT JOIN "ProductBundleComponent" pbc ON pbc."bundleProductId" = p.id
LEFT JOIN "ProductPackage" cp ON cp.id = pbc."componentPackageId"
WHERE p."productType" = 'PREDEFINED_BUNDLE'
GROUP BY p.id, p."nameAr", bp.id, bp.sku, bp."sellingPrice";

-- Uses: Order(deliveredAt), OrderItem(orderId). No extra index at MVP scale.
CREATE OR REPLACE VIEW "report_sales_daily" AS
WITH order_totals AS (
  SELECT
    o."deliveredAt"::date AS "salesDate",
    count(*)::integer AS "deliveredOrders",
    coalesce(sum(o."subtotal"), 0)::numeric(18, 4) AS "subtotal",
    coalesce(sum(o."discountTotal"), 0)::numeric(18, 4) AS "discountTotal",
    coalesce(sum(o."shippingTotal"), 0)::numeric(18, 4) AS "shippingTotal",
    coalesce(sum(o."taxTotal"), 0)::numeric(18, 4) AS "taxTotal",
    coalesce(sum(o."grandTotal"), 0)::numeric(18, 4) AS "grandTotal"
  FROM "Order" o
  WHERE o.status = 'DELIVERED'
    AND o."deliveredAt" IS NOT NULL
  GROUP BY o."deliveredAt"::date
),
item_totals AS (
  SELECT
    o."deliveredAt"::date AS "salesDate",
    coalesce(sum(oi."quantity"), 0)::numeric(18, 4) AS "unitsSold"
  FROM "Order" o
  JOIN "OrderItem" oi ON oi."orderId" = o.id
  WHERE o.status = 'DELIVERED'
    AND o."deliveredAt" IS NOT NULL
  GROUP BY o."deliveredAt"::date
)
SELECT
  ot."salesDate",
  ot."deliveredOrders",
  coalesce(it."unitsSold", 0)::numeric(18, 4) AS "unitsSold",
  ot."subtotal",
  ot."discountTotal",
  ot."shippingTotal",
  ot."taxTotal",
  ot."grandTotal"
FROM order_totals ot
LEFT JOIN item_totals it ON it."salesDate" = ot."salesDate"
ORDER BY ot."salesDate" DESC;

-- Uses: Order(status, deliveredAt), OrderItem(orderId). No extra index.
CREATE OR REPLACE VIEW "report_top_products" AS
SELECT
  oi."productId",
  oi."productNameArSnapshot" AS "productNameAr",
  oi."skuSnapshot" AS "sku",
  coalesce(sum(oi."quantity"), 0)::numeric(18, 4) AS "unitsSold",
  count(DISTINCT o.id)::integer AS "ordersCount",
  coalesce(sum(oi."unitPrice" * oi."quantity"), 0)::numeric(18, 4) AS "grossSales",
  coalesce(sum(oi."discountAmount"), 0)::numeric(18, 4) AS "discountTotal",
  coalesce(sum(oi."lineTotal"), 0)::numeric(18, 4) AS "netSales"
FROM "Order" o
JOIN "OrderItem" oi ON oi."orderId" = o.id
WHERE o.status = 'DELIVERED'
GROUP BY oi."productId", oi."productNameArSnapshot", oi."skuSnapshot"
ORDER BY "unitsSold" DESC, "netSales" DESC;

-- Uses: Order(status, deliveredAt), OrderItem(orderId). No extra index.
CREATE OR REPLACE VIEW "report_top_products_monthly" AS
SELECT
  date_trunc('month', o."deliveredAt")::date AS "salesMonth",
  oi."productId",
  oi."productNameArSnapshot" AS "productNameAr",
  oi."skuSnapshot" AS "sku",
  coalesce(sum(oi."quantity"), 0)::numeric(18, 4) AS "unitsSold",
  count(DISTINCT o.id)::integer AS "ordersCount",
  coalesce(sum(oi."lineTotal"), 0)::numeric(18, 4) AS "netSales"
FROM "Order" o
JOIN "OrderItem" oi ON oi."orderId" = o.id
WHERE o.status = 'DELIVERED'
  AND o."deliveredAt" IS NOT NULL
GROUP BY date_trunc('month', o."deliveredAt")::date,
         oi."productId", oi."productNameArSnapshot", oi."skuSnapshot"
ORDER BY "salesMonth" DESC, "unitsSold" DESC;

-- Uses: Customer PK, Order(customerId, status, deliveredAt). No extra index.
CREATE OR REPLACE VIEW "report_customers_summary" AS
WITH actual AS (
  SELECT
    o."customerId",
    count(*)::integer AS "completedOrdersCount",
    coalesce(sum(o."grandTotal"), 0)::numeric(18, 4) AS "totalSpent",
    min(o."deliveredAt") AS "firstOrderAt",
    max(o."deliveredAt") AS "lastOrderAt"
  FROM "Order" o
  WHERE o.status = 'DELIVERED'
  GROUP BY o."customerId"
)
SELECT
  c.id AS "customerId",
  c.phone,
  btrim(concat_ws(' ', c."firstName", c."lastName")) AS "customerName",
  coalesce(a."completedOrdersCount", 0) AS "completedOrdersCount",
  coalesce(a."totalSpent", 0)::numeric(18, 4) AS "totalSpent",
  a."firstOrderAt",
  a."lastOrderAt",
  CASE
    WHEN coalesce(a."completedOrdersCount", 0) = 0 THEN 0::numeric(18, 4)
    ELSE round(coalesce(a."totalSpent", 0) / a."completedOrdersCount", 4)
  END AS "averageOrderValue"
FROM "Customer" c
LEFT JOIN actual a ON a."customerId" = c.id;

-- Uses: Customer PK, Order(customerId, status, deliveredAt). No extra index.
CREATE OR REPLACE VIEW "report_customer_segments" AS
WITH actual AS (
  SELECT
    o."customerId",
    count(*)::integer AS "completedOrdersCount",
    coalesce(sum(o."grandTotal"), 0)::numeric(18, 4) AS "totalSpent"
  FROM "Order" o
  WHERE o.status = 'DELIVERED'
  GROUP BY o."customerId"
)
SELECT
  c.id AS "customerId",
  c.phone,
  coalesce(a."completedOrdersCount", 0) AS "completedOrdersCount",
  coalesce(a."totalSpent", 0)::numeric(18, 4) AS "totalSpent",
  CASE
    WHEN coalesce(a."completedOrdersCount", 0) = 0 THEN 'NO_ORDERS'
    WHEN a."completedOrdersCount" = 1 THEN 'ONE_ORDER'
    WHEN a."completedOrdersCount" BETWEEN 2 AND 4 THEN 'REPEAT'
    ELSE 'LOYAL'
  END AS "segment"
FROM "Customer" c
LEFT JOIN actual a ON a."customerId" = c.id;

-- Uses: Payment(status, createdAt), Order PK. No extra index.
CREATE OR REPLACE VIEW "report_payments_pending" AS
SELECT
  p.id AS "paymentId",
  p."orderId",
  o."orderNumber",
  p.method,
  p.status,
  p.amount,
  p."proofImageUrl",
  p."createdAt",
  round(extract(epoch FROM (now() - p."createdAt")) / 3600, 2) AS "ageHours"
FROM "Payment" p
JOIN "Order" o ON o.id = p."orderId"
WHERE p.status IN ('PENDING', 'PROOF_UPLOADED')
ORDER BY p."createdAt" ASC;

-- Uses: PromotionRedemption(promotionId, redeemedAt). No extra index.
CREATE OR REPLACE VIEW "report_promotions_performance" AS
SELECT
  pr.id AS "promotionId",
  pr.name,
  pr."promotionType",
  count(r.id)::integer AS "redemptionsCount",
  count(DISTINCT r."orderId")::integer AS "ordersCount",
  count(DISTINCT r."customerId")::integer AS "customersCount",
  coalesce(sum(r."discountAmount"), 0)::numeric(18, 4) AS "totalDiscount",
  min(r."redeemedAt") AS "firstRedeemedAt",
  max(r."redeemedAt") AS "lastRedeemedAt"
FROM "Promotion" pr
LEFT JOIN "PromotionRedemption" r ON r."promotionId" = pr.id
GROUP BY pr.id, pr.name, pr."promotionType";

-- Uses: SearchLog(resultCount, createdAt). No extra index.
CREATE OR REPLACE VIEW "report_zero_result_searches" AS
SELECT
  sl."normalizedQuery",
  count(*)::integer AS "searchCount",
  min(sl."createdAt") AS "firstSeenAt",
  max(sl."createdAt") AS "lastSeenAt"
FROM "SearchLog" sl
WHERE sl."resultCount" = 0
GROUP BY sl."normalizedQuery"
ORDER BY "searchCount" DESC;

-- Uses: SearchLog(normalizedQuery). No extra index.
CREATE OR REPLACE VIEW "report_top_searches" AS
SELECT
  sl."normalizedQuery",
  count(*)::integer AS "searchCount",
  round(avg(sl."resultCount"), 2) AS "averageResultCount",
  count(sl."clickedProductId")::integer AS "clickedCount",
  max(sl."createdAt") AS "lastSeenAt"
FROM "SearchLog" sl
GROUP BY sl."normalizedQuery"
ORDER BY "searchCount" DESC;

COMMIT;
