import type { IApiError } from "@/interface/api";

const CART_ERROR_KEYS: Record<string, string> = {
  CART_NOT_FOUND: "cartNotFound",
  CART_NOT_ACTIVE: "cartNotActive",
  CART_ITEM_NOT_FOUND: "itemNotFound",
  PACKAGE_NOT_SALEABLE: "packageNotSaleable",
  VALIDATION_ERROR: "validationError",
};

const CART_MERGE_ERROR_KEYS: Record<string, string> = {
  CART_NOT_FOUND: "cart.merge.errors.cartNotFound",
  CART_NOT_ACTIVE: "cart.merge.errors.notActive",
  VALIDATION_ERROR: "cart.merge.errors.validation",
  TOKEN_MISSING: "cart.merge.errors.unauthorized",
  SESSION_INVALID: "cart.merge.errors.unauthorized",
  TOO_MANY_REQUESTS: "cart.merge.errors.rateLimited",
  RATE_LIMITED: "cart.merge.errors.rateLimited",
  REQUEST_FAILED: "cart.merge.errors.network",
};

export const isApiError = (error: unknown): error is IApiError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "status" in error &&
  typeof error.code === "string" &&
  typeof error.status === "number";

const STALE_CART_ERROR_CODES = new Set(["CART_NOT_ACTIVE", "CART_NOT_FOUND"]);

export const isStaleCartError = (error: unknown): boolean =>
  isApiError(error) && STALE_CART_ERROR_CODES.has(error.code);

export const resolveCartErrorKey = (error: unknown, fallback: string): string =>
  isApiError(error) ? CART_ERROR_KEYS[error.code] ?? fallback : fallback;

export const resolveCartMergeErrorKey = (
  error: unknown,
  fallback = "cart.merge.errors.unexpected",
): string => {
  if (!isApiError(error)) return fallback;
  if (error.status === 0) return "cart.merge.errors.network";
  return CART_MERGE_ERROR_KEYS[error.code] ?? fallback;
};
