import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  ICreateShipmentStatusHistoryInput,
  IShipmentStatusHistoryResponse,
  IListShipmentStatusHistoryQuery,
  IUpdateShipmentStatusHistoryInput,
} from "./types.js";

const selectShipmentStatusHistory = {
  id: true,
  shipmentId: true,
  fromStatus: true,
  toStatus: true,
  changedByEmployeeId: true,
  notes: true,
  createdAt: true,
} as const;

export class ShipmentStatusHistoryService {
  async create(dto: ICreateShipmentStatusHistoryInput): Promise<IShipmentStatusHistoryResponse> {
    const created = await prisma.shipmentStatusHistory.create({
      data: dto as Prisma.ShipmentStatusHistoryUncheckedCreateInput,
      select: selectShipmentStatusHistory,
    });
    return created as unknown as IShipmentStatusHistoryResponse;
  }

  async list(query: IListShipmentStatusHistoryQuery = {} as IListShipmentStatusHistoryQuery) {
    const where: Prisma.ShipmentStatusHistoryWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { shipmentId: { contains: query.q, mode: "insensitive" } },
      { changedByEmployeeId: { contains: query.q, mode: "insensitive" } },
      { notes: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.shipmentStatusHistory.findMany({
        where,
        select: selectShipmentStatusHistory,
        orderBy: { [sortBy]: sortOrder } as Prisma.ShipmentStatusHistoryOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.shipmentStatusHistory.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IShipmentStatusHistoryResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IShipmentStatusHistoryResponse> {
    const item = await prisma.shipmentStatusHistory.findUnique({
      where: { id },
      select: selectShipmentStatusHistory,
    });

    if (!item) {
      throw new NotFoundError("ShipmentStatusHistory not found", "SHIPMENTSTATUSHISTORY_NOT_FOUND");
    }

    return item as unknown as IShipmentStatusHistoryResponse;
  }

  async update(id: string, dto: IUpdateShipmentStatusHistoryInput): Promise<IShipmentStatusHistoryResponse> {
    throw new BadRequestError("ShipmentStatusHistory is append-only", "APPEND_ONLY");
  }

  async remove(id: string): Promise<void> {
    throw new BadRequestError("ShipmentStatusHistory is append-only", "APPEND_ONLY");
  }
}
