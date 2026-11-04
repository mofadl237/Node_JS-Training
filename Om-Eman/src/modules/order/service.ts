import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateOrderInput,
  IOrderResponse,
  IListOrderQuery,
  IUpdateOrderInput,
} from "./types.js";

const selectOrder = {
  id: true,
  orderNumber: true,
  customerId: true,
  status: true,
  paymentStatus: true,
  placedAt: true,
  confirmedAt: true,
  preparedAt: true,
  shippedAt: true,
  deliveredAt: true,
  canceledAt: true,
  cancelReason: true,
  subtotal: true,
  discountTotal: true,
  shippingTotal: true,
  taxTotal: true,
  grandTotal: true,
  customerNotes: true,
  internalNotes: true,
  fbp: true,
  fbc: true,
  clientIp: true,
  clientUserAgent: true,
  eventSourceUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class OrderService {
  async create(dto: ICreateOrderInput): Promise<IOrderResponse> {
    const created = await prisma.order.create({
      data: dto as Prisma.OrderUncheckedCreateInput,
      select: selectOrder,
    });
    return created as unknown as IOrderResponse;
  }

  async list(query: IListOrderQuery = {} as IListOrderQuery) {
    const where: Prisma.OrderWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { orderNumber: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { cancelReason: { contains: query.q, mode: "insensitive" } },
      { customerNotes: { contains: query.q, mode: "insensitive" } },
      { internalNotes: { contains: query.q, mode: "insensitive" } },
      { fbp: { contains: query.q, mode: "insensitive" } },
      { fbc: { contains: query.q, mode: "insensitive" } },
      { clientIp: { contains: query.q, mode: "insensitive" } },
      { clientUserAgent: { contains: query.q, mode: "insensitive" } },
      { eventSourceUrl: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        select: selectOrder,
        orderBy: { [sortBy]: sortOrder } as Prisma.OrderOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.order.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IOrderResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IOrderResponse> {
    const item = await prisma.order.findUnique({
      where: { id },
      select: selectOrder,
    });

    if (!item) {
      throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
    }

    return item as unknown as IOrderResponse;
  }

  async update(id: string, dto: IUpdateOrderInput): Promise<IOrderResponse> {
    const updated = await prisma.order.update({
      where: { id },
      data: dto as Prisma.OrderUncheckedUpdateInput,
      select: selectOrder,
    });
    return updated as unknown as IOrderResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.order.delete({ where: { id } });
  }
}
