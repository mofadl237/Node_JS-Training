import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type { IAuditLogResponse, ICreateAuditLogInput } from "./type.js";
import type { IListAuditLogsQuery } from "./validation.js";

const auditLogSelect = {
  id: true,
  userId: true,
  action: true,
  entity: true,
  entityId: true,
  details: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} as const;

export class AuditLogService {
  async create(dto: ICreateAuditLogInput, actorUserId: string): Promise<IAuditLogResponse> {
    const userId = dto.userId === undefined ? actorUserId : dto.userId;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundError("User not found", "USER_NOT_FOUND");
      }
    }

    return prisma.auditLog.create({
      data: {
        action: dto.action.trim(),
        entity: dto.entity.trim(),
        entityId: dto.entityId?.trim() || null,
        userId,
        ...(dto.details !== undefined && dto.details !== null
          ? { details: dto.details }
          : {}),
      },
      select: auditLogSelect,
    });
  }

  async list(query: IListAuditLogsQuery) {
    const where: Prisma.AuditLogWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.action) {
      where.action = { equals: query.action, mode: "insensitive" };
    }

    if (query.entity) {
      where.entity = { equals: query.entity, mode: "insensitive" };
    }

    if (query.entityId) {
      where.entityId = query.entityId;
    }

    if (query.q) {
      where.OR = [
        { action: { contains: query.q, mode: "insensitive" } },
        { entity: { contains: query.q, mode: "insensitive" } },
        { entityId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [auditLogs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        select: auditLogSelect,
        orderBy: { [sortBy]: sortOrder },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return toPaginatedResult(
      auditLogs as IAuditLogResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IAuditLogResponse> {
    const auditLog = await prisma.auditLog.findUnique({
      where: { id },
      select: auditLogSelect,
    });

    if (!auditLog) {
      throw new NotFoundError("Audit log not found", "AUDIT_LOG_NOT_FOUND");
    }

    return auditLog;
  }

  async remove(id: string): Promise<void> {
    const existingAuditLog = await prisma.auditLog.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingAuditLog) {
      throw new NotFoundError("Audit log not found", "AUDIT_LOG_NOT_FOUND");
    }

    await prisma.auditLog.delete({ where: { id } });
  }
}
