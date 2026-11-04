import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  ICreateAuditLogInput,
  IAuditLogResponse,
  IListAuditLogQuery,
  IUpdateAuditLogInput,
} from "./types.js";

const selectAuditLog = {
  id: true,
  actorEmployeeId: true,
  actorCustomerId: true,
  action: true,
  module: true,
  entityType: true,
  entityId: true,
  result: true,
  reason: true,
  oldValues: true,
  newValues: true,
  ipAddress: true,
  userAgent: true,
  createdAt: true,
} as const;

export class AuditLogService {
  async create(dto: ICreateAuditLogInput): Promise<IAuditLogResponse> {
    const created = await prisma.auditLog.create({
      data: dto as Prisma.AuditLogUncheckedCreateInput,
      select: selectAuditLog,
    });
    return created as unknown as IAuditLogResponse;
  }

  async list(query: IListAuditLogQuery = {} as IListAuditLogQuery) {
    const where: Prisma.AuditLogWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { actorEmployeeId: { contains: query.q, mode: "insensitive" } },
      { actorCustomerId: { contains: query.q, mode: "insensitive" } },
      { action: { contains: query.q, mode: "insensitive" } },
      { module: { contains: query.q, mode: "insensitive" } },
      { entityType: { contains: query.q, mode: "insensitive" } },
      { entityId: { contains: query.q, mode: "insensitive" } },
      { reason: { contains: query.q, mode: "insensitive" } },
      { ipAddress: { contains: query.q, mode: "insensitive" } },
      { userAgent: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        select: selectAuditLog,
        orderBy: { [sortBy]: sortOrder } as Prisma.AuditLogOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IAuditLogResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IAuditLogResponse> {
    const item = await prisma.auditLog.findUnique({
      where: { id },
      select: selectAuditLog,
    });

    if (!item) {
      throw new NotFoundError("AuditLog not found", "AUDITLOG_NOT_FOUND");
    }

    return item as unknown as IAuditLogResponse;
  }

  async update(id: string, dto: IUpdateAuditLogInput): Promise<IAuditLogResponse> {
    throw new BadRequestError("AuditLog is append-only", "APPEND_ONLY");
  }

  async remove(id: string): Promise<void> {
    throw new BadRequestError("AuditLog is append-only", "APPEND_ONLY");
  }
}
