import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateShippingCarrierInput,
  IShippingCarrierResponse,
  IListShippingCarrierQuery,
  IUpdateShippingCarrierInput,
} from "./types.js";

const selectShippingCarrier = {
  id: true,
  name: true,
  code: true,
  contactPerson: true,
  phone: true,
  email: true,
  isActive: true,
  supportsApi: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ShippingCarrierService {
  async create(dto: ICreateShippingCarrierInput): Promise<IShippingCarrierResponse> {
    const created = await prisma.shippingCarrier.create({
      data: dto as Prisma.ShippingCarrierUncheckedCreateInput,
      select: selectShippingCarrier,
    });
    return created as unknown as IShippingCarrierResponse;
  }

  async list(query: IListShippingCarrierQuery = {} as IListShippingCarrierQuery) {
    const where: Prisma.ShippingCarrierWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { name: { contains: query.q, mode: "insensitive" } },
      { code: { contains: query.q, mode: "insensitive" } },
      { contactPerson: { contains: query.q, mode: "insensitive" } },
      { phone: { contains: query.q, mode: "insensitive" } },
      { email: { contains: query.q, mode: "insensitive" } },
      { notes: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.shippingCarrier.findMany({
        where,
        select: selectShippingCarrier,
        orderBy: { [sortBy]: sortOrder } as Prisma.ShippingCarrierOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.shippingCarrier.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IShippingCarrierResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IShippingCarrierResponse> {
    const item = await prisma.shippingCarrier.findUnique({
      where: { id },
      select: selectShippingCarrier,
    });

    if (!item) {
      throw new NotFoundError("ShippingCarrier not found", "SHIPPINGCARRIER_NOT_FOUND");
    }

    return item as unknown as IShippingCarrierResponse;
  }

  async update(id: string, dto: IUpdateShippingCarrierInput): Promise<IShippingCarrierResponse> {
    const updated = await prisma.shippingCarrier.update({
      where: { id },
      data: dto as Prisma.ShippingCarrierUncheckedUpdateInput,
      select: selectShippingCarrier,
    });
    return updated as unknown as IShippingCarrierResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.shippingCarrier.delete({ where: { id } });
  }
}
