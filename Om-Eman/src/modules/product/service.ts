import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateProductInput,
  IProductResponse,
  IListProductQuery,
  IUpdateProductInput,
} from "./types.js";

const selectProduct = {
  id: true,
  primarySubcategoryId: true,
  nameAr: true,
  nameEn: true,
  slug: true,
  descriptionAr: true,
  descriptionEn: true,
  productType: true,
  status: true,
  brand: true,
  searchNameArNormalized: true,
  searchNameEnNormalized: true,
  searchKeywords: true,
  searchText: true,
  isFeatured: true,
  publishedAt: true,
  archivedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ProductService {
  async create(dto: ICreateProductInput): Promise<IProductResponse> {
    const created = await prisma.product.create({
      data: dto as Prisma.ProductUncheckedCreateInput,
      select: selectProduct,
    });
    return created as unknown as IProductResponse;
  }

  async list(query: IListProductQuery = {} as IListProductQuery) {
    const where: Prisma.ProductWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { primarySubcategoryId: { contains: query.q, mode: "insensitive" } },
      { nameAr: { contains: query.q, mode: "insensitive" } },
      { nameEn: { contains: query.q, mode: "insensitive" } },
      { slug: { contains: query.q, mode: "insensitive" } },
      { descriptionAr: { contains: query.q, mode: "insensitive" } },
      { descriptionEn: { contains: query.q, mode: "insensitive" } },
      { brand: { contains: query.q, mode: "insensitive" } },
      { searchNameArNormalized: { contains: query.q, mode: "insensitive" } },
      { searchNameEnNormalized: { contains: query.q, mode: "insensitive" } },
      { searchKeywords: { contains: query.q, mode: "insensitive" } },
      { searchText: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        select: selectProduct,
        orderBy: { [sortBy]: sortOrder } as Prisma.ProductOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.product.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IProductResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IProductResponse> {
    const item = await prisma.product.findUnique({
      where: { id },
      select: selectProduct,
    });

    if (!item) {
      throw new NotFoundError("Product not found", "PRODUCT_NOT_FOUND");
    }

    return item as unknown as IProductResponse;
  }

  async update(id: string, dto: IUpdateProductInput): Promise<IProductResponse> {
    const updated = await prisma.product.update({
      where: { id },
      data: dto as Prisma.ProductUncheckedUpdateInput,
      select: selectProduct,
    });
    return updated as unknown as IProductResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
