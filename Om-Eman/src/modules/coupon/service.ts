import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateCouponInput,
  ICouponResponse,
  IListCouponQuery,
  IUpdateCouponInput,
} from "./types.js";

const selectCoupon = {
  id: true,
  promotionId: true,
  code: true,
  customerId: true,
  usageLimit: true,
  perCustomerLimit: true,
  startsAt: true,
  endsAt: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class CouponService {
  async create(dto: ICreateCouponInput): Promise<ICouponResponse> {
    const created = await prisma.coupon.create({
      data: dto as Prisma.CouponUncheckedCreateInput,
      select: selectCoupon,
    });
    return created as unknown as ICouponResponse;
  }

  async list(query: IListCouponQuery = {} as IListCouponQuery) {
    const where: Prisma.CouponWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { promotionId: { contains: query.q, mode: "insensitive" } },
      { code: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.coupon.findMany({
        where,
        select: selectCoupon,
        orderBy: { [sortBy]: sortOrder } as Prisma.CouponOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.coupon.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ICouponResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ICouponResponse> {
    const item = await prisma.coupon.findUnique({
      where: { id },
      select: selectCoupon,
    });

    if (!item) {
      throw new NotFoundError("Coupon not found", "COUPON_NOT_FOUND");
    }

    return item as unknown as ICouponResponse;
  }

  async update(id: string, dto: IUpdateCouponInput): Promise<ICouponResponse> {
    const updated = await prisma.coupon.update({
      where: { id },
      data: dto as Prisma.CouponUncheckedUpdateInput,
      select: selectCoupon,
    });
    return updated as unknown as ICouponResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.coupon.delete({ where: { id } });
  }
}
