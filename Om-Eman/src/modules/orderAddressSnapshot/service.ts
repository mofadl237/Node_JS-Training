import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  ICreateOrderAddressSnapshotInput,
  IOrderAddressSnapshotResponse,
  IListOrderAddressSnapshotQuery,
  IUpdateOrderAddressSnapshotInput,
} from "./types.js";

const selectOrderAddressSnapshot = {
  id: true,
  orderId: true,
  recipientName: true,
  phone: true,
  governorate: true,
  city: true,
  district: true,
  street: true,
  building: true,
  floor: true,
  landmark: true,
  latitude: true,
  longitude: true,
  sourceAddressId: true,
  createdAt: true,
} as const;

export class OrderAddressSnapshotService {
  async create(dto: ICreateOrderAddressSnapshotInput): Promise<IOrderAddressSnapshotResponse> {
    const created = await prisma.orderAddressSnapshot.create({
      data: dto as Prisma.OrderAddressSnapshotUncheckedCreateInput,
      select: selectOrderAddressSnapshot,
    });
    return created as unknown as IOrderAddressSnapshotResponse;
  }

  async list(query: IListOrderAddressSnapshotQuery = {} as IListOrderAddressSnapshotQuery) {
    const where: Prisma.OrderAddressSnapshotWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { recipientName: { contains: query.q, mode: "insensitive" } },
      { phone: { contains: query.q, mode: "insensitive" } },
      { governorate: { contains: query.q, mode: "insensitive" } },
      { city: { contains: query.q, mode: "insensitive" } },
      { district: { contains: query.q, mode: "insensitive" } },
      { street: { contains: query.q, mode: "insensitive" } },
      { building: { contains: query.q, mode: "insensitive" } },
      { floor: { contains: query.q, mode: "insensitive" } },
      { landmark: { contains: query.q, mode: "insensitive" } },
      { sourceAddressId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.orderAddressSnapshot.findMany({
        where,
        select: selectOrderAddressSnapshot,
        orderBy: { [sortBy]: sortOrder } as Prisma.OrderAddressSnapshotOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.orderAddressSnapshot.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IOrderAddressSnapshotResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IOrderAddressSnapshotResponse> {
    const item = await prisma.orderAddressSnapshot.findUnique({
      where: { id },
      select: selectOrderAddressSnapshot,
    });

    if (!item) {
      throw new NotFoundError("OrderAddressSnapshot not found", "ORDERADDRESSSNAPSHOT_NOT_FOUND");
    }

    return item as unknown as IOrderAddressSnapshotResponse;
  }

  async update(id: string, dto: IUpdateOrderAddressSnapshotInput): Promise<IOrderAddressSnapshotResponse> {
    throw new BadRequestError("OrderAddressSnapshot is append-only", "APPEND_ONLY");
  }

  async remove(id: string): Promise<void> {
    throw new BadRequestError("OrderAddressSnapshot is append-only", "APPEND_ONLY");
  }
}
