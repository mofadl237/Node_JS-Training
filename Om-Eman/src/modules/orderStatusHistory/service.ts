import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  ICreateOrderStatusHistoryInput,
  IOrderStatusHistoryResponse,
  IListOrderStatusHistoryQuery,
  IUpdateOrderStatusHistoryInput,
} from "./types.js";

const selectOrderStatusHistory = {
  id: true,
  orderId: true,
  fromStatus: true,
  toStatus: true,
  changedByEmployeeId: true,
  notes: true,
  createdAt: true,
} as const;

export class OrderStatusHistoryService {
  async create(dto: ICreateOrderStatusHistoryInput): Promise<IOrderStatusHistoryResponse> {
    const created = await prisma.orderStatusHistory.create({
      data: dto as Prisma.OrderStatusHistoryUncheckedCreateInput,
      select: selectOrderStatusHistory,
    });
    return created as unknown as IOrderStatusHistoryResponse;
  }

  async list(query: IListOrderStatusHistoryQuery = {} as IListOrderStatusHistoryQuery) {
    const where: Prisma.OrderStatusHistoryWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { changedByEmployeeId: { contains: query.q, mode: "insensitive" } },
      { notes: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.orderStatusHistory.findMany({
        where,
        select: selectOrderStatusHistory,
        orderBy: { [sortBy]: sortOrder } as Prisma.OrderStatusHistoryOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.orderStatusHistory.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IOrderStatusHistoryResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IOrderStatusHistoryResponse> {
    const item = await prisma.orderStatusHistory.findUnique({
      where: { id },
      select: selectOrderStatusHistory,
    });

    if (!item) {
      throw new NotFoundError("OrderStatusHistory not found", "ORDERSTATUSHISTORY_NOT_FOUND");
    }

    return item as unknown as IOrderStatusHistoryResponse;
  }

  async update(id: string, dto: IUpdateOrderStatusHistoryInput): Promise<IOrderStatusHistoryResponse> {
    throw new BadRequestError("OrderStatusHistory is append-only", "APPEND_ONLY");
  }

  async remove(id: string): Promise<void> {
    throw new BadRequestError("OrderStatusHistory is append-only", "APPEND_ONLY");
  }
}
