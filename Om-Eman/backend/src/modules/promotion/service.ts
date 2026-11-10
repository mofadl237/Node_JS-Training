import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreatePromotionInput,
  IPromotionResponse,
  IListPromotionQuery,
  IUpdatePromotionInput,
} from "./types.js";

const selectPromotion = {
  id: true,
  name: true,
  description: true,
  promotionType: true,
  discountType: true,
  value: true,
  maxDiscountAmount: true,
  minOrderValue: true,
  startsAt: true,
  endsAt: true,
  usageLimitTotal: true,
  usageLimitPerCustomer: true,
  combinationRules: true,
  allowOnDiscountedItems: true,
  audienceMinOrders: true,
  audienceMaxOrders: true,
  audienceMinSpent: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class PromotionService {
  async create(dto: ICreatePromotionInput): Promise<IPromotionResponse> {
    const created = await prisma.promotion.create({
      data: dto as Prisma.PromotionUncheckedCreateInput,
      select: selectPromotion,
    });
    return created as unknown as IPromotionResponse;
  }

  async list(query: IListPromotionQuery = {} as IListPromotionQuery) {
    const where: Prisma.PromotionWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { name: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.promotion.findMany({
        where,
        select: selectPromotion,
        orderBy: { [sortBy]: sortOrder } as Prisma.PromotionOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.promotion.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IPromotionResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IPromotionResponse> {
    const item = await prisma.promotion.findUnique({
      where: { id },
      select: selectPromotion,
    });

    if (!item) {
      throw new NotFoundError("Promotion not found", "PROMOTION_NOT_FOUND");
    }

    return item as unknown as IPromotionResponse;
  }

  async update(id: string, dto: IUpdatePromotionInput): Promise<IPromotionResponse> {
    const updated = await prisma.promotion.update({
      where: { id },
      data: dto as Prisma.PromotionUncheckedUpdateInput,
      select: selectPromotion,
    });
    return updated as unknown as IPromotionResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.promotion.delete({ where: { id } });
  }
}
