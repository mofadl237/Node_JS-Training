/**
 * Input parsing/validation.
 *
 * Controllers never touch raw query/body values: they call the parser for
 * their endpoint, which returns fully-typed options or throws a
 * ValidationError (400). Unknown query params / body keys are rejected so
 * typos never silently change behaviour.
 *
 * Why hand-rolled: the project intentionally has no zod/joi dependency; these
 * primitives keep the same contract with zero extra packages. Add a module by
 * composing the shared primitives at the bottom — do not re-implement parsing.
 */
import { ValidationError } from "./errors.js";
import type { SortOrder } from "../interfaces/shared.interfaces.js";
import type {
  GetUsersOptions,
  UserSortField,
  UserWriteInput,
} from "../interfaces/user.interfaces.js";
import type {
  GetProductsOptions,
  ProductSortField,
  ProductWriteInput,
} from "../interfaces/product.interfaces.js";
import {
  OFFER_TYPES,
  type CreateOfferInput,
  type GetOffersOptions,
  type OfferItemInput,
  type OfferShape,
  type OfferSortField,
  type OfferTypeValue,
  type OfferWriteInput,
  type UpdateOfferInput,
} from "../interfaces/offer.interfaces.js";
import {
  ORDER_STATUSES,
  type CreateOrderInput,
  type GetOrdersOptions,
  type OrderItemInput,
  type OrderSortField,
  type OrderStatusValue,
  type UpdateOrderStatusInput,
} from "../interfaces/order.interfaces.js";

// ---------------------------------------------------------------------------
// Generic constants + primitives
// ---------------------------------------------------------------------------

const SORT_ORDERS: readonly SortOrder[] = ["asc", "desc"];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const MAX_SAFE_ID = Number.MAX_SAFE_INTEGER;
const MAX_MONEY = 9_999_999_999.99;

type RawQuery = Record<string, unknown>;

/** Only plain string query params are accepted; arrays/objects are 400. */
export function readStringParam(value: unknown, name: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new ValidationError(`Query parameter "${name}" must be a single string value`);
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function readIntParam(
  value: string | undefined,
  name: string,
  options: { min: number; max: number },
): number | undefined {
  if (value === undefined) return undefined;
  if (!/^-?\d+$/.test(value)) {
    throw new ValidationError(`Query parameter "${name}" must be an integer`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < options.min || parsed > options.max) {
    throw new ValidationError(
      `Query parameter "${name}" must be between ${options.min} and ${options.max}`,
    );
  }
  return parsed;
}

export function readMoneyParam(
  value: string | undefined,
  name: string,
  options: { min: number; max: number },
): number | undefined {
  if (value === undefined) return undefined;
  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    throw new ValidationError(`Query parameter "${name}" must be a number`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < options.min || parsed > options.max) {
    throw new ValidationError(
      `Query parameter "${name}" must be between ${options.min} and ${options.max}`,
    );
  }
  return parsed;
}

export function readBooleanParam(value: string | undefined, name: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ValidationError(`Query parameter "${name}" must be "true" or "false"`);
}

export function readDateParam(value: string | undefined, name: string): Date | undefined {
  if (value === undefined) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError(
      `Query parameter "${name}" must be a valid ISO 8601 date (e.g. 2026-01-31)`,
    );
  }
  return parsed;
}

export function readBigIntParam(value: string | undefined, name: string): bigint | undefined {
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) {
    throw new ValidationError(`Query parameter "${name}" must be a positive integer`);
  }
  const parsed = BigInt(value);
  if (parsed <= 0n) {
    throw new ValidationError(`Query parameter "${name}" must be a positive integer`);
  }
  return parsed;
}

export function assertNoUnknownQueryParams(
  query: RawQuery,
  allowed: readonly string[],
): void {
  for (const key of Object.keys(query)) {
    if (!allowed.includes(key)) {
      throw new ValidationError(
        `Unknown query parameter "${key}". Allowed: ${allowed.join(", ")}`,
      );
    }
  }
}

export function parsePaginationParams(query: RawQuery): { page: number; limit: number } {
  const page =
    readIntParam(readStringParam(query["page"], "page"), "page", {
      min: 1,
      max: MAX_SAFE_ID,
    }) ?? DEFAULT_PAGE;

  const limit =
    readIntParam(readStringParam(query["limit"], "limit"), "limit", {
      min: 1,
      max: MAX_LIMIT,
    }) ?? DEFAULT_LIMIT;

  return { page, limit };
}

