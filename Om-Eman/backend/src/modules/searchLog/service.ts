import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateSearchLogInput,
  ISearchLogResponse,
  IListSearchLogQuery,
  IUpdateSearchLogInput,
} from "./types.js";

const selectSearchLog = {
  id: true,
  rawQuery: true,
  normalizedQuery: true,
  resultCount: true,
  customerId: true,
  sessionId: true,
  clickedProductId: true,
  createdAt: true,
} as const;

export class SearchLogService {
  async create(dto: ICreateSearchLogInput): Promise<ISearchLogResponse> {
    const created = await prisma.searchLog.create({
      data: dto as Prisma.SearchLogUncheckedCreateInput,
      select: selectSearchLog,
    });
    return created as unknown as ISearchLogResponse;
  }

  async list(query: IListSearchLogQuery = {} as IListSearchLogQuery) {
    const where: Prisma.SearchLogWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { rawQuery: { contains: query.q, mode: "insensitive" } },
      { normalizedQuery: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { sessionId: { contains: query.q, mode: "insensitive" } },
      { clickedProductId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.searchLog.findMany({
        where,
        select: selectSearchLog,
        orderBy: { [sortBy]: sortOrder } as Prisma.SearchLogOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.searchLog.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ISearchLogResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ISearchLogResponse> {
    const item = await prisma.searchLog.findUnique({
      where: { id },
      select: selectSearchLog,
    });

    if (!item) {
      throw new NotFoundError("SearchLog not found", "SEARCHLOG_NOT_FOUND");
    }

    return item as unknown as ISearchLogResponse;
  }

  async update(id: string, dto: IUpdateSearchLogInput): Promise<ISearchLogResponse> {
    const updated = await prisma.searchLog.update({
      where: { id },
      data: dto as Prisma.SearchLogUncheckedUpdateInput,
      select: selectSearchLog,
    });
    return updated as unknown as ISearchLogResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.searchLog.delete({ where: { id } });
  }
}
