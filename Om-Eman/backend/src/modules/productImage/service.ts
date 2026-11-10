import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateProductImageInput,
  IProductImageResponse,
  IListProductImageQuery,
  IUpdateProductImageInput,
} from "./types.js";

const selectProductImage = {
  id: true,
  productId: true,
  url: true,
  altAr: true,
  altEn: true,
  sortOrder: true,
  isPrimary: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ProductImageService {
  async create(dto: ICreateProductImageInput): Promise<IProductImageResponse> {
    const created = await prisma.productImage.create({
      data: dto as Prisma.ProductImageUncheckedCreateInput,
      select: selectProductImage,
    });
    return created as unknown as IProductImageResponse;
  }

  async list(query: IListProductImageQuery = {} as IListProductImageQuery) {
    const where: Prisma.ProductImageWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { productId: { contains: query.q, mode: "insensitive" } },
      { url: { contains: query.q, mode: "insensitive" } },
      { altAr: { contains: query.q, mode: "insensitive" } },
      { altEn: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.productImage.findMany({
        where,
        select: selectProductImage,
        orderBy: { [sortBy]: sortOrder } as Prisma.ProductImageOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.productImage.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IProductImageResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IProductImageResponse> {
    const item = await prisma.productImage.findUnique({
      where: { id },
      select: selectProductImage,
    });

    if (!item) {
      throw new NotFoundError("ProductImage not found", "PRODUCTIMAGE_NOT_FOUND");
    }

    return item as unknown as IProductImageResponse;
  }

  async update(id: string, dto: IUpdateProductImageInput): Promise<IProductImageResponse> {
    const updated = await prisma.productImage.update({
      where: { id },
      data: dto as Prisma.ProductImageUncheckedUpdateInput,
      select: selectProductImage,
    });
    return updated as unknown as IProductImageResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.productImage.delete({ where: { id } });
  }
}