export function parseSortParams<F extends string>(
  query: RawQuery,
  allowedFields: readonly F[],
  defaultSort: { sortBy: F; sortOrder: SortOrder },
): { sortBy: F; sortOrder: SortOrder } {
  const sortByRaw = readStringParam(query["sortBy"], "sortBy");
  if (sortByRaw !== undefined && !allowedFields.includes(sortByRaw as F)) {
    throw new ValidationError(
      `Invalid "sortBy" value "${sortByRaw}". Allowed: ${allowedFields.join(", ")}`,
    );
  }

  const sortOrderRaw = readStringParam(query["sortOrder"], "sortOrder");
  if (sortOrderRaw !== undefined && !SORT_ORDERS.includes(sortOrderRaw as SortOrder)) {
    throw new ValidationError(
      `Invalid "sortOrder" value "${sortOrderRaw}". Allowed: ${SORT_ORDERS.join(", ")}`,
    );
  }

  return {
    sortBy: (sortByRaw as F | undefined) ?? defaultSort.sortBy,
    sortOrder: (sortOrderRaw as SortOrder | undefined) ?? defaultSort.sortOrder,
  };
}

/** Path ids are positive integers; BigInt keeps bigserial safe end-to-end. */
export function parseIdParam(raw: string | string[] | undefined, entity: string): bigint {
  if (raw === undefined || raw === "") {
    throw new ValidationError(`${entity} id is required`);
  }
  if (Array.isArray(raw)) {
    throw new ValidationError(`${entity} id must be a single value`);
  }
  if (!/^\d+$/.test(raw)) {
    throw new ValidationError(`${entity} id path parameter must be a positive integer`);
  }

  const id = BigInt(raw);
  if (id <= 0n) {
    throw new ValidationError(`${entity} id path parameter must be a positive integer`);
  }
  return id;
}

export function parseUserIdParam(raw: string | string[] | undefined): bigint {
  return parseIdParam(raw, "User");
}

// ---------------------------------------------------------------------------
// Generic body helpers
// ---------------------------------------------------------------------------

export function assertPlainObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ValidationError(`${label} must be a JSON object`);
  }
  return value as Record<string, unknown>;
}

export function assertNoUnknownKeys(
  fields: Record<string, unknown>,
  allowed: readonly string[],
): void {
  for (const key of Object.keys(fields)) {
    if (!allowed.includes(key)) {
      throw new ValidationError(
        `Unknown field "${key}" in request body. Allowed: ${allowed.join(", ")}`,
      );
    }
  }
}

export function parseNullableStringField(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string | null {
  if (value === null) return null;
  if (typeof value !== "string") {
    throw new ValidationError(`"${fieldName}" must be a string or null`);
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    throw new ValidationError(`"${fieldName}" cannot be an empty string — use null to clear it`);
  }
  if (trimmed.length > maxLength) {
    throw new ValidationError(`"${fieldName}" cannot exceed ${maxLength} characters`);
  }
  return trimmed;
}

export function parseRequiredStringField(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string {
  const parsed = parseNullableStringField(value === undefined ? null : value, fieldName, maxLength);
  if (parsed === null) {
    throw new ValidationError(`"${fieldName}" is required and cannot be null`);
  }
  return parsed;
}

export function parseRequiredIntField(
  value: unknown,
  fieldName: string,
  options: { min: number; max: number },
): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new ValidationError(`"${fieldName}" must be an integer`);
  }
  if (value < options.min || value > options.max) {
    throw new ValidationError(
      `"${fieldName}" must be between ${options.min} and ${options.max}`,
    );
  }
  return value;
}

export function parseNullableIntField(
  value: unknown,
  fieldName: string,
  options: { min: number; max: number },
): number | null {
  if (value === null) return null;
  return parseRequiredIntField(value, fieldName, options);
}

export function parseBooleanField(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new ValidationError(`"${fieldName}" must be a boolean`);
  }
  return value;
}

/**
 * Accepts a JSON number or a numeric string and returns a normalized decimal
 * string with 2 places. Storing the string in a Prisma Decimal column avoids
 * binary floating-point drift in totals.
 */
