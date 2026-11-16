import { prisma } from "../../../config/prisma.js";

// Storefront content (B6): the small set of CMS rows the store renders.
// Only active rows in their date window are exposed.

export interface IStoreBanner {
  id: string;
  titleAr: string;
  titleEn: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
}

export interface IStoreFaq {
  id: string;
  questionAr: string;
  questionEn: string | null;
  answerAr: string;
  answerEn: string | null;
  category: string | null;
  sortOrder: number;
}

export interface IStoreStaticPage {
  slug: string;
  titleAr: string;
  titleEn: string | null;
  bodyAr: string;
  bodyEn: string | null;
  seoTitleAr: string | null;
  seoDescriptionAr: string | null;
  publishedAt: string | null;
  updatedAt: string;
}

export class StoreContentService {
  async getBanners(): Promise<IStoreBanner[]> {
    const now = new Date();
    return prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        imageUrl: true,
        mobileImageUrl: true,
        linkUrl: true,
        sortOrder: true,
      },
    });
  }

  async getFaqs(): Promise<IStoreFaq[]> {
    return prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        questionAr: true,
        questionEn: true,
        answerAr: true,
        answerEn: true,
        category: true,
        sortOrder: true,
      },
    });
  }

  async getPageBySlug(slug: string): Promise<IStoreStaticPage | null> {
    const page = await prisma.staticPage.findFirst({
      where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: {
        slug: true,
        titleAr: true,
        titleEn: true,
        bodyAr: true,
        bodyEn: true,
        seoTitleAr: true,
        seoDescriptionAr: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    if (!page) return null;
    return {
      ...page,
      publishedAt: page.publishedAt ? page.publishedAt.toISOString() : null,
      updatedAt: page.updatedAt.toISOString(),
    };
  }
}
