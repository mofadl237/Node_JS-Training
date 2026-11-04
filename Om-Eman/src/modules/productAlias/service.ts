import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateProductAliasInput,
  IProductAliasResponse,
  IListProductAliasQuery,
  IUpdateProductAliasInput,
} from "./types.js";

const selectProductAlias = {
  id: true,
  productId: true,
  alias: true,
  language: true,
  normalizedAlias: true,
  weight: true,
  isSearchable: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ProductAliasService {
  async create(dto: ICreateProductAliasInput): Promise<IProductAliasResponse> {
    const created = await prisma.productAlias.create({
      data: dto as Prisma.ProductAliasUncheckedCreateInput,
      select: selectProductAlias,
    });
    return created as unknown as IProductAliasResponse;
  }

  async list(query: IListProductAliasQuery = {} as IListProductAliasQuery) {
    const where: Prisma.ProductAliasWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { productId: { contains: query.q, mode: "insensitive" } },
      { alias: { contains: query.q, mode: "insensitive" } },
      { normalizedAlias: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.productAlias.findMany({
        where,
        select: selectProductAlias,
        orderBy: { [sortBy]: sortOrder } as Prisma.ProductAliasOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.productAlias.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IProductAliasResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IProductAliasResponse> {
    const item = await prisma.productAlias.findUnique({
      where: { id },
      select: selectProductAlias,
    });

    if (!item) {
      throw new NotFoundError("ProductAlias not found", "PRODUCTALIAS_NOT_FOUND");
    }

    return item as unknown as IProductAliasResponse;
  }

  async update(id: string, dto: IUpdateProductAliasInput): Promise<IProductAliasResponse> {
    const updated = await prisma.productAlias.update({
      where: { id },
      data: dto as Prisma.ProductAliasUncheckedUpdateInput,
      select: selectProductAlias,
    });
    return updated as unknown as IProductAliasResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.productAlias.delete({ where: { id } });
  }
}