export function parseMoneyField(
  value: unknown,
  fieldName: string,
  options: { min: number; max: number },
): string {
  let parsed: number;

  if (typeof value === "number") {
    parsed = value;
  } else if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    parsed = Number(value.trim());
  } else {
    throw new ValidationError(`"${fieldName}" must be a number`);
  }

  if (!Number.isFinite(parsed) || parsed < options.min || parsed > options.max) {
    throw new ValidationError(
      `"${fieldName}" must be between ${options.min} and ${options.max}`,
    );
  }

  return parsed.toFixed(2);
}

export function parseBigIntField(value: unknown, fieldName: string): bigint {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new ValidationError(`"${fieldName}" must be a positive integer`);
    }
    return BigInt(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      throw new ValidationError(`"${fieldName}" must be a positive integer`);
    }
    const parsed = BigInt(trimmed);
    if (parsed <= 0n) {
      throw new ValidationError(`"${fieldName}" must be a positive integer`);
    }
    return parsed;
  }

  throw new ValidationError(`"${fieldName}" must be a positive integer or numeric string`);
}

export function parseDateField(
  value: unknown,
  fieldName: string,
  nullable: boolean,
): Date | null {
  if (value === null) {
    if (nullable) return null;
    throw new ValidationError(`"${fieldName}" cannot be null`);
  }
  if (typeof value !== "string") {
    throw new ValidationError(`"${fieldName}" must be an ISO 8601 date string or null`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError(`"${fieldName}" must be a valid ISO 8601 date string`);
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Users module
// ---------------------------------------------------------------------------

const USER_SORT_FIELDS: readonly UserSortField[] = ["id", "name", "email", "createdAt"];

const MAX_USER_NAME = 100;
const MAX_USER_EMAIL = 255;
const MAX_USER_PHONE = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseGetUsersQuery(query: RawQuery): GetUsersOptions {
  assertNoUnknownQueryParams(query, [
    "page",
    "limit",
    "search",
    "name",
    "email",
    "phone",
    "sortBy",
    "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, USER_SORT_FIELDS, {
    sortBy: "id",
    sortOrder: "asc",
  });

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    search: readStringParam(query["search"], "search"),
    name: readStringParam(query["name"], "name"),
    email: readStringParam(query["email"], "email"),
    phone: readStringParam(query["phone"], "phone"),
  };
}

function parseEmail(value: unknown, required: boolean): string | null {
  const email = parseNullableStringField(value, "email", MAX_USER_EMAIL);
  if (email === null) {
    if (required) throw new ValidationError('"email" is required');
    return null;
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new ValidationError('"email" must be a valid email address');
  }
  return email;
}

export function parseCreateUserBody(
  body: unknown,
): UserWriteInput & { name: string; email: string } {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["name", "email", "phone"]);

  if (!("name" in fields)) throw new ValidationError('"name" is required');
  if (!("email" in fields)) throw new ValidationError('"email" is required');

  const result: UserWriteInput & { name: string; email: string } = {
    name: parseRequiredStringField(fields["name"], "name", MAX_USER_NAME),
    email: parseEmail(fields["email"], true) as string,
  };

  if ("phone" in fields) {
    result.phone = parseNullableStringField(fields["phone"], "phone", MAX_USER_PHONE);
  }

  return result;
}

export function parseUpdateUserBody(body: unknown): UserWriteInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["name", "email", "phone"]);

  if (Object.keys(fields).length === 0) {
    throw new ValidationError("Update body must contain at least one of: name, email, phone");
  }

  const result: UserWriteInput = {};
  if ("name" in fields) {
    result.name = parseRequiredStringField(fields["name"], "name", MAX_USER_NAME);
  }
  if ("email" in fields) {
    result.email = parseEmail(fields["email"], true) as string;
  }
  if ("phone" in fields) {
    result.phone = parseNullableStringField(fields["phone"], "phone", MAX_USER_PHONE);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Products module
// ---------------------------------------------------------------------------

const PRODUCT_SORT_FIELDS: readonly ProductSortField[] = [
  "id",
  "name",
  "price",
  "stock",
  "category",
  "createdAt",
  "updatedAt",
];

const MAX_PRODUCT_NAME = 150;
const MAX_PRODUCT_DESCRIPTION = 2000;
const MAX_PRODUCT_CATEGORY = 80;
const MAX_STOCK = 1_000_000_000;

export function parseGetProductsQuery(query: RawQuery): GetProductsOptions {
  assertNoUnknownQueryParams(query, [
    "page",
    "limit",
    "search",
    "category",
    "isActive",
    "inStock",
    "minPrice",
    "maxPrice",
    "sortBy",
    "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, PRODUCT_SORT_FIELDS, {
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const minPrice = readMoneyParam(readStringParam(query["minPrice"], "minPrice"), "minPrice", {
    min: 0,
    max: MAX_MONEY,
  });
  const maxPrice = readMoneyParam(readStringParam(query["maxPrice"], "maxPrice"), "maxPrice", {
    min: 0,
    max: MAX_MONEY,
  });

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new ValidationError('Invalid price range: "minPrice" cannot be greater than "maxPrice"');
  }

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    search: readStringParam(query["search"], "search"),
    category: readStringParam(query["category"], "category"),
    isActive: readBooleanParam(readStringParam(query["isActive"], "isActive"), "isActive"),
    inStock: readBooleanParam(readStringParam(query["inStock"], "inStock"), "inStock"),
    minPrice,
    maxPrice,
  };
}

export function parseCreateProductBody(
  body: unknown,
): ProductWriteInput & { name: string; price: string } {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, [
    "name",
    "description",
    "category",
    "price",
    "stock",
    "isActive",
  ]);

  if (!("name" in fields)) throw new ValidationError('"name" is required');
  if (!("price" in fields)) throw new ValidationError('"price" is required');

  const result: ProductWriteInput & { name: string; price: string } = {
    name: parseRequiredStringField(fields["name"], "name", MAX_PRODUCT_NAME),
    price: parseMoneyField(fields["price"], "price", { min: 0.01, max: MAX_MONEY }),
  };

  if ("description" in fields) {
    result.description = parseNullableStringField(
      fields["description"],
      "description",
      MAX_PRODUCT_DESCRIPTION,
    );
  }
  if ("category" in fields) {
    result.category = parseNullableStringField(fields["category"], "category", MAX_PRODUCT_CATEGORY);
  }
  if ("stock" in fields) {
    result.stock = parseRequiredIntField(fields["stock"], "stock", { min: 0, max: MAX_STOCK });
  }
  if ("isActive" in fields) {
    result.isActive = parseBooleanField(fields["isActive"], "isActive");
  }

  return result;
}

