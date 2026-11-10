import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateNotificationInput,
  INotificationResponse,
  IListNotificationQuery,
  IUpdateNotificationInput,
} from "./types.js";

const selectNotification = {
  id: true,
  recipientType: true,
  customerId: true,
  employeeId: true,
  channel: true,
  notificationType: true,
  title: true,
  body: true,
  status: true,
  idempotencyKey: true,
  sentAt: true,
  readAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class NotificationService {
  async create(dto: ICreateNotificationInput): Promise<INotificationResponse> {
    const created = await prisma.notification.create({
      data: dto as Prisma.NotificationUncheckedCreateInput,
      select: selectNotification,
    });
    return created as unknown as INotificationResponse;
  }

  async list(query: IListNotificationQuery = {} as IListNotificationQuery) {
    const where: Prisma.NotificationWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { employeeId: { contains: query.q, mode: "insensitive" } },
      { title: { contains: query.q, mode: "insensitive" } },
      { body: { contains: query.q, mode: "insensitive" } },
      { idempotencyKey: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        select: selectNotification,
        orderBy: { [sortBy]: sortOrder } as Prisma.NotificationOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.notification.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as INotificationResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<INotificationResponse> {
    const item = await prisma.notification.findUnique({
      where: { id },
      select: selectNotification,
    });

    if (!item) {
      throw new NotFoundError("Notification not found", "NOTIFICATION_NOT_FOUND");
    }

    return item as unknown as INotificationResponse;
  }

  async update(id: string, dto: IUpdateNotificationInput): Promise<INotificationResponse> {
    const updated = await prisma.notification.update({
      where: { id },
      data: dto as Prisma.NotificationUncheckedUpdateInput,
      select: selectNotification,
    });
    return updated as unknown as INotificationResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.notification.delete({ where: { id } });
  }
}
