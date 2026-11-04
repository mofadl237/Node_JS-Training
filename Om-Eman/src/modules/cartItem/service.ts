import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateCartItemInput,
  ICartItemResponse,
  IListCartItemQuery,
  IUpdateCartItemInput,
} from "./types.js";

const selectCartItem = {
  id: true,
  cartId: true,
  productPackageId: true,
  quantity: true,
  priceAtAdd: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class CartItemService {
  async create(dto: ICreateCartItemInput): Promise<ICartItemResponse> {
    const created = await prisma.cartItem.create({
      data: dto as Prisma.CartItemUncheckedCreateInput,
      select: selectCartItem,
    });
    return created as unknown as ICartItemResponse;
  }

  async list(query: IListCartItemQuery = {} as IListCartItemQuery) {
    const where: Prisma.CartItemWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { cartId: { contains: query.q, mode: "insensitive" } },
      { productPackageId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.cartItem.findMany({
        where,
        select: selectCartItem,
        orderBy: { [sortBy]: sortOrder } as Prisma.CartItemOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.cartItem.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ICartItemResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ICartItemResponse> {
    const item = await prisma.cartItem.findUnique({
      where: { id },
      select: selectCartItem,
    });

    if (!item) {
      throw new NotFoundError("CartItem not found", "CARTITEM_NOT_FOUND");
    }

    return item as unknown as ICartItemResponse;
  }

  async update(id: string, dto: IUpdateCartItemInput): Promise<ICartItemResponse> {
    const updated = await prisma.cartItem.update({
      where: { id },
      data: dto as Prisma.CartItemUncheckedUpdateInput,
      select: selectCartItem,
    });
    return updated as unknown as ICartItemResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.cartItem.delete({ where: { id } });
  }
}