export function parseUpdateProductBody(body: unknown): ProductWriteInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, [
    "name",
    "description",
    "category",
    "price",
    "stock",
    "isActive",
  ]);

  if (Object.keys(fields).length === 0) {
    throw new ValidationError(
      "Update body must contain at least one of: name, description, category, price, stock, isActive",
    );
  }

  const result: ProductWriteInput = {};
  if ("name" in fields) {
    result.name = parseRequiredStringField(fields["name"], "name", MAX_PRODUCT_NAME);
  }
  if ("description" in fields) {
    result.description = parseNullableStringField(
      fields["description"],
      "description",
      MAX_PRODUCT_DESCRIPTION,
    );
  }
  if ("category" in fields) {
    result.category = parseNullableStringField(fields["category"], "category", MAX_PRODUCT_CATEGORY);
  }
  if ("price" in fields) {
    result.price = parseMoneyField(fields["price"], "price", { min: 0.01, max: MAX_MONEY });
  }
  if ("stock" in fields) {
    result.stock = parseRequiredIntField(fields["stock"], "stock", { min: 0, max: MAX_STOCK });
  }
  if ("isActive" in fields) {
    result.isActive = parseBooleanField(fields["isActive"], "isActive");
  }
  return result;
}

// ---------------------------------------------------------------------------
// Offers module
// ---------------------------------------------------------------------------

const OFFER_SORT_FIELDS: readonly OfferSortField[] = [
  "id",
  "title",
  "type",
  "bundlePrice",
  "discountPercent",
  "createdAt",
  "updatedAt",
];

const MAX_OFFER_TITLE = 150;
const MAX_OFFER_DESCRIPTION = 2000;
const MAX_OFFER_ITEMS = 50;

