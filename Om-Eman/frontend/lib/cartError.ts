import type { IApiError } from "@/interface/api";

const CART_ERROR_KEYS: Record<string, string> = {
  CART_NOT_FOUND: "cartNotFound",
  CART_NOT_ACTIVE: "cartNotActive",
  CART_ITEM_NOT_FOUND: "itemNotFound",
  PACKAGE_NOT_SALEABLE: "packageNotSaleable",
  VALIDATION_ERROR: "validationError",
};

export const isApiError = (error: unknown): error is IApiError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "status" in error &&
  typeof error.code === "string" &&
  typeof error.status === "number";

export const resolveCartErrorKey = (error: unknown, fallback: string): string =>
  isApiError(error) ? CART_ERROR_KEYS[error.code] ?? fallback : fallback;
