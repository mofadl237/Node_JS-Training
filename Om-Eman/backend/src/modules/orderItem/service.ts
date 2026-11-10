import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateOrderItemInput,
  IOrderItemResponse,
  IListOrderItemQuery,
  IUpdateOrderItemInput,
} from "./types.js";

const selectOrderItem = {
  id: true,
  orderId: true,
  productId: true,
  productPackageId: true,
  productNameArSnapshot: true,
  productNameEnSnapshot: true,
  packageNameArSnapshot: true,
  packageNameEnSnapshot: true,
  skuSnapshot: true,
  quantity: true,
  unitPrice: true,
  discountAmount: true,
  taxRateSnapshot: true,
  taxAmount: true,
  lineTotal: true,
  bundleSnapshot: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class OrderItemService {
  async create(dto: ICreateOrderItemInput): Promise<IOrderItemResponse> {
    const created = await prisma.orderItem.create({
      data: dto as Prisma.OrderItemUncheckedCreateInput,
      select: selectOrderItem,
    });
    return created as unknown as IOrderItemResponse;
  }

  async list(query: IListOrderItemQuery = {} as IListOrderItemQuery) {
    const where: Prisma.OrderItemWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { productId: { contains: query.q, mode: "insensitive" } },
      { productPackageId: { contains: query.q, mode: "insensitive" } },
      { productNameArSnapshot: { contains: query.q, mode: "insensitive" } },
      { productNameEnSnapshot: { contains: query.q, mode: "insensitive" } },
      { packageNameArSnapshot: { contains: query.q, mode: "insensitive" } },
      { packageNameEnSnapshot: { contains: query.q, mode: "insensitive" } },
      { skuSnapshot: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.orderItem.findMany({
        where,
        select: selectOrderItem,
        orderBy: { [sortBy]: sortOrder } as Prisma.OrderItemOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.orderItem.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IOrderItemResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IOrderItemResponse> {
    const item = await prisma.orderItem.findUnique({
      where: { id },
      select: selectOrderItem,
    });

    if (!item) {
      throw new NotFoundError("OrderItem not found", "ORDERITEM_NOT_FOUND");
    }

    return item as unknown as IOrderItemResponse;
  }

  async update(id: string, dto: IUpdateOrderItemInput): Promise<IOrderItemResponse> {
    const updated = await prisma.orderItem.update({
      where: { id },
      data: dto as Prisma.OrderItemUncheckedUpdateInput,
      select: selectOrderItem,
    });
    return updated as unknown as IOrderItemResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.orderItem.delete({ where: { id } });
  }
}
