import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateBannerInput,
  IBannerResponse,
  IListBannerQuery,
  IUpdateBannerInput,
} from "./types.js";

const selectBanner = {
  id: true,
  titleAr: true,
  titleEn: true,
  imageUrl: true,
  mobileImageUrl: true,
  linkUrl: true,
  startsAt: true,
  endsAt: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class BannerService {
  async create(dto: ICreateBannerInput): Promise<IBannerResponse> {
    const created = await prisma.banner.create({
      data: dto as Prisma.BannerUncheckedCreateInput,
      select: selectBanner,
    });
    return created as unknown as IBannerResponse;
  }

  async list(query: IListBannerQuery = {} as IListBannerQuery) {
    const where: Prisma.BannerWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { titleAr: { contains: query.q, mode: "insensitive" } },
      { titleEn: { contains: query.q, mode: "insensitive" } },
      { imageUrl: { contains: query.q, mode: "insensitive" } },
      { mobileImageUrl: { contains: query.q, mode: "insensitive" } },
      { linkUrl: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.banner.findMany({
        where,
        select: selectBanner,
        orderBy: { [sortBy]: sortOrder } as Prisma.BannerOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.banner.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IBannerResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IBannerResponse> {
    const item = await prisma.banner.findUnique({
      where: { id },
      select: selectBanner,
    });

    if (!item) {
      throw new NotFoundError("Banner not found", "BANNER_NOT_FOUND");
    }

    return item as unknown as IBannerResponse;
  }

  async update(id: string, dto: IUpdateBannerInput): Promise<IBannerResponse> {
    const updated = await prisma.banner.update({
      where: { id },
      data: dto as Prisma.BannerUncheckedUpdateInput,
      select: selectBanner,
    });
    return updated as unknown as IBannerResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.banner.delete({ where: { id } });
  }
}
