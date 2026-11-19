import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import {
  toPaginatedResult,
  type IPaginatedResult,
} from "../../../shared/pagination.js";
import {
  mapListRowToCard,
  type IListRow,
  type IStoreProductCard,
} from "./card.js";
import type { TProductListSort } from "./validation.js";

// Storefront product listing (B2). One SQL query (plus a count) with lateral
// joins instead of N+1: cards need the cheapest published package, the primary
// image, and category refs for every product.
//
// A product is "listed" when it is ACTIVE, its publish window is open, and it
// has at least one active+published package.

interface IListFilter {
  categorySlug?: string | undefined;
  subcategorySlug?: string | undefined;
  featured?: boolean | undefined;
  inStock?: boolean | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sort: TProductListSort;
}

// Shared sellable-package condition for correlated subqueries. The alias must
// match the FROM clause of each subquery (Postgres 42P01 if a different alias
// like pk0 is referenced), so it is parameterized per use.
function sellablePackages(alias: string): Prisma.Sql {
  const a = Prisma.raw(alias);
  return Prisma.sql`${a}."productId" = p."id" AND ${a}."isActive" = TRUE AND ${a}."isPublished" = TRUE`;
}

function buildConditions(filter: IListFilter): Prisma.Sql[] {
  const conditions = [
    Prisma.sql`p."status" = 'ACTIVE'`,
    Prisma.sql`(p."publishedAt" IS NULL OR p."publishedAt" <= now())`,
    Prisma.sql`pk."fromPrice" IS NOT NULL`,
  ];
  if (filter.categorySlug) {
    conditions.push(Prisma.sql`c."slug" = ${filter.categorySlug}`);
  }
  if (filter.subcategorySlug) {
    conditions.push(Prisma.sql`s."slug" = ${filter.subcategorySlug}`);
  }
  if (filter.featured) {
    conditions.push(Prisma.sql`p."isFeatured" = TRUE`);
  }
  if (filter.minPrice !== undefined) {
    conditions.push(Prisma.sql`pk."fromPrice" >= ${filter.minPrice}`);
  }
  if (filter.maxPrice !== undefined) {
    conditions.push(Prisma.sql`pk."fromPrice" <= ${filter.maxPrice}`);
  }
  if (filter.inStock) {
    conditions.push(
      Prisma.sql`EXISTS (
        SELECT 1 FROM "ProductPackage" spf
        WHERE ${sellablePackages("spf")} AND spf."stockStatus" = 'IN_STOCK'
      )`,
    );
  }
  return conditions;
}

function buildOrderBy(sort: TProductListSort): Prisma.Sql {
  switch (sort) {
    case "price_asc":
      return Prisma.sql`pk."fromPrice" ASC, p."id" ASC`;
    case "price_desc":
      return Prisma.sql`pk."fromPrice" DESC, p."id" ASC`;
    case "name":
      return Prisma.sql`p."nameAr" ASC, p."id" ASC`;
    case "newest":
    default:
      return Prisma.sql`p."createdAt" DESC, p."id" ASC`;
  }
}

// The exact SQL that produces an IStoreProductCard row. Exported so the search
// module enriches matched ids into byte-identical cards.
export const SELECT_FRAGMENT = Prisma.sql`
  p."id" AS "id",
  p."slug" AS "slug",
  p."nameAr" AS "nameAr",
  p."nameEn" AS "nameEn",
  p."brand" AS "brand",
  p."productType"::text AS "productType",
  p."isFeatured" AS "isFeatured",
  img."primaryImageUrl" AS "primaryImageUrl",
  img."primaryImageAltAr" AS "primaryImageAltAr",
  img."primaryImageAltEn" AS "primaryImageAltEn",
  img."secondaryImageUrl" AS "secondaryImageUrl",
  pk."defaultPackageId" AS "defaultPackageId",
  pk."fromPrice" AS "fromPrice",
  pk."compareAtFrom" AS "compareAtFrom",
  pk."saleEndsAt" AS "saleEndsAt",
  (SELECT COUNT(*) FROM "ProductPackage" spc WHERE ${sellablePackages("spc")}) AS "packageCount",
  EXISTS (
    SELECT 1 FROM "ProductPackage" spi
    WHERE ${sellablePackages("spi")} AND spi."stockStatus" = 'IN_STOCK'
  ) AS "inStock",
  s."slug" AS "subcategorySlug",
  s."nameAr" AS "subcategoryNameAr",
  s."nameEn" AS "subcategoryNameEn",
  c."slug" AS "categorySlug",
  c."nameAr" AS "categoryNameAr",
  c."nameEn" AS "categoryNameEn"`;

