import { prisma } from "../../../config/prisma.js";

// Storefront category tree (B3): active categories with their active
// subcategories, ordered, plus a live products count per node so the home page
// can show "how much is inside" without a second request per card.
//
// A product counts only when it matches the listing rule of
// store/products/list.ts (ACTIVE, publish window open, sellable package).

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

interface ICountRow {
  subcategoryId: string;
  count: bigint;
}

export class StoreCategoriesService {
  async getTree(): Promise<IStoreCategoryNode[]> {
    const [categories, counts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          nameAr: true,
          nameEn: true,
          descriptionAr: true,
          descriptionEn: true,
          imageUrl: true,
          sortOrder: true,
          subcategories: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              slug: true,
              nameAr: true,
              nameEn: true,
              imageUrl: true,
              sortOrder: true,
            },
          },
        },
      }),
      prisma.$queryRaw<ICountRow[]>`
        SELECT s."id" AS "subcategoryId", COUNT(DISTINCT p."id") AS "count"
        FROM "Subcategory" s
        JOIN "Product" p
          ON p."primarySubcategoryId" = s."id"
          AND p."status" = 'ACTIVE'
          AND (p."publishedAt" IS NULL OR p."publishedAt" <= now())
        JOIN "ProductPackage" pk
          ON pk."productId" = p."id"
          AND pk."isActive" = TRUE AND pk."isPublished" = TRUE
        WHERE s."isActive" = TRUE
        GROUP BY s."id"
      `,
    ]);

    const countsBySubcategory = new Map(
      counts.map((row) => [row.subcategoryId, Number(row.count)]),
    );

    return categories.map((category) => {
      const subcategories = category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        slug: subcategory.slug,
        nameAr: subcategory.nameAr,
        nameEn: subcategory.nameEn,
        imageUrl: subcategory.imageUrl,
        sortOrder: subcategory.sortOrder,
        productsCount: countsBySubcategory.get(subcategory.id) ?? 0,
      }));

      return {
        id: category.id,
        slug: category.slug,
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        descriptionAr: category.descriptionAr,
        descriptionEn: category.descriptionEn,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        productsCount: subcategories.reduce(
          (sum, subcategory) => sum + subcategory.productsCount,
          0,
        ),
        subcategories,
      };
    });
  }
}