function parseOfferType(value: unknown): OfferTypeValue {
  if (typeof value !== "string" || !OFFER_TYPES.includes(value as OfferTypeValue)) {
    throw new ValidationError(
      `"type" must be one of: ${OFFER_TYPES.join(", ")}`,
    );
  }
  return value as OfferTypeValue;
}

export function parseGetOffersQuery(query: RawQuery): GetOffersOptions {
  assertNoUnknownQueryParams(query, [
    "page",
    "limit",
    "search",
    "type",
    "isActive",
    "productId",
    "activeOnly",
    "sortBy",
    "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, OFFER_SORT_FIELDS, {
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const typeRaw = readStringParam(query["type"], "type");

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    search: readStringParam(query["search"], "search"),
    type: typeRaw === undefined ? undefined : parseOfferType(typeRaw),
    isActive: readBooleanParam(readStringParam(query["isActive"], "isActive"), "isActive"),
    productId: readBigIntParam(readStringParam(query["productId"], "productId"), "productId"),
    activeOnly: readBooleanParam(
      readStringParam(query["activeOnly"], "activeOnly"),
      "activeOnly",
    ),
  };
}

function parseProductItemList(value: unknown): OfferItemInput[] {
  if (!Array.isArray(value)) {
    throw new ValidationError('"items" must be an array');
  }
  if (value.length < 2) {
    throw new ValidationError('"items" must contain at least 2 products for a bundle');
  }
  if (value.length > MAX_OFFER_ITEMS) {
    throw new ValidationError(`"items" cannot contain more than ${MAX_OFFER_ITEMS} products`);
  }

  const result: OfferItemInput[] = [];
  const seen = new Set<string>();

  for (const rawItem of value) {
    const item = assertPlainObject(rawItem, "items entry");
    assertNoUnknownKeys(item, ["productId", "quantity"]);

    if (!("productId" in item)) {
      throw new ValidationError('"items[].productId" is required');
    }
    if (!("quantity" in item)) {
      throw new ValidationError('"items[].quantity" is required');
    }

    const productId = parseBigIntField(item["productId"], "items[].productId");
    const quantity = parseRequiredIntField(item["quantity"], "items[].quantity", {
      min: 1,
      max: 1000,
    });

    const key = productId.toString();
    if (seen.has(key)) {
      throw new ValidationError(`Duplicate product id ${key} in "items"`);
    }
    seen.add(key);

    result.push({ productId, quantity });
  }

  return result;
}

/** Cross-field rules that depend on the offer type (used by create + update). */
export function validateOfferShape(shape: OfferShape): void {
  if (shape.startsAt && shape.endsAt && shape.startsAt > shape.endsAt) {
    throw new ValidationError('"startsAt" cannot be later than "endsAt"');
  }

  if (shape.type === "PERCENTAGE") {
    if (shape.productId === undefined) {
      throw new ValidationError('"productId" is required for a PERCENTAGE offer');
    }
    if (shape.discountPercent === undefined) {
      throw new ValidationError('"discountPercent" is required for a PERCENTAGE offer');
    }
    if (shape.bundlePrice !== undefined || shape.items !== undefined) {
      throw new ValidationError(
        'A PERCENTAGE offer cannot contain "bundlePrice" or "items"',
      );
    }
    return;
  }

  if (shape.bundlePrice === undefined) {
    throw new ValidationError('"bundlePrice" is required for a BUNDLE offer');
  }
  if (shape.items === undefined || shape.items.length < 2) {
    throw new ValidationError('A BUNDLE offer requires at least 2 products in "items"');
  }
  if (shape.productId !== undefined || shape.discountPercent !== undefined) {
    throw new ValidationError(
      'A BUNDLE offer cannot contain "productId" or "discountPercent"',
    );
  }
}

export function parseCreateOfferBody(body: unknown): CreateOfferInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, [
    "title",
    "description",
    "type",
    "discountPercent",
    "bundlePrice",
    "productId",
    "items",
    "isActive",
    "startsAt",
    "endsAt",
  ]);

  if (!("type" in fields)) throw new ValidationError('"type" is required');
  if (!("title" in fields)) throw new ValidationError('"title" is required');

  const type = parseOfferType(fields["type"]);
  const title = parseRequiredStringField(fields["title"], "title", MAX_OFFER_TITLE);

  const startsAt =
    "startsAt" in fields ? parseDateField(fields["startsAt"], "startsAt", true) : undefined;
  const endsAt =
    "endsAt" in fields ? parseDateField(fields["endsAt"], "endsAt", true) : undefined;

  const shape: OfferShape = { type, startsAt, endsAt };

  if (type === "PERCENTAGE") {
    if (!("productId" in fields)) {
      throw new ValidationError('"productId" is required for a PERCENTAGE offer');
    }
    if (!("discountPercent" in fields)) {
      throw new ValidationError('"discountPercent" is required for a PERCENTAGE offer');
    }
    if ("bundlePrice" in fields || "items" in fields) {
      throw new ValidationError(
        'A PERCENTAGE offer cannot contain "bundlePrice" or "items"',
      );
    }

    shape.productId = parseBigIntField(fields["productId"], "productId");
    shape.discountPercent = parseMoneyField(fields["discountPercent"], "discountPercent", {
      min: 0.01,
      max: 100,
    });
  } else {
    if (!("bundlePrice" in fields)) {
      throw new ValidationError('"bundlePrice" is required for a BUNDLE offer');
    }
    if (!("items" in fields)) {
      throw new ValidationError('"items" is required for a BUNDLE offer');
    }
    if ("productId" in fields || "discountPercent" in fields) {
      throw new ValidationError(
        'A BUNDLE offer cannot contain "productId" or "discountPercent"',
      );
    }

    shape.bundlePrice = parseMoneyField(fields["bundlePrice"], "bundlePrice", {
      min: 0.01,
      max: MAX_MONEY,
    });
    shape.items = parseProductItemList(fields["items"]);
  }

  validateOfferShape(shape);

  const result: CreateOfferInput = { type, title };

  if ("description" in fields) {
    result.description = parseNullableStringField(
      fields["description"],
      "description",
      MAX_OFFER_DESCRIPTION,
    );
  }
  if ("isActive" in fields) {
    result.isActive = parseBooleanField(fields["isActive"], "isActive");
  }
  if (startsAt !== undefined) result.startsAt = startsAt;
  if (endsAt !== undefined) result.endsAt = endsAt;
  if (shape.productId !== undefined) result.productId = shape.productId;
  if (shape.discountPercent !== undefined) result.discountPercent = shape.discountPercent;
  if (shape.bundlePrice !== undefined) result.bundlePrice = shape.bundlePrice;
  if (shape.items !== undefined) result.items = shape.items;

  return result;
}

