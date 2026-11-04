import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateSearchSynonymInput,
  ISearchSynonymResponse,
  IListSearchSynonymQuery,
  IUpdateSearchSynonymInput,
} from "./types.js";

const selectSearchSynonym = {
  id: true,
  groupKey: true,
  term: true,
  normalizedTerm: true,
  language: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class SearchSynonymService {
  async create(dto: ICreateSearchSynonymInput): Promise<ISearchSynonymResponse> {
    const created = await prisma.searchSynonym.create({
      data: dto as Prisma.SearchSynonymUncheckedCreateInput,
      select: selectSearchSynonym,
    });
    return created as unknown as ISearchSynonymResponse;
  }

  async list(query: IListSearchSynonymQuery = {} as IListSearchSynonymQuery) {
    const where: Prisma.SearchSynonymWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { groupKey: { contains: query.q, mode: "insensitive" } },
      { term: { contains: query.q, mode: "insensitive" } },
      { normalizedTerm: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.searchSynonym.findMany({
        where,
        select: selectSearchSynonym,
        orderBy: { [sortBy]: sortOrder } as Prisma.SearchSynonymOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.searchSynonym.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ISearchSynonymResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ISearchSynonymResponse> {
    const item = await prisma.searchSynonym.findUnique({
      where: { id },
      select: selectSearchSynonym,
    });

    if (!item) {
      throw new NotFoundError("SearchSynonym not found", "SEARCHSYNONYM_NOT_FOUND");
    }

    return item as unknown as ISearchSynonymResponse;
  }

  async update(id: string, dto: IUpdateSearchSynonymInput): Promise<ISearchSynonymResponse> {
    const updated = await prisma.searchSynonym.update({
      where: { id },
      data: dto as Prisma.SearchSynonymUncheckedUpdateInput,
      select: selectSearchSynonym,
    });
    return updated as unknown as ISearchSynonymResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.searchSynonym.delete({ where: { id } });
  }
}
