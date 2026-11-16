import { ECartStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import { BadRequestError, NotFoundError } from "../../../shared/errors.js";
import { mergeGuestCart } from "../../../services/customer-claim.service.js";
import type { ICartLine, IStoreCart } from "./types.js";

const GUEST_TOKEN_SOURCE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";

// Guests receive a random opaque cart token. It identifies the cart only; it
// grants no access to any other customer's data.
export function generateGuestToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => GUEST_TOKEN_SOURCE[byte % 64]).join("");
}

function computeSubtotal(lines: ICartLine[]): string {
  return lines
    .reduce(
      (sum, line) =>
        sum + Number(line.package?.sellingPrice ?? 0) * Number(line.quantity),
      0,
    )
    .toFixed(4);
}

async function loadCart(cartId: string): Promise<IStoreCart> {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    select: {
      id: true,
      guestToken: true,
      status: true,
      items: {
        select: {
          id: true,
          quantity: true,
          priceAtAdd: true,
          productPackageId: true,
        },
      },
    },
  });

  if (!cart) {
    throw new NotFoundError("Cart not found", "CART_NOT_FOUND");
  }

  const packageIds = cart.items.map((item) => item.productPackageId);
  const packages = await prisma.productPackage.findMany({
    where: { id: { in: packageIds } },
    select: {
      id: true,
      sku: true,
      nameAr: true,
      sellingPrice: true,
      compareAtPrice: true,
      sizeValue: true,
      sizeUnit: true,
      stockStatus: true,
      isActive: true,
      isPublished: true,
      product: {
        select: {
          id: true,
          slug: true,
          nameAr: true,
          nameEn: true,
          images: {
            select: { url: true },
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
            take: 1,
          },
        },
      },
    },
  });
  const packagesById = new Map(packages.map((pkg) => [pkg.id, pkg]));

  const lines: ICartLine[] = cart.items.map((item) => {
    const pkg = packagesById.get(item.productPackageId);
    return {
      id: item.id,
      quantity: item.quantity.toString(),
      priceAtAdd: item.priceAtAdd ? item.priceAtAdd.toString() : null,
      package: pkg
        ? {
            id: pkg.id,
            sku: pkg.sku,
            sellingPrice: pkg.sellingPrice.toString(),
            isAvailable:
              pkg.isActive &&
              pkg.isPublished &&
              pkg.stockStatus === "IN_STOCK",
            nameAr: pkg.nameAr,
            productId: pkg.product.id,
            productSlug: pkg.product.slug,
            productNameAr: pkg.product.nameAr,
            productNameEn: pkg.product.nameEn,
            imageUrl: pkg.product.images[0]?.url ?? null,
            sizeValue: pkg.sizeValue.toString(),
            sizeUnit: pkg.sizeUnit,
            compareAtPrice:
              pkg.compareAtPrice !== null ? pkg.compareAtPrice.toString() : null,
            stockStatus: pkg.stockStatus,
          }
        : null,
    };
  });

  return {
    id: cart.id,
    guestToken: cart.guestToken ?? "",
    status: cart.status,
    itemsCount: lines.reduce((sum, line) => sum + Number(line.quantity), 0),
    lines,
    subtotal: computeSubtotal(lines),
  };
}

async function requireActiveCartByToken(guestToken: string): Promise<string> {
  const cart = await prisma.cart.findUnique({
    where: { guestToken },
    select: { id: true, status: true },
  });

  if (!cart) {
    throw new NotFoundError("Cart not found", "CART_NOT_FOUND");
  }
  if (cart.status !== ECartStatus.ACTIVE) {
    throw new BadRequestError(
      "Cart is no longer active",
      "CART_NOT_ACTIVE",
    );
  }
  return cart.id;
}

export class StoreCartService {
  // Get-or-create: the same guestToken always maps to the same cart.
  async getOrCreate(guestToken: string | undefined): Promise<IStoreCart> {
    if (guestToken) {
      const existing = await prisma.cart.findUnique({
        where: { guestToken },
        select: { id: true, status: true },
      });
      if (existing) {
        if (existing.status !== ECartStatus.ACTIVE) {
          throw new BadRequestError("Cart is no longer active", "CART_NOT_ACTIVE");
        }
        return loadCart(existing.id);
      }
    }

    const token = guestToken ?? generateGuestToken();
    const created = await prisma.cart.create({
      data: { guestToken: token, status: ECartStatus.ACTIVE },
      select: { id: true },
    });
    return loadCart(created.id);
  }

  async get(guestToken: string): Promise<IStoreCart> {
    const cartId = await requireActiveCartByToken(guestToken);
    return loadCart(cartId);
  }

  async addItem(
    guestToken: string,
    productPackageId: string,
    quantity: number,
  ): Promise<IStoreCart> {
    const cartId = await requireActiveCartByToken(guestToken);

    const pkg = await prisma.productPackage.findUnique({
      where: { id: productPackageId },
      select: { isActive: true, isPublished: true },
    });
    if (!pkg || !pkg.isActive || !pkg.isPublished) {
      throw new BadRequestError(
        "Package is not available for sale",
        "PACKAGE_NOT_SALEABLE",
      );
    }

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productPackageId: { cartId, productPackageId } },
      select: { id: true, quantity: true },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity.add(quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId, productPackageId, quantity },
      });
    }

    return loadCart(cartId);
  }

  async updateItem(
    guestToken: string,
    itemId: string,
    quantity: number,
  ): Promise<IStoreCart> {
    const cartId = await requireActiveCartByToken(guestToken);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
      select: { id: true },
    });
    if (!item) {
      throw new NotFoundError("Cart item not found", "CART_ITEM_NOT_FOUND");
    }
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
    return loadCart(cartId);
  }

  async removeItem(guestToken: string, itemId: string): Promise<IStoreCart> {
    const cartId = await requireActiveCartByToken(guestToken);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
      select: { id: true },
    });
    if (!item) {
      throw new NotFoundError("Cart item not found", "CART_ITEM_NOT_FOUND");
    }
    await prisma.cartItem.delete({ where: { id: item.id } });
    return loadCart(cartId);
  }

  // Logged-in customer absorbs the guest cart after login. Delegates to the
  // business service; the guest cart ends MERGED with mergedIntoCartId set.
  async merge(customerId: string, guestToken: string): Promise<{ mergedCartId: string | null }> {
    return mergeGuestCart(customerId, guestToken);
  }
}
