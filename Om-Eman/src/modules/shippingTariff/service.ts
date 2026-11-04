import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateShippingTariffInput,
  IShippingTariffResponse,
  IListShippingTariffQuery,
  IUpdateShippingTariffInput,
} from "./types.js";

const selectShippingTariff = {
  id: true,
  carrierId: true,
  governorate: true,
  city: true,
  baseCost: true,
  etaMinDays: true,
  etaMaxDays: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ShippingTariffService {
  async create(dto: ICreateShippingTariffInput): Promise<IShippingTariffResponse> {
    const created = await prisma.shippingTariff.create({
      data: dto as Prisma.ShippingTariffUncheckedCreateInput,
      select: selectShippingTariff,
    });
    return created as unknown as IShippingTariffResponse;
  }

  async list(query: IListShippingTariffQuery = {} as IListShippingTariffQuery) {
    const where: Prisma.ShippingTariffWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { carrierId: { contains: query.q, mode: "insensitive" } },
      { governorate: { contains: query.q, mode: "insensitive" } },
      { city: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.shippingTariff.findMany({
        where,
        select: selectShippingTariff,
        orderBy: { [sortBy]: sortOrder } as Prisma.ShippingTariffOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.shippingTariff.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IShippingTariffResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IShippingTariffResponse> {
    const item = await prisma.shippingTariff.findUnique({
      where: { id },
      select: selectShippingTariff,
    });

    if (!item) {
      throw new NotFoundError("ShippingTariff not found", "SHIPPINGTARIFF_NOT_FOUND");
    }

    return item as unknown as IShippingTariffResponse;
  }

  async update(id: string, dto: IUpdateShippingTariffInput): Promise<IShippingTariffResponse> {
    const updated = await prisma.shippingTariff.update({
      where: { id },
      data: dto as Prisma.ShippingTariffUncheckedUpdateInput,
      select: selectShippingTariff,
    });
    return updated as unknown as IShippingTariffResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.shippingTariff.delete({ where: { id } });
  }
}
