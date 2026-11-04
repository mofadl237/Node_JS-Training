import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateStaticPageInput,
  IStaticPageResponse,
  IListStaticPageQuery,
  IUpdateStaticPageInput,
} from "./types.js";

const selectStaticPage = {
  id: true,
  slug: true,
  titleAr: true,
  titleEn: true,
  bodyAr: true,
  bodyEn: true,
  status: true,
  seoTitleAr: true,
  seoTitleEn: true,
  seoDescriptionAr: true,
  seoDescriptionEn: true,
  canonicalUrl: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class StaticPageService {
  async create(dto: ICreateStaticPageInput): Promise<IStaticPageResponse> {
    const created = await prisma.staticPage.create({
      data: dto as Prisma.StaticPageUncheckedCreateInput,
      select: selectStaticPage,
    });
    return created as unknown as IStaticPageResponse;
  }

  async list(query: IListStaticPageQuery = {} as IListStaticPageQuery) {
    const where: Prisma.StaticPageWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { slug: { contains: query.q, mode: "insensitive" } },
      { titleAr: { contains: query.q, mode: "insensitive" } },
      { titleEn: { contains: query.q, mode: "insensitive" } },
      { bodyAr: { contains: query.q, mode: "insensitive" } },
      { bodyEn: { contains: query.q, mode: "insensitive" } },
      { seoTitleAr: { contains: query.q, mode: "insensitive" } },
      { seoTitleEn: { contains: query.q, mode: "insensitive" } },
      { seoDescriptionAr: { contains: query.q, mode: "insensitive" } },
      { seoDescriptionEn: { contains: query.q, mode: "insensitive" } },
      { canonicalUrl: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.staticPage.findMany({
        where,
        select: selectStaticPage,
        orderBy: { [sortBy]: sortOrder } as Prisma.StaticPageOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.staticPage.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IStaticPageResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IStaticPageResponse> {
    const item = await prisma.staticPage.findUnique({
      where: { id },
      select: selectStaticPage,
    });

    if (!item) {
      throw new NotFoundError("StaticPage not found", "STATICPAGE_NOT_FOUND");
    }

    return item as unknown as IStaticPageResponse;
  }

  async update(id: string, dto: IUpdateStaticPageInput): Promise<IStaticPageResponse> {
    const updated = await prisma.staticPage.update({
      where: { id },
      data: dto as Prisma.StaticPageUncheckedUpdateInput,
      select: selectStaticPage,
    });
    return updated as unknown as IStaticPageResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.staticPage.delete({ where: { id } });
  }
}
