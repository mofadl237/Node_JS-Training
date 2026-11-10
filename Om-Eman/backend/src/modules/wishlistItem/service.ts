import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateWishlistItemInput,
  IWishlistItemResponse,
  IListWishlistItemQuery,
  IUpdateWishlistItemInput,
} from "./types.js";

const selectWishlistItem = {
  id: true,
  customerId: true,
  productPackageId: true,
  createdAt: true,
} as const;

export class WishlistItemService {
  async create(dto: ICreateWishlistItemInput): Promise<IWishlistItemResponse> {
    const created = await prisma.wishlistItem.create({
      data: dto as Prisma.WishlistItemUncheckedCreateInput,
      select: selectWishlistItem,
    });
    return created as unknown as IWishlistItemResponse;
  }

  async list(query: IListWishlistItemQuery = {} as IListWishlistItemQuery) {
    const where: Prisma.WishlistItemWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { productPackageId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.wishlistItem.findMany({
        where,
        select: selectWishlistItem,
        orderBy: { [sortBy]: sortOrder } as Prisma.WishlistItemOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.wishlistItem.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IWishlistItemResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IWishlistItemResponse> {
    const item = await prisma.wishlistItem.findUnique({
      where: { id },
      select: selectWishlistItem,
    });

    if (!item) {
      throw new NotFoundError("WishlistItem not found", "WISHLISTITEM_NOT_FOUND");
    }

    return item as unknown as IWishlistItemResponse;
  }

  async update(id: string, dto: IUpdateWishlistItemInput): Promise<IWishlistItemResponse> {
    const updated = await prisma.wishlistItem.update({
      where: { id },
      data: dto as Prisma.WishlistItemUncheckedUpdateInput,
      select: selectWishlistItem,
    });
    return updated as unknown as IWishlistItemResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.wishlistItem.delete({ where: { id } });
  }
}
