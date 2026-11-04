import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreatePromotionTargetInput,
  IPromotionTargetResponse,
  IListPromotionTargetQuery,
  IUpdatePromotionTargetInput,
} from "./types.js";

const selectPromotionTarget = {
  id: true,
  promotionId: true,
  scope: true,
  productId: true,
  productPackageId: true,
  categoryId: true,
  subcategoryId: true,
  createdAt: true,
} as const;

export class PromotionTargetService {
  async create(dto: ICreatePromotionTargetInput): Promise<IPromotionTargetResponse> {
    const created = await prisma.promotionTarget.create({
      data: dto as Prisma.PromotionTargetUncheckedCreateInput,
      select: selectPromotionTarget,
    });
    return created as unknown as IPromotionTargetResponse;
  }

  async list(query: IListPromotionTargetQuery = {} as IListPromotionTargetQuery) {
    const where: Prisma.PromotionTargetWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { promotionId: { contains: query.q, mode: "insensitive" } },
      { productId: { contains: query.q, mode: "insensitive" } },
      { productPackageId: { contains: query.q, mode: "insensitive" } },
      { categoryId: { contains: query.q, mode: "insensitive" } },
      { subcategoryId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.promotionTarget.findMany({
        where,
        select: selectPromotionTarget,
        orderBy: { [sortBy]: sortOrder } as Prisma.PromotionTargetOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.promotionTarget.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IPromotionTargetResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IPromotionTargetResponse> {
    const item = await prisma.promotionTarget.findUnique({
      where: { id },
      select: selectPromotionTarget,
    });

    if (!item) {
      throw new NotFoundError("PromotionTarget not found", "PROMOTIONTARGET_NOT_FOUND");
    }

    return item as unknown as IPromotionTargetResponse;
  }

  async update(id: string, dto: IUpdatePromotionTargetInput): Promise<IPromotionTargetResponse> {
    const updated = await prisma.promotionTarget.update({
      where: { id },
      data: dto as Prisma.PromotionTargetUncheckedUpdateInput,
      select: selectPromotionTarget,
    });
    return updated as unknown as IPromotionTargetResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.promotionTarget.delete({ where: { id } });
  }
}
