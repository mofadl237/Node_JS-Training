import { prisma } from "../../../config/prisma.js";

// Sitemap feed (B7): slugs + updatedAt for everything the storefront renders
// public URLs for. The frontend builds app/sitemap.ts from this, so the store
// and the sitemap can never disagree about what exists.

export interface ISitemapEntity {
  slug: string;
  updatedAt: string;
}

export interface IStoreSitemap {
  products: ISitemapEntity[];
  categories: ISitemapEntity[];
  subcategories: ISitemapEntity[];
  pages: ISitemapEntity[];
}

export class StoreSitemapService {
  async get(): Promise<IStoreSitemap> {
    const [products, categories, subcategories, pages] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
        },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.subcategory.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.staticPage.findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const toEntities = (rows: { slug: string; updatedAt: Date }[]) =>
      rows.map((row) => ({
        slug: row.slug,
        updatedAt: row.updatedAt.toISOString(),
      }));

    return {
      products: toEntities(products),
      categories: toEntities(categories),
      subcategories: toEntities(subcategories),
      pages: toEntities(pages),
    };
  }
}