export function parseUpdateOfferBody(body: unknown): UpdateOfferInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, [
    "title",
    "description",
    "discountPercent",
    "bundlePrice",
    "productId",
    "items",
    "isActive",
    "startsAt",
    "endsAt",
  ]);

  if (Object.keys(fields).length === 0) {
    throw new ValidationError(
      "Update body must contain at least one of: title, description, discountPercent, bundlePrice, productId, items, isActive, startsAt, endsAt",
    );
  }

  const result: UpdateOfferInput = {};

  if ("title" in fields) {
    result.title = parseRequiredStringField(fields["title"], "title", MAX_OFFER_TITLE);
  }
  if ("description" in fields) {
    result.description = parseNullableStringField(
      fields["description"],
      "description",
      MAX_OFFER_DESCRIPTION,
    );
  }
  if ("discountPercent" in fields) {
    result.discountPercent = parseMoneyField(fields["discountPercent"], "discountPercent", {
      min: 0.01,
      max: 100,
    });
  }
  if ("bundlePrice" in fields) {
    result.bundlePrice = parseMoneyField(fields["bundlePrice"], "bundlePrice", {
      min: 0.01,
      max: MAX_MONEY,
    });
  }
  if ("productId" in fields) {
    result.productId = parseBigIntField(fields["productId"], "productId");
  }
  if ("items" in fields) {
    result.items = parseProductItemList(fields["items"]);
  }
  if ("isActive" in fields) {
    result.isActive = parseBooleanField(fields["isActive"], "isActive");
  }
  if ("startsAt" in fields) {
    result.startsAt = parseDateField(fields["startsAt"], "startsAt", true);
  }
  if ("endsAt" in fields) {
    result.endsAt = parseDateField(fields["endsAt"], "endsAt", true);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Orders module
// ---------------------------------------------------------------------------

const ORDER_SORT_FIELDS: readonly OrderSortField[] = [
  "id",
  "createdAt",
  "totalAmount",
  "status",
];

const MAX_ORDER_ITEMS = 100;

function parseOrderStatus(value: unknown): OrderStatusValue {
  if (typeof value !== "string" || !ORDER_STATUSES.includes(value as OrderStatusValue)) {
    throw new ValidationError(`"status" must be one of: ${ORDER_STATUSES.join(", ")}`);
  }
  return value as OrderStatusValue;
}

function parseOrderItemList(value: unknown): OrderItemInput[] {
  if (!Array.isArray(value)) {
    throw new ValidationError('"items" must be an array');
  }
  if (value.length < 1) {
    throw new ValidationError('"items" must contain at least one product');
  }
  if (value.length > MAX_ORDER_ITEMS) {
    throw new ValidationError(`"items" cannot contain more than ${MAX_ORDER_ITEMS} products`);
  }

  const result: OrderItemInput[] = [];
  const seen = new Set<string>();

  for (const rawItem of value) {
    const item = assertPlainObject(rawItem, "items entry");
    assertNoUnknownKeys(item, ["productId", "quantity"]);

    if (!("productId" in item)) {
      throw new ValidationError('"items[].productId" is required');
    }
    if (!("quantity" in item)) {
      throw new ValidationError('"items[].quantity" is required');
    }

    const productId = parseBigIntField(item["productId"], "items[].productId");
    const quantity = parseRequiredIntField(item["quantity"], "items[].quantity", {
      min: 1,
      max: 1000,
    });

    const key = productId.toString();
    if (seen.has(key)) {
      throw new ValidationError(`Duplicate product id ${key} in "items"`);
    }
    seen.add(key);

    result.push({ productId, quantity });
  }

  return result;
}

export function parseCreateOrderBody(body: unknown): CreateOrderInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["userId", "items"]);

  if (!("userId" in fields)) throw new ValidationError('"userId" is required');
  if (!("items" in fields)) throw new ValidationError('"items" is required');

  return {
    userId: parseBigIntField(fields["userId"], "userId"),
    items: parseOrderItemList(fields["items"]),
  };
}

