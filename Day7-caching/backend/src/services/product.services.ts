/**
 * Product services.
 *
 * Read paths are cached in Redis:
 * - list + detail responses are fully-shaped DTOs (no BigInt/Decimal), so they
 *   can be JSON-stringified and served straight from cache;
 * - product DTOs include `finalPrice`/`activeOffer` computed from the best
 *   active PERCENTAGE offer, so offer writes invalidate product caches too.
 */
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { Offer, Product } from "../generated/prisma/client.js";
import {
  CACHE_PREFIXES,
  cacheDel,
  cacheGet,
  cacheKey,
  cacheSet,
  invalidateProductCache,
} from "../shared/cache.js";
import { ConflictError, NotFoundError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import { logger } from "../shared/logger.js";
import { activeOfferDateWhere, applyPercentage } from "../shared/offer-pricing.js";
import type {
  GetProductsOptions,
  GetProductsResult,
  ProductDto,
  ProductWriteInput,
} from "../interfaces/product.interfaces.js";

interface PercentageOfferSummary {
  id: bigint;
  title: string;
  discountPercent: Prisma.Decimal;
}

export function toProductDto(product: Product, bestOffer?: Offer): ProductDto {
  const price = product.price;

  if (!bestOffer || bestOffer.discountPercent === null) {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      price: price.toNumber(),
      finalPrice: price.toNumber(),
      stock: product.stock,
      isActive: product.isActive,
      activeOffer: null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  const finalPrice = applyPercentage(price, bestOffer.discountPercent);

  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    category: product.category,
    price: price.toNumber(),
    finalPrice: finalPrice.toNumber(),
    stock: product.stock,
    isActive: product.isActive,
    activeOffer: {
      id: bestOffer.id.toString(),
      title: bestOffer.title,
      discountPercent: bestOffer.discountPercent.toNumber(),
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

/**
 * Fetch active PERCENTAGE offers for the given products and keep the best
 * (highest discount) per product. Overlapping offers are allowed by design;
 * the customer always gets the biggest discount.
 */
async function getBestPercentageOffers(
  productIds: bigint[],
  tx?: Prisma.TransactionClient,
): Promise<Map<string, Offer>> {
  const result = new Map<string, Offer>();
  if (productIds.length === 0) return result;

  const client = tx ?? prisma;
  const offers = await client.offer.findMany({
    where: {
      type: "PERCENTAGE",
      isActive: true,
      productId: { in: productIds },
      ...activeOfferDateWhere(),
    },
    orderBy: { discountPercent: "desc" },
  });

  for (const offer of offers) {
    if (offer.productId === null || offer.discountPercent === null) continue;
    const key = offer.productId.toString();
    if (!result.has(key)) result.set(key, offer);
  }

  return result;
}

export function buildProductsWhere(options: GetProductsOptions): Prisma.ProductWhereInput {
  const conditions: Prisma.ProductWhereInput[] = [];

  if (options.search !== undefined) {
    conditions.push({
      OR: [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }
  if (options.category !== undefined) {
    conditions.push({ category: { equals: options.category, mode: "insensitive" } });
  }
  if (options.isActive !== undefined) {
    conditions.push({ isActive: options.isActive });
  }
  if (options.inStock !== undefined) {
    conditions.push({ stock: options.inStock ? { gt: 0 } : { lte: 0 } });
  }
  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    conditions.push({
      price: {
        ...(options.minPrice !== undefined ? { gte: options.minPrice } : {}),
        ...(options.maxPrice !== undefined ? { lte: options.maxPrice } : {}),
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

export async function getProductsService(
  options: GetProductsOptions,
): Promise<GetProductsResult> {
  const key = cacheKey(CACHE_PREFIXES.productsList, options);
  const cached = await cacheGet<GetProductsResult>(key);
  if (cached) return cached;

  const where = buildProductsWhere(options);
  const skip = (options.page - 1) * options.limit;

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  const result = await runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () => prisma.product.findMany({ where, orderBy, skip, take: options.limit }),
    fetchTotal: () => prisma.product.count({ where }),
  });

  const offers = await getBestPercentageOffers(result.data.map((product) => product.id));
  const response: GetProductsResult = {
    data: result.data.map((product) =>
      toProductDto(product, offers.get(product.id.toString())),
    ),
    pagination: result.pagination,
  };

  await cacheSet(key, response);
  return response;
}

export async function getProductByIdService(id: bigint): Promise<ProductDto> {
  const key = `${CACHE_PREFIXES.productsItem}${id.toString()}`;
  const cached = await cacheGet<ProductDto>(key);
  if (cached) return cached;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  const offers = await getBestPercentageOffers([id]);
  const dto = toProductDto(product, offers.get(id.toString()));

  await cacheSet(key, dto);
  return dto;
}

export async function createProductService(
  input: ProductWriteInput & { name: string; price: string },
): Promise<ProductDto> {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      price: new Prisma.Decimal(input.price),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.stock !== undefined ? { stock: input.stock } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
  });

  await invalidateProductCache([product.id]);
  logger.info("Product created", { productId: product.id.toString(), price: product.price.toFixed(2) });

  return toProductDto(product);
}

export async function updateProductService(
  id: bigint,
  data: ProductWriteInput,
): Promise<ProductDto> {
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(data.price !== undefined ? { price: new Prisma.Decimal(data.price) } : {}),
    },
  });

  await invalidateProductCache([id]);
  logger.info("Product updated", { productId: id.toString() });

  const offers = await getBestPercentageOffers([id]);
  return toProductDto(product, offers.get(id.toString()));
}

export async function deleteProductService(id: bigint): Promise<void> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new ConflictError(
        "This product is used in orders or bundle offers and cannot be deleted. Deactivate it instead.",
      );
    }
    throw error;
  }

  await invalidateProductCache([id]);
  logger.info("Product deleted", { productId: id.toString() });
}
