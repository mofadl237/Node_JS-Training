/**
 * Order services.
 *
 * Order creation is the heart of the restaurant flow:
 * 1. validate user, products, stock;
 * 2. find the best active PERCENTAGE offer per product;
 * 3. find the best applicable BUNDLE offer (all bundle products present with
 *    the required quantities);
 * 4. compute line totals and discounts with Prisma.Decimal;
 * 5. decrement stock atomically (`updateMany ... stock >= qty`) so concurrent
 *    requests cannot oversell;
 * 6. persist order + items + applied offers in one transaction.
 *
 * Cancelling an order restores stock. Orders are never deleted (audit trail).
 */
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { Product } from "../generated/prisma/client.js";
import { invalidateProductCache } from "../shared/cache.js";
import { ConflictError, NotFoundError, ValidationError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import { logger } from "../shared/logger.js";
import { activeOfferDateWhere, applyPercentage, roundMoney } from "../shared/offer-pricing.js";
import type {
  CreateOrderInput,
  GetOrdersOptions,
  GetOrdersResult,
  OrderDto,
  OrderStatusValue,
  UpdateOrderStatusInput,
} from "../interfaces/order.interfaces.js";

const orderInclude = {
  user: true,
  items: { include: { product: true } },
  orderOffers: { include: { offer: true } },
} satisfies Prisma.OrderInclude;

type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

const ALLOWED_TRANSITIONS: Record<OrderStatusValue, readonly OrderStatusValue[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function toOrderDto(order: OrderWithRelations): OrderDto {
  return {
    id: order.id.toString(),
    userId: order.userId.toString(),
    status: order.status,
    subtotal: order.subtotal.toNumber(),
    discountAmount: order.discountAmount.toNumber(),
    totalAmount: order.totalAmount.toNumber(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    user: {
      id: order.user.id.toString(),
      name: order.user.name,
      email: order.user.email,
    },
    items: order.items.map((item) => ({
      id: item.id.toString(),
      productId: item.productId.toString(),
      quantity: item.quantity,
      originalUnitPrice: item.originalUnitPrice.toNumber(),
      unitPrice: item.unitPrice.toNumber(),
      discountAmount: item.discountAmount.toNumber(),
      lineTotal: roundMoney(item.unitPrice.mul(item.quantity)).toNumber(),
      product: {
        id: item.product.id.toString(),
        name: item.product.name,
      },
    })),
    appliedOffers: order.orderOffers.map((orderOffer) => ({
      id: orderOffer.id.toString(),
      offerId: orderOffer.offerId.toString(),
      title: orderOffer.offer.title,
      type: orderOffer.offer.type,
      discountAmount: orderOffer.discountAmount.toNumber(),
    })),
  };
}

export function buildOrdersWhere(options: GetOrdersOptions): Prisma.OrderWhereInput {
  const conditions: Prisma.OrderWhereInput[] = [];

  if (options.userId !== undefined) {
    conditions.push({ userId: options.userId });
  }
  if (options.status !== undefined) {
    conditions.push({ status: options.status });
  }
  if (options.createdFrom !== undefined || options.createdTo !== undefined) {
    conditions.push({
      createdAt: {
        ...(options.createdFrom !== undefined ? { gte: options.createdFrom } : {}),
        ...(options.createdTo !== undefined ? { lte: options.createdTo } : {}),
      },
    });
  }
  if (options.minTotal !== undefined || options.maxTotal !== undefined) {
    conditions.push({
      totalAmount: {
        ...(options.minTotal !== undefined ? { gte: options.minTotal } : {}),
        ...(options.maxTotal !== undefined ? { lte: options.maxTotal } : {}),
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

export async function getOrdersService(options: GetOrdersOptions): Promise<GetOrdersResult> {
  const where = buildOrdersWhere(options);
  const skip = (options.page - 1) * options.limit;

  const orderBy: Prisma.OrderOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  const result = await runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () =>
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: options.limit,
        include: orderInclude,
      }),
    fetchTotal: () => prisma.order.count({ where }),
  });

  return { data: result.data.map(toOrderDto), pagination: result.pagination };
}

export async function getOrderByIdService(id: bigint): Promise<OrderDto> {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  if (!order) {
    throw new NotFoundError(`Order with id ${id} not found`);
  }
  return toOrderDto(order);
}

export async function createOrderService(input: CreateOrderInput): Promise<OrderDto> {
  const now = new Date();
  const productIds = input.items.map((item) => item.productId);

  const order = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: input.userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${input.userId} not found`);
    }

    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map<string, Product>(
      products.map((product) => [product.id.toString(), product]),
    );

    for (const item of input.items) {
      const product = productMap.get(item.productId.toString());
      if (!product) {
        throw new NotFoundError(`Product with id ${item.productId} not found`);
      }
      if (!product.isActive) {
        throw new ValidationError(`Product "${product.name}" is not available`);
      }
      if (product.stock < item.quantity) {
        throw new ConflictError(
          `Insufficient stock for "${product.name}" (requested ${item.quantity}, available ${product.stock})`,
        );
      }
    }

    // Best active percentage offer per product (highest discount wins).
    const percentageOffers = await tx.offer.findMany({
      where: {
        type: "PERCENTAGE",
        isActive: true,
        productId: { in: productIds },
        ...activeOfferDateWhere(now),
      },
      orderBy: { discountPercent: "desc" },
    });

    const bestPercentage = new Map<
      string,
      { id: bigint; discountPercent: Prisma.Decimal }
    >();
    for (const offer of percentageOffers) {
      if (offer.productId === null || offer.discountPercent === null) continue;
      const key = offer.productId.toString();
      if (!bestPercentage.has(key)) {
        bestPercentage.set(key, {
          id: offer.id,
          discountPercent: offer.discountPercent,
        });
      }
    }

    // Bundle offers that touch at least one ordered product.
    const bundleCandidates = await tx.offer.findMany({
      where: {
        type: "BUNDLE",
        isActive: true,
        items: { some: { productId: { in: productIds } } },
        ...activeOfferDateWhere(now),
      },
      include: { items: { include: { product: true } } },
    });

    const quantities = new Map<string, number>();
    for (const item of input.items) {
      quantities.set(item.productId.toString(), item.quantity);
    }

    // Only the best applicable bundle is applied (stacking bundles would make
    // totals unpredictable for customers). The discount can never exceed the
    // remaining order value.
    let bestBundle: { offerId: bigint; discount: Prisma.Decimal } | null = null;

    for (const offer of bundleCandidates) {
      if (offer.items.length < 2 || offer.bundlePrice === null) continue;

      let applicable = true;
      let original = new Prisma.Decimal(0);

      for (const bundleItem of offer.items) {
        const orderedQuantity = quantities.get(bundleItem.productId.toString());
        if (
          orderedQuantity === undefined ||
          orderedQuantity < bundleItem.quantity ||
          !bundleItem.product.isActive
        ) {
          applicable = false;
          break;
        }
        original = original.plus(bundleItem.product.price.mul(bundleItem.quantity));
      }

      if (!applicable) continue;

      let discount = original.minus(offer.bundlePrice);
      if (discount.isNegative()) discount = new Prisma.Decimal(0);

      if (bestBundle === null || discount.gt(bestBundle.discount)) {
        bestBundle = { offerId: offer.id, discount };
      }
    }

    let subtotal = new Prisma.Decimal(0);
    let itemDiscountTotal = new Prisma.Decimal(0);
    const itemCreates: Prisma.OrderItemCreateWithoutOrderInput[] = [];
    const appliedOffers: { offerId: bigint; discountAmount: Prisma.Decimal }[] = [];

    for (const item of input.items) {
      const product = productMap.get(item.productId.toString());
      if (!product) {
        throw new NotFoundError(`Product with id ${item.productId} not found`);
      }

      const originalUnitPrice = product.price;
      let unitPrice = originalUnitPrice;
      let itemDiscount = new Prisma.Decimal(0);
      const percentageOffer = bestPercentage.get(item.productId.toString());

      if (percentageOffer) {
        unitPrice = applyPercentage(originalUnitPrice, percentageOffer.discountPercent);
        itemDiscount = roundMoney(
          originalUnitPrice.minus(unitPrice).mul(item.quantity),
        );

        const existing = appliedOffers.find(
          (applied) => applied.offerId === percentageOffer.id,
        );
        if (existing) {
          existing.discountAmount = existing.discountAmount.plus(itemDiscount);
        } else {
          appliedOffers.push({ offerId: percentageOffer.id, discountAmount: itemDiscount });
        }
      }

      subtotal = subtotal.plus(originalUnitPrice.mul(item.quantity));
      itemDiscountTotal = itemDiscountTotal.plus(itemDiscount);

      itemCreates.push({
        quantity: item.quantity,
        originalUnitPrice,
        unitPrice,
        discountAmount: itemDiscount,
        product: { connect: { id: item.productId } },
      });
    }

    let bundleDiscount = new Prisma.Decimal(0);
    if (bestBundle !== null) {
      const remainingAfterItemDiscounts = subtotal.minus(itemDiscountTotal);
      bundleDiscount = bestBundle.discount.gt(remainingAfterItemDiscounts)
        ? remainingAfterItemDiscounts
        : bestBundle.discount;

      if (bundleDiscount.isNegative()) bundleDiscount = new Prisma.Decimal(0);
      if (bundleDiscount.gt(0)) {
        appliedOffers.push({
          offerId: bestBundle.offerId,
          discountAmount: bundleDiscount,
        });
      }
    }

    const totalDiscount = roundMoney(itemDiscountTotal.plus(bundleDiscount));
    const totalAmount = roundMoney(subtotal.minus(totalDiscount));

    // Atomic stock guard: the WHERE includes stock >= qty, so two concurrent
    // orders cannot both pass the earlier check and oversell.
    for (const item of input.items) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new ConflictError(`Insufficient stock for product ${item.productId}`);
      }
    }

    return tx.order.create({
      data: {
        userId: input.userId,
        subtotal: roundMoney(subtotal),
        discountAmount: totalDiscount,
        totalAmount,
        items: { create: itemCreates },
        orderOffers: {
          create: appliedOffers.map((applied) => ({
            offerId: applied.offerId,
            discountAmount: applied.discountAmount,
          })),
        },
      },
      include: orderInclude,
    });
  });

  await invalidateProductCache(productIds);

  logger.info("Order created", {
    orderId: order.id.toString(),
    userId: order.userId.toString(),
    itemCount: order.items.length,
    subtotal: order.subtotal.toFixed(2),
    discountAmount: order.discountAmount.toFixed(2),
    totalAmount: order.totalAmount.toFixed(2),
  });

  return toOrderDto(order);
}

export async function updateOrderStatusService(
  id: bigint,
  input: UpdateOrderStatusInput,
): Promise<OrderDto> {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  if (!order) {
    throw new NotFoundError(`Order with id ${id} not found`);
  }

  const currentStatus = order.status as OrderStatusValue;

  if (currentStatus === input.status) {
    return toOrderDto(order);
  }

  if (!ALLOWED_TRANSITIONS[currentStatus].includes(input.status)) {
    throw new ValidationError(
      `Cannot change order status from ${currentStatus} to ${input.status}`,
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (input.status === "CANCELLED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status: input.status },
      include: orderInclude,
    });
  });

  if (input.status === "CANCELLED") {
    await invalidateProductCache(order.items.map((item) => item.productId));
  }

  logger.info("Order status updated", {
    orderId: id.toString(),
    from: currentStatus,
    to: input.status,
  });

  return toOrderDto(updated);
}
