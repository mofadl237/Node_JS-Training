/**
 * Offer services.
 *
 * Two offer types:
 * - PERCENTAGE: one product + discountPercent.
 * - BUNDLE: 2+ products + one unified bundlePrice for the whole set.
 *
 * Read paths are cached; writes invalidate both offer and product namespaces
 * because product responses contain `finalPrice` computed from percentage
 * offers.
 */
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { Product } from "../generated/prisma/client.js";
import {
  CACHE_PREFIXES,
  cacheGet,
  cacheKey,
  cacheSet,
  invalidateOfferCache,
} from "../shared/cache.js";
import { ConflictError, NotFoundError, ValidationError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import { logger } from "../shared/logger.js";
import { activeOfferDateWhere, applyPercentage } from "../shared/offer-pricing.js";
import { validateOfferShape } from "../shared/validate.js";
import type {
  CreateOfferInput,
  GetOffersOptions,
  GetOffersResult,
  OfferDto,
  OfferItemInput,
  OfferShape,
  OfferTypeValue,
  UpdateOfferInput,
} from "../interfaces/offer.interfaces.js";

const offerInclude = {
  product: true,
  items: { include: { product: true } },
} satisfies Prisma.OfferInclude;

type OfferWithRelations = Prisma.OfferGetPayload<{ include: typeof offerInclude }>;

export function toOfferDto(offer: OfferWithRelations): OfferDto {
  let originalBundlePrice: Prisma.Decimal | null = null;
  let savings: number | null = null;

  if (offer.type === "BUNDLE") {
    originalBundlePrice = offer.items.reduce(
      (total, item) => total.plus(item.product.price.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    if (offer.bundlePrice !== null) {
      const difference = originalBundlePrice.minus(offer.bundlePrice);
      savings = (difference.isNegative() ? new Prisma.Decimal(0) : difference).toNumber();
    }
  }

  const finalProductPrice =
    offer.type === "PERCENTAGE" && offer.product !== null && offer.discountPercent !== null
      ? applyPercentage(offer.product.price, offer.discountPercent).toNumber()
      : null;

  return {
    id: offer.id.toString(),
    title: offer.title,
    description: offer.description,
    type: offer.type,
    discountPercent: offer.discountPercent?.toNumber() ?? null,
    bundlePrice: offer.bundlePrice?.toNumber() ?? null,
    productId: offer.productId?.toString() ?? null,
    isActive: offer.isActive,
    startsAt: offer.startsAt?.toISOString() ?? null,
    endsAt: offer.endsAt?.toISOString() ?? null,
    createdAt: offer.createdAt.toISOString(),
    updatedAt: offer.updatedAt.toISOString(),
    product:
      offer.product === null
        ? null
        : {
            id: offer.product.id.toString(),
            name: offer.product.name,
            price: offer.product.price.toNumber(),
          },
    items: offer.items.map((item) => ({
      productId: item.productId.toString(),
      quantity: item.quantity,
      product: {
        id: item.product.id.toString(),
        name: item.product.name,
        price: item.product.price.toNumber(),
        isActive: item.product.isActive,
      },
    })),
    originalBundlePrice: originalBundlePrice?.toNumber() ?? null,
    savings,
    finalProductPrice,
  };
}

export function buildOffersWhere(options: GetOffersOptions): Prisma.OfferWhereInput {
  const conditions: Prisma.OfferWhereInput[] = [];

  if (options.search !== undefined) {
    conditions.push({
      OR: [
        { title: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }
  if (options.type !== undefined) {
    conditions.push({ type: options.type });
  }
  if (options.isActive !== undefined) {
    conditions.push({ isActive: options.isActive });
  }
  if (options.productId !== undefined) {
    conditions.push({
      OR: [
        { productId: options.productId },
        { items: { some: { productId: options.productId } } },
      ],
    });
  }
  if (options.activeOnly === true) {
    conditions.push(activeOfferDateWhere());
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

export async function getOffersService(options: GetOffersOptions): Promise<GetOffersResult> {
  const key = cacheKey(CACHE_PREFIXES.offersList, options);
  const cached = await cacheGet<GetOffersResult>(key);
  if (cached) return cached;

  const where = buildOffersWhere(options);
  const skip = (options.page - 1) * options.limit;

  const orderBy: Prisma.OfferOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  const result = await runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () =>
      prisma.offer.findMany({ where, orderBy, skip, take: options.limit, include: offerInclude }),
    fetchTotal: () => prisma.offer.count({ where }),
  });

  const response: GetOffersResult = {
    data: result.data.map(toOfferDto),
    pagination: result.pagination,
  };

  await cacheSet(key, response);
  return response;
}

export async function getOfferByIdService(id: bigint): Promise<OfferDto> {
  const key = `${CACHE_PREFIXES.offersItem}${id.toString()}`;
  const cached = await cacheGet<OfferDto>(key);
  if (cached) return cached;

  const offer = await prisma.offer.findUnique({ where: { id }, include: offerInclude });
  if (!offer) {
    throw new NotFoundError(`Offer with id ${id} not found`);
  }

  const dto = toOfferDto(offer);
  await cacheSet(key, dto);
  return dto;
}

async function ensureProductExists(id: bigint): Promise<void> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }
}

async function loadProducts(ids: bigint[]): Promise<Map<string, Product>> {
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  return new Map(products.map((product) => [product.id.toString(), product]));
}

function calculateBundleOriginalPrice(
  items: OfferItemInput[],
  products: Map<string, Product>,
): Prisma.Decimal {
  let total = new Prisma.Decimal(0);

  for (const item of items) {
    const product = products.get(item.productId.toString());
    if (!product) {
      throw new NotFoundError(`Product with id ${item.productId} not found`);
    }
    total = total.plus(product.price.mul(item.quantity));
  }

  return total;
}

export async function createOfferService(input: CreateOfferInput): Promise<OfferDto> {
  const data: Prisma.OfferCreateInput = {
    title: input.title,
    type: input.type,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    ...(input.startsAt !== undefined ? { startsAt: input.startsAt } : {}),
    ...(input.endsAt !== undefined ? { endsAt: input.endsAt } : {}),
  };

  if (input.type === "PERCENTAGE") {
    const productId = input.productId;
    const discount = input.discountPercent;

    if (productId === undefined || discount === undefined) {
      throw new ValidationError('"productId" and "discountPercent" are required');
    }

    await ensureProductExists(productId);
    data.discountPercent = new Prisma.Decimal(discount);
    data.product = { connect: { id: productId } };
  } else {
    const bundlePriceInput = input.bundlePrice;
    const items = input.items;

    if (bundlePriceInput === undefined || items === undefined) {
      throw new ValidationError('"bundlePrice" and "items" are required');
    }

    const products = await loadProducts(items.map((item) => item.productId));
    const original = calculateBundleOriginalPrice(items, products);
    const bundlePrice = new Prisma.Decimal(bundlePriceInput);

    if (bundlePrice.gte(original)) {
      throw new ValidationError(
        `"bundlePrice" must be lower than the combined product price (${original.toFixed(2)})`,
      );
    }

    data.bundlePrice = bundlePrice;
    data.items = {
      create: items.map((item) => ({
        quantity: item.quantity,
        product: { connect: { id: item.productId } },
      })),
    };
  }

  const offer = await prisma.offer.create({ data, include: offerInclude });
  await invalidateOfferCache([offer.id]);

  logger.info("Offer created", {
    offerId: offer.id.toString(),
    type: offer.type,
    title: offer.title,
  });

  return toOfferDto(offer);
}

export async function updateOfferService(
  id: bigint,
  input: UpdateOfferInput,
): Promise<OfferDto> {
  const existing = await prisma.offer.findUnique({ where: { id }, include: offerInclude });
  if (!existing) {
    throw new NotFoundError(`Offer with id ${id} not found`);
  }

  const type = existing.type as OfferTypeValue;
  const merged: OfferShape = {
    type,
    startsAt: input.startsAt !== undefined ? input.startsAt : existing.startsAt,
    endsAt: input.endsAt !== undefined ? input.endsAt : existing.endsAt,
  };

  if (type === "PERCENTAGE") {
    merged.productId = input.productId ?? existing.productId ?? undefined;
    merged.discountPercent =
      input.discountPercent ?? existing.discountPercent?.toFixed(2) ?? undefined;

    // If the client tries to send bundle-only fields, let validateOfferShape
    // produce the same error as on create.
    if (input.bundlePrice !== undefined) merged.bundlePrice = input.bundlePrice;
    if (input.items !== undefined) merged.items = input.items;
  } else {
    merged.bundlePrice = input.bundlePrice ?? existing.bundlePrice?.toFixed(2) ?? undefined;
    merged.items =
      input.items ??
      existing.items.map((item) => ({ productId: item.productId, quantity: item.quantity }));

    if (input.productId !== undefined) merged.productId = input.productId;
    if (input.discountPercent !== undefined) merged.discountPercent = input.discountPercent;
  }

  // Ensures the merged result is still a valid offer of its immutable type.
  // (The offer type itself is intentionally not updatable.)
  validateOfferShape(merged);

  if (type === "PERCENTAGE") {
    if (merged.productId === undefined) {
      throw new ValidationError('"productId" is required for a PERCENTAGE offer');
    }
    await ensureProductExists(merged.productId);
  } else {
    const items = merged.items;
    const bundlePriceInput = merged.bundlePrice;

    if (items === undefined || bundlePriceInput === undefined) {
      throw new ValidationError('"bundlePrice" and "items" are required for a BUNDLE offer');
    }

    const products = await loadProducts(items.map((item) => item.productId));
    const original = calculateBundleOriginalPrice(items, products);
    const bundlePrice = new Prisma.Decimal(bundlePriceInput);

    if (bundlePrice.gte(original)) {
      throw new ValidationError(
        `"bundlePrice" must be lower than the combined product price (${original.toFixed(2)})`,
      );
    }
  }

  const data: Prisma.OfferUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.startsAt !== undefined) data.startsAt = input.startsAt;
  if (input.endsAt !== undefined) data.endsAt = input.endsAt;

  if (type === "PERCENTAGE") {
    if (input.discountPercent !== undefined) {
      data.discountPercent = new Prisma.Decimal(input.discountPercent);
    }
    if (input.productId !== undefined) {
      data.product = { connect: { id: input.productId } };
    }
  } else {
    if (input.bundlePrice !== undefined) {
      data.bundlePrice = new Prisma.Decimal(input.bundlePrice);
    }
    if (input.items !== undefined) {
      data.items = {
        deleteMany: {},
        create: input.items.map((item) => ({
          quantity: item.quantity,
          product: { connect: { id: item.productId } },
        })),
      };
    }
  }

  const offer = await prisma.offer.update({
    where: { id },
    data,
    include: offerInclude,
  });

  await invalidateOfferCache([id]);
  logger.info("Offer updated", { offerId: id.toString(), type });

  return toOfferDto(offer);
}

export async function deleteOfferService(id: bigint): Promise<void> {
  try {
    await prisma.offer.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new ConflictError(
        "This offer is referenced by an order and cannot be deleted. Deactivate it instead.",
      );
    }
    throw error;
  }

  await invalidateOfferCache([id]);
  logger.info("Offer deleted", { offerId: id.toString() });
}