export const JOIN_FRAGMENT = Prisma.sql`
  FROM "Product" p
  JOIN "Subcategory" s ON s."id" = p."primarySubcategoryId" AND s."isActive" = TRUE
  JOIN "Category" c ON c."id" = s."categoryId" AND c."isActive" = TRUE
  LEFT JOIN LATERAL (
    SELECT
      MAX(url) FILTER (WHERE rn = 1) AS "primaryImageUrl",
      MAX("altAr") FILTER (WHERE rn = 1) AS "primaryImageAltAr",
      MAX("altEn") FILTER (WHERE rn = 1) AS "primaryImageAltEn",
      MAX(url) FILTER (WHERE rn = 2) AS "secondaryImageUrl"
    FROM (
      SELECT url, "altAr", "altEn",
             row_number() OVER (
               ORDER BY "isPrimary" DESC, "sortOrder" ASC, "createdAt" ASC
             ) AS rn
      FROM "ProductImage" pi
      WHERE pi."productId" = p."id"
    ) ranked
  ) img ON TRUE
  LEFT JOIN LATERAL (
    SELECT
      pk3."id" AS "defaultPackageId",
      pk3."sellingPrice" AS "fromPrice",
      pk3."compareAtPrice" AS "compareAtFrom",
      pk3."saleEndsAt" AS "saleEndsAt"
    FROM "ProductPackage" pk3
    WHERE pk3."productId" = p."id" AND pk3."isActive" = TRUE AND pk3."isPublished" = TRUE
    ORDER BY pk3."sellingPrice" ASC, pk3."sortOrder" ASC
    LIMIT 1
  ) pk ON TRUE`;

export async function listStoreProducts(
  filter: IListFilter,
  page: number,
  limit: number,
): Promise<IPaginatedResult<IStoreProductCard>> {
  const where = Prisma.join(buildConditions(filter), " AND ");
  const offset = (page - 1) * limit;

  const rows = await prisma.$queryRaw<IListRow[]>`
    SELECT ${SELECT_FRAGMENT}
    ${JOIN_FRAGMENT}
    WHERE ${where}
    ORDER BY ${buildOrderBy(filter.sort)}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countRows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) AS "count"
    ${JOIN_FRAGMENT}
    WHERE ${where}
  `;

  const total = Number(countRows[0]?.count ?? 0);
  const { items, meta } = toPaginatedResult(
    rows.map(mapListRowToCard),
    total,
    page,
    limit,
  );
  return { items, meta };
}

// Related products for the product page: same subcategory, the current
// product excluded, newest first. Small fixed size, no pagination.
export async function listRelatedProducts(
  subcategoryId: string,
  excludeProductId: string,
  limit = 8,
): Promise<IStoreProductCard[]> {
  const rows = await prisma.$queryRaw<IListRow[]>`
    SELECT ${SELECT_FRAGMENT}
    ${JOIN_FRAGMENT}
    WHERE ${Prisma.join(buildConditions({ sort: "newest" }), " AND ")}
      AND p."primarySubcategoryId" = ${subcategoryId}
      AND p."id" <> ${excludeProductId}
    ORDER BY ${buildOrderBy("newest")}
    LIMIT ${limit}
  `;
  return rows.map(mapListRowToCard);
}
