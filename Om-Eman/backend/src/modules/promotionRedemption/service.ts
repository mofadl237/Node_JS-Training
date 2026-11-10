import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  ICreatePromotionRedemptionInput,
  IPromotionRedemptionResponse,
  IListPromotionRedemptionQuery,
  IUpdatePromotionRedemptionInput,
} from "./types.js";

const selectPromotionRedemption = {
  id: true,
  promotionId: true,
  couponId: true,
  orderId: true,
  orderItemId: true,
  customerId: true,
  discountAmount: true,
  rulesSnapshot: true,
  redeemedAt: true,
  createdAt: true,
} as const;

export class PromotionRedemptionService {
  async create(dto: ICreatePromotionRedemptionInput): Promise<IPromotionRedemptionResponse> {
    const created = await prisma.promotionRedemption.create({
      data: dto as Prisma.PromotionRedemptionUncheckedCreateInput,
      select: selectPromotionRedemption,
    });
    return created as unknown as IPromotionRedemptionResponse;
  }

  async list(query: IListPromotionRedemptionQuery = {} as IListPromotionRedemptionQuery) {
    const where: Prisma.PromotionRedemptionWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { promotionId: { contains: query.q, mode: "insensitive" } },
      { couponId: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { orderItemId: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.promotionRedemption.findMany({
        where,
        select: selectPromotionRedemption,
        orderBy: { [sortBy]: sortOrder } as Prisma.PromotionRedemptionOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.promotionRedemption.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IPromotionRedemptionResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IPromotionRedemptionResponse> {
    const item = await prisma.promotionRedemption.findUnique({
      where: { id },
      select: selectPromotionRedemption,
    });

    if (!item) {
      throw new NotFoundError("PromotionRedemption not found", "PROMOTIONREDEMPTION_NOT_FOUND");
    }

    return item as unknown as IPromotionRedemptionResponse;
  }

  async update(id: string, dto: IUpdatePromotionRedemptionInput): Promise<IPromotionRedemptionResponse> {
    throw new BadRequestError("PromotionRedemption is append-only", "APPEND_ONLY");
  }

  async remove(id: string): Promise<void> {
    throw new BadRequestError("PromotionRedemption is append-only", "APPEND_ONLY");
  }
}
