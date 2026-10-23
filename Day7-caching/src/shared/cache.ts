/**
 * Redis cache helpers.
 *
 * Design goals:
 * - The API must work when Redis is down (cache is an optimisation, not a
 *   dependency) → every operation is wrapped and falls back to a miss.
 * - Read endpoints cache fully-shaped DTOs (strings/numbers only), so the
 *   cached JSON can be returned directly.
 * - Writes invalidate coarse namespaces. That is slightly aggressive but keeps
 *   lists/details from ever serving stale prices, stock or offer data.
 *
 * Key layout:
 *   products:list:<sha1(query)>   products:item:<id>
 *   offers:list:<sha1(query)>     offers:item:<id>
 */
import { createHash } from "node:crypto";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import { logger } from "./logger.js";

export const CACHE_PREFIXES = {
  productsList: "products:list:",
  productsItem: "products:item:",
  offersList: "offers:list:",
  offersItem: "offers:item:",
} as const;

function cacheEnabled(): boolean {
  return env.REDIS_URL !== "" && redis.isReady;
}

/** Stable cache key — bigint values are stringified before hashing. */
export function cacheKey(prefix: string, payload: unknown): string {
  const serialized = JSON.stringify(payload, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  const hash = createHash("sha1").update(serialized).digest("hex");
  return `${prefix}${hash}`;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!cacheEnabled()) return null;

  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    logger.warn("Cache read failed", { key, error });
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = env.CACHE_TTL_SECONDS,
): Promise<void> {
  if (!cacheEnabled()) return;

  try {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    logger.warn("Cache write failed", { key, error });
  }
}

export async function cacheDel(keys: string[]): Promise<void> {
  if (!cacheEnabled() || keys.length === 0) return;

  try {
    await redis.del(keys);
  } catch (error) {
    logger.warn("Cache delete failed", { keys, error });
  }
}

/**
 * Delete every key under a prefix using SCAN (never KEYS in production: KEYS
 * blocks Redis while it walks the whole keyspace).
 */
export async function cacheDelByPrefix(prefix: string): Promise<void> {
  if (!cacheEnabled()) return;

  try {
    for await (const key of redis.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
      await redis.del(key);
    }
  } catch (error) {
    logger.warn("Cache prefix delete failed", { prefix, error });
  }
}

function itemKeys(prefix: string, ids: (bigint | string)[]): string[] {
  return ids.map((id) => `${prefix}${String(id)}`);
}

/**
 * Product writes (create/update/delete/stock changes) invalidate:
 * - the product itself + every product list;
 * - offers, because offer DTOs embed product names/prices.
 */
export async function invalidateProductCache(productIds: (bigint | string)[] = []): Promise<void> {
  await cacheDel(itemKeys(CACHE_PREFIXES.productsItem, productIds));
  await Promise.all([
    cacheDelByPrefix(CACHE_PREFIXES.productsList),
    cacheDelByPrefix(CACHE_PREFIXES.offersList),
    cacheDelByPrefix(CACHE_PREFIXES.offersItem),
  ]);
}

/**
 * Offer writes invalidate offer data AND products, because product responses
 * contain `finalPrice` / `activeOffer` computed from percentage offers.
 */
export async function invalidateOfferCache(offerIds: (bigint | string)[] = []): Promise<void> {
  await cacheDel(itemKeys(CACHE_PREFIXES.offersItem, offerIds));
  await Promise.all([
    cacheDelByPrefix(CACHE_PREFIXES.offersList),
    cacheDelByPrefix(CACHE_PREFIXES.productsList),
    cacheDelByPrefix(CACHE_PREFIXES.productsItem),
  ]);
}
