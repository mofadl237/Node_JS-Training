import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateMarketingEventInput,
  IMarketingEventResponse,
  IListMarketingEventQuery,
  IUpdateMarketingEventInput,
} from "./types.js";

const selectMarketingEvent = {
  id: true,
  eventName: true,
  eventId: true,
  customerId: true,
  sessionId: true,
  orderId: true,
  productId: true,
  productPackageId: true,
  value: true,
  contentIds: true,
  searchString: true,
  fbp: true,
  fbc: true,
  clientIp: true,
  clientUserAgent: true,
  eventSourceUrl: true,
  hashedUserData: true,
  status: true,
  attempts: true,
  lastError: true,
  sentAt: true,
  occurredAt: true,
  createdAt: true,
} as const;

export class MarketingEventService {
  async create(dto: ICreateMarketingEventInput): Promise<IMarketingEventResponse> {
    const created = await prisma.marketingEvent.create({
      data: dto as Prisma.MarketingEventUncheckedCreateInput,
      select: selectMarketingEvent,
    });
    return created as unknown as IMarketingEventResponse;
  }

  async list(query: IListMarketingEventQuery = {} as IListMarketingEventQuery) {
    const where: Prisma.MarketingEventWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { eventId: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { sessionId: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { productId: { contains: query.q, mode: "insensitive" } },
      { productPackageId: { contains: query.q, mode: "insensitive" } },
      { searchString: { contains: query.q, mode: "insensitive" } },
      { fbp: { contains: query.q, mode: "insensitive" } },
      { fbc: { contains: query.q, mode: "insensitive" } },
      { clientIp: { contains: query.q, mode: "insensitive" } },
      { clientUserAgent: { contains: query.q, mode: "insensitive" } },
      { eventSourceUrl: { contains: query.q, mode: "insensitive" } },
      { lastError: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.marketingEvent.findMany({
        where,
        select: selectMarketingEvent,
        orderBy: { [sortBy]: sortOrder } as Prisma.MarketingEventOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.marketingEvent.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IMarketingEventResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IMarketingEventResponse> {
    const item = await prisma.marketingEvent.findUnique({
      where: { id },
      select: selectMarketingEvent,
    });

    if (!item) {
      throw new NotFoundError("MarketingEvent not found", "MARKETINGEVENT_NOT_FOUND");
    }

    return item as unknown as IMarketingEventResponse;
  }

  async update(id: string, dto: IUpdateMarketingEventInput): Promise<IMarketingEventResponse> {
    const updated = await prisma.marketingEvent.update({
      where: { id },
      data: dto as Prisma.MarketingEventUncheckedUpdateInput,
      select: selectMarketingEvent,
    });
    return updated as unknown as IMarketingEventResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.marketingEvent.delete({ where: { id } });
  }
}