export function parseGetOrdersQuery(query: RawQuery): GetOrdersOptions {
  assertNoUnknownQueryParams(query, [
    "page",
    "limit",
    "userId",
    "status",
    "createdFrom",
    "createdTo",
    "minTotal",
    "maxTotal",
    "sortBy",
    "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, ORDER_SORT_FIELDS, {
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const statusRaw = readStringParam(query["status"], "status");
  const createdFrom = readDateParam(readStringParam(query["createdFrom"], "createdFrom"), "createdFrom");
  const createdTo = readDateParam(readStringParam(query["createdTo"], "createdTo"), "createdTo");

  if (createdFrom !== undefined && createdTo !== undefined && createdFrom > createdTo) {
    throw new ValidationError(
      'Invalid date range: "createdFrom" cannot be later than "createdTo"',
    );
  }

  const minTotal = readMoneyParam(readStringParam(query["minTotal"], "minTotal"), "minTotal", {
    min: 0,
    max: MAX_MONEY,
  });
  const maxTotal = readMoneyParam(readStringParam(query["maxTotal"], "maxTotal"), "maxTotal", {
    min: 0,
    max: MAX_MONEY,
  });

  if (minTotal !== undefined && maxTotal !== undefined && minTotal > maxTotal) {
    throw new ValidationError('Invalid total range: "minTotal" cannot be greater than "maxTotal"');
  }

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    userId: readBigIntParam(readStringParam(query["userId"], "userId"), "userId"),
    status: statusRaw === undefined ? undefined : parseOrderStatus(statusRaw),
    createdFrom,
    createdTo,
    minTotal,
    maxTotal,
  };
}

export function parseUpdateOrderStatusBody(body: unknown): UpdateOrderStatusInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["status"]);

  if (!("status" in fields)) throw new ValidationError('"status" is required');

  return { status: parseOrderStatus(fields["status"]) };
}
