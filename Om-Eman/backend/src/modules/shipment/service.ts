import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateShipmentInput,
  IShipmentResponse,
  IListShipmentQuery,
  IUpdateShipmentInput,
} from "./types.js";

const selectShipment = {
  id: true,
  shipmentNumber: true,
  orderId: true,
  carrierId: true,
  trackingNumber: true,
  status: true,
  expectedCost: true,
  actualCost: true,
  codAmount: true,
  codCollected: true,
  codSettledAt: true,
  codSettlementReference: true,
  shippedAt: true,
  deliveredAt: true,
  etaMinDays: true,
  etaMaxDays: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ShipmentService {
  async create(dto: ICreateShipmentInput): Promise<IShipmentResponse> {
    const created = await prisma.shipment.create({
      data: dto as Prisma.ShipmentUncheckedCreateInput,
      select: selectShipment,
    });
    return created as unknown as IShipmentResponse;
  }

  async list(query: IListShipmentQuery = {} as IListShipmentQuery) {
    const where: Prisma.ShipmentWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { shipmentNumber: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { carrierId: { contains: query.q, mode: "insensitive" } },
      { trackingNumber: { contains: query.q, mode: "insensitive" } },
      { codSettlementReference: { contains: query.q, mode: "insensitive" } },
      { notes: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.shipment.findMany({
        where,
        select: selectShipment,
        orderBy: { [sortBy]: sortOrder } as Prisma.ShipmentOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.shipment.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IShipmentResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IShipmentResponse> {
    const item = await prisma.shipment.findUnique({
      where: { id },
      select: selectShipment,
    });

    if (!item) {
      throw new NotFoundError("Shipment not found", "SHIPMENT_NOT_FOUND");
    }

    return item as unknown as IShipmentResponse;
  }

  async update(id: string, dto: IUpdateShipmentInput): Promise<IShipmentResponse> {
    const updated = await prisma.shipment.update({
      where: { id },
      data: dto as Prisma.ShipmentUncheckedUpdateInput,
      select: selectShipment,
    });
    return updated as unknown as IShipmentResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.shipment.delete({ where: { id } });
  }
}
