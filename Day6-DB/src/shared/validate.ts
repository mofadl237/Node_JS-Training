/**
 * Lightweight input parsing/validation helpers.
 *
 * Why hand-rolled: the project has no validation library installed (checked
 * package.json / node_modules — no zod, joi, express-validator, ...). Adding
 * one just for a handful of scalar fields would be overkill, so these tiny
 * typed parsers keep the same contract: every parser either returns a clean,
 * correctly-typed value or throws a ValidationError (400). Controllers never
 * touch raw query/body values — they only see validated data.
 *
 * Structure: the generic primitives (string/int/boolean/date reading,
 * pagination, sorting, id params, body field parsers) live at the top and are
 * reused by every module. The module-specific query/body parsers at the
 * bottom are thin compositions of those primitives — adding a new module
 * means writing only its filter/body rules, never re-implementing parsing.
 */
import { ValidationError } from "./errors.js";
import type { SortOrder } from "../interfaces/shared.interfaces.js";
import type {
  GetUsersOptions,
  UserSortField,
  UserWriteInput,
} from "../interfaces/users.interfaces.js";
import type {
  GetProfilesOptions,
  ProfileSortField,
  ProfileWriteInput,
} from "../interfaces/profile.interfaces.js";
import type {
  GetPostsOptions,
  PostSortField,
  PostWriteInput,
} from "../interfaces/post.interfaces.js";

// ---------------------------------------------------------------------------
// Generic constants + primitives
// ---------------------------------------------------------------------------

const SORT_ORDERS: readonly SortOrder[] = ["asc", "desc"];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const MAX_ID = Number.MAX_SAFE_INTEGER;

/** Minimal shape of Express' req.query that we care about. */
type RawQuery = Record<string, unknown>;

/**
 * Express parses repeated/`a[b]=c` query params into arrays/objects.
 * We only accept plain strings, so anything else is a client error instead of
 * silently coercing (e.g. `?page=1&page=2` must not become "12" or NaN).
 * Empty/whitespace-only values are treated as "not provided" — a common
 * frontend pattern (`?name=&age=25`) and not an error.
 */
export function readStringParam(value: unknown, name: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new ValidationError(`Query parameter "${name}" must be a single string value`);
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Parse an integer query param with range checks.
 * `Number("12abc")` is NaN and `parseInt("12abc")` silently yields 12 — both
 * are misleading, so we validate the whole string against an integer regex.
 */
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

/**
 * Boolean query param — only the exact strings "true"/"false" are accepted.
 * Anything else (`1`, `yes`, `TRUE`) is a 400: silently truthy-fying strings
 * is a classic source of surprising filter behaviour.
 */
export function readBooleanParam(value: string | undefined, name: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ValidationError(`Query parameter "${name}" must be "true" or "false"`);
}

/**
 * ISO-8601 date/time query param (e.g. `2026-01-01` or full timestamps).
 * Rejects anything Date can't parse so we never send `Invalid Date` to Prisma.
 */
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

/** Reject unknown query params instead of ignoring typos like `minage=20`. */
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

/** Shared page/limit parsing — every list endpoint uses the same rules. */
export function parsePaginationParams(query: RawQuery): { page: number; limit: number } {
  const page = readIntParam(readStringParam(query["page"], "page"), "page", {
    min: 1,
    max: MAX_ID,
  }) ?? DEFAULT_PAGE;

  const limit = readIntParam(readStringParam(query["limit"], "limit"), "limit", {
    min: 1,
    max: MAX_LIMIT,
  }) ?? DEFAULT_LIMIT;

  return { page, limit };
}

/**
 * Shared sortBy/sortOrder parsing against a per-module allowlist.
 * The generic `F extends string` keeps each module's sort-field union
 * (UserSortField, ProfileSortField, ...) intact in the return type.
 */
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

/**
 * Path-param id must be a positive integer — ids are SERIAL columns.
 * `entity` is used only to make the error message point at the right resource
 * ("Profile id..." vs "Post id...").
 * Express 5 types route params as `string | string[] | undefined`, so an
 * array (e.g. a malformed repeated segment) is rejected as a client error
 * instead of being coerced to "1,2" or NaN.
 */
export function parseIdParam(
  raw: string | string[] | undefined,
  entity: string,
): number {
  if (raw === undefined || raw === "") {
    throw new ValidationError(`${entity} id is required`);
  }
  if (Array.isArray(raw)) {
    throw new ValidationError(`${entity} id must be a single value`);
  }
  if (!/^-?\d+$/.test(raw)) {
    throw new ValidationError(`${entity} id path parameter must be an integer`);
  }
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ValidationError(`${entity} id path parameter must be a positive integer`);
  }
  return id;
}

/** Kept as a named wrapper so user controllers read naturally. */
export function parseUserIdParam(raw: string | string[] | undefined): number {
  return parseIdParam(raw, "User");
}

// ---------------------------------------------------------------------------
// Generic JSON-body field parsers
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

/**
 * Nullable string body field: `null` clears the column, strings are trimmed,
 * empty strings are rejected (use null), and an optional max length caps abuse.
 */
export function parseNullableStringField(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string | null {
  if (value === null) return null; // explicit clear
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

/**
 * Required (non-nullable) string body field — for columns like Post.title
 * where the schema itself forbids null.
 */
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

/** Nullable integer body field with range checks (JSON numbers only). */
export function parseNullableIntField(
  value: unknown,
  fieldName: string,
  options: { min: number; max: number },
): number | null {
  if (value === null) return null;
  // JSON numbers arrive as `number`; reject strings so we never coerce
  // `"25"` into 25 silently.
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new ValidationError(`"${fieldName}" must be an integer or null`);
  }
  if (value < options.min || value > options.max) {
    throw new ValidationError(
      `"${fieldName}" must be between ${options.min} and ${options.max}`,
    );
  }
  return value;
}

/**
 * Required positive-integer body field — for FK columns that must always be
 * sent (Profile.userId, Post.authorId). Not nullable, unlike the helper above.
 */
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

/** Non-nullable boolean body field (Post.published has a DB default). */
export function parseBooleanField(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new ValidationError(`"${fieldName}" must be a boolean`);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Users module — query + body parsers
// ---------------------------------------------------------------------------

/** Sort fields we allow — anything else is rejected (no interpolated identifiers). */
const USER_SORT_FIELDS: readonly UserSortField[] = ["id", "name", "email", "age"];

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320; // practical upper bound from RFC 5321
// Deliberately permissive: just catches obvious garbage, not every RFC rule.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AGE = 150;

/**
 * Validate + normalize the full query string of `GET /users`.
 * Defaults (page=1, limit=10) are applied here so the service layer only ever
 * deals with complete, trusted options.
 */
export function parseGetUsersQuery(query: RawQuery): GetUsersOptions {
  assertNoUnknownQueryParams(query, [
    "page", "limit", "search", "name", "email",
    "age", "minAge", "maxAge", "sortBy", "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, USER_SORT_FIELDS, {
    // Defaults chosen to keep the previous behaviour of this endpoint
    // (it used to order by age descending).
    sortBy: "age",
    sortOrder: "desc",
  });

  const search = readStringParam(query["search"], "search");
  const name = readStringParam(query["name"], "name");
  const email = readStringParam(query["email"], "email");

  const age = readIntParam(readStringParam(query["age"], "age"), "age", {
    min: 0,
    max: MAX_AGE,
  });
  const minAge = readIntParam(readStringParam(query["minAge"], "minAge"), "minAge", {
    min: 0,
    max: MAX_AGE,
  });
  const maxAge = readIntParam(readStringParam(query["maxAge"], "maxAge"), "maxAge", {
    min: 0,
    max: MAX_AGE,
  });

  // Contradictory range must fail fast with a 400 instead of silently
  // returning an empty list (which looks like "no users matched").
  if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
    throw new ValidationError('Invalid age range: "minAge" cannot be greater than "maxAge"');
  }

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    name,
    email,
    age,
    minAge,
    maxAge,
  };
}

function parseNullableEmail(value: unknown): string | null {
  const email = parseNullableStringField(value, "email", MAX_EMAIL_LENGTH);
  if (email === null) return null;
  // NOTE: email is NOT unique in the schema, so no uniqueness handling here.
  if (!EMAIL_PATTERN.test(email)) {
    throw new ValidationError('"email" must be a valid email address');
  }
  return email;
}

/**
 * Parse + validate a create body.
 * `undefined` means "field omitted", `null` means "explicitly clear the column"
 * — both are legal because every column in the schema is nullable. At least
 * one field must be provided so we never insert a completely empty row by
 * accident. Only present keys are validated/parsed, so omitting `name` while
 * sending `email` works (omitted fields are simply absent from the result).
 */
export function parseCreateUserBody(body: unknown): UserWriteInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["name", "email", "age"]);

  if (!("name" in fields) && !("email" in fields) && !("age" in fields)) {
    throw new ValidationError("At least one of name, email or age must be provided");
  }

  const result: UserWriteInput = {};
  // Same `in` checks as update: validating an omitted key would wrongly
  // reject `{"email": "a@b.c"}` with a "name" error.
  if ("name" in fields) result.name = parseNullableStringField(fields["name"], "name", MAX_NAME_LENGTH);
  if ("email" in fields) result.email = parseNullableEmail(fields["email"]);
  if ("age" in fields) result.age = parseNullableIntField(fields["age"], "age", { min: 0, max: MAX_AGE });
  return result;
}

/**
 * Parse + validate an update body (PATCH).
 * Differences from create:
 * - empty body is rejected (a PATCH that changes nothing is a client bug);
 * - omitted fields are simply absent from the result so Prisma leaves them
 *   untouched, while explicit `null` is preserved to clear the column.
 */
export function parseUpdateUserBody(body: unknown): UserWriteInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["name", "email", "age"]);

  if (Object.keys(fields).length === 0) {
    throw new ValidationError("Update body must contain at least one of: name, email, age");
  }

  const result: UserWriteInput = {};
  // `in` checks distinguish "key omitted" from "key present with value null",
  // which is exactly the distinction PATCH semantics require.
  if ("name" in fields) result.name = parseNullableStringField(fields["name"], "name", MAX_NAME_LENGTH);
  if ("email" in fields) result.email = parseNullableEmail(fields["email"]);
  if ("age" in fields) result.age = parseNullableIntField(fields["age"], "age", { min: 0, max: MAX_AGE });
  return result;
}

// ---------------------------------------------------------------------------
// Profiles module — query + body parsers
// ---------------------------------------------------------------------------

/** Sort fields we allow for profiles — bio/avatar are the interesting columns. */
const PROFILE_SORT_FIELDS: readonly ProfileSortField[] = ["id", "userId", "bio", "avatar"];

const MAX_BIO_LENGTH = 2000;
const MAX_AVATAR_LENGTH = 500;

/**
 * Query string of `GET /profiles`.
 * `userId` is an exact-match filter (it is the unique natural key of a
 * profile); `search`/`bio`/`avatar` are case-insensitive contains filters.
 */
export function parseGetProfilesQuery(query: RawQuery): GetProfilesOptions {
  assertNoUnknownQueryParams(query, [
    "page", "limit", "search", "userId", "bio", "avatar", "sortBy", "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, PROFILE_SORT_FIELDS, {
    sortBy: "id",
    sortOrder: "asc",
  });

  const search = readStringParam(query["search"], "search");
  const bio = readStringParam(query["bio"], "bio");
  const avatar = readStringParam(query["avatar"], "avatar");
  const userId = readIntParam(readStringParam(query["userId"], "userId"), "userId", {
    min: 1,
    max: MAX_ID,
  });

  return { page, limit, sortBy, sortOrder, search, bio, avatar, userId };
}

/**
 * Create body: `userId` is a required FK (the schema has it non-nullable and
 * unique — one profile per user), bio/avatar stay optional and nullable.
 * The return type intersects `{ userId: number }` so callers (and the create
 * service) see the guarantee the parser enforces — no `as` casts downstream.
 */
export function parseCreateProfileBody(
  body: unknown,
): ProfileWriteInput & { userId: number } {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["userId", "bio", "avatar"]);

  if (!("userId" in fields)) {
    throw new ValidationError('"userId" is required to create a profile');
  }

  const result: ProfileWriteInput & { userId: number } = {
    userId: parseRequiredIntField(fields["userId"], "userId", { min: 1, max: MAX_ID }),
  };
  if ("bio" in fields) result.bio = parseNullableStringField(fields["bio"], "bio", MAX_BIO_LENGTH);
  if ("avatar" in fields) result.avatar = parseNullableStringField(fields["avatar"], "avatar", MAX_AVATAR_LENGTH);
  return result;
}

/**
 * Update body: userId may be re-assigned (with P2002 → 409 if it collides
 * with another profile's unique userId), everything else is a plain partial
 * update with the same omitted-vs-null rules as users.
 */
export function parseUpdateProfileBody(body: unknown): ProfileWriteInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["userId", "bio", "avatar"]);

  if (Object.keys(fields).length === 0) {
    throw new ValidationError("Update body must contain at least one of: userId, bio, avatar");
  }

  const result: ProfileWriteInput = {};
  if ("userId" in fields) result.userId = parseRequiredIntField(fields["userId"], "userId", { min: 1, max: MAX_ID });
  if ("bio" in fields) result.bio = parseNullableStringField(fields["bio"], "bio", MAX_BIO_LENGTH);
  if ("avatar" in fields) result.avatar = parseNullableStringField(fields["avatar"], "avatar", MAX_AVATAR_LENGTH);
  return result;
}

// ---------------------------------------------------------------------------
// Posts module — query + body parsers
// ---------------------------------------------------------------------------

/** createdAt is included so clients can sort a feed newest-first. */
const POST_SORT_FIELDS: readonly PostSortField[] = [
  "id", "title", "published", "authorId", "createdAt",
];

const MAX_TITLE_LENGTH = 300;
const MAX_CONTENT_LENGTH = 10_000;

/**
 * Query string of `GET /posts`.
 * `search` spans title OR content (same OR/insensitive contract as users);
 * `published` is a strict boolean; `createdFrom`/`createdTo` are inclusive
 * ISO-date bounds on createdAt — the post-module equivalent of minAge/maxAge.
 */
export function parseGetPostsQuery(query: RawQuery): GetPostsOptions {
  assertNoUnknownQueryParams(query, [
    "page", "limit", "search", "title", "published", "authorId",
    "createdFrom", "createdTo", "sortBy", "sortOrder",
  ]);

  const { page, limit } = parsePaginationParams(query);
  // Default: newest first — the natural reading order for a post feed.
  const { sortBy, sortOrder } = parseSortParams(query, POST_SORT_FIELDS, {
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const search = readStringParam(query["search"], "search");
  const title = readStringParam(query["title"], "title");
  const published = readBooleanParam(readStringParam(query["published"], "published"), "published");
  const authorId = readIntParam(readStringParam(query["authorId"], "authorId"), "authorId", {
    min: 1,
    max: MAX_ID,
  });
  const createdFrom = readDateParam(readStringParam(query["createdFrom"], "createdFrom"), "createdFrom");
  const createdTo = readDateParam(readStringParam(query["createdTo"], "createdTo"), "createdTo");

  // Same rationale as minAge/maxAge: a contradictory range is a client bug
  // that must surface as 400, not as a confusing empty list.
  if (createdFrom !== undefined && createdTo !== undefined && createdFrom > createdTo) {
    throw new ValidationError(
      'Invalid date range: "createdFrom" cannot be later than "createdTo"',
    );
  }

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    title,
    published,
    authorId,
    createdFrom,
    createdTo,
  };
}

/**
 * Create body: `title` (non-nullable in the schema) and `authorId` (FK) are
 * required; `content` is nullable; `published` is optional and falls back to
 * the column default (false) when omitted — which is why the parser returns
 * `undefined` for it and the service omits the key instead of writing null.
 * The intersection type encodes the two required fields for callers.
 */
export function parseCreatePostBody(
  body: unknown,
): PostWriteInput & { title: string; authorId: number } {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["title", "content", "published", "authorId"]);

  if (!("title" in fields)) {
    throw new ValidationError('"title" is required to create a post');
  }
  if (!("authorId" in fields)) {
    throw new ValidationError('"authorId" is required to create a post');
  }

  const result: PostWriteInput & { title: string; authorId: number } = {
    title: parseRequiredStringField(fields["title"], "title", MAX_TITLE_LENGTH),
    authorId: parseRequiredIntField(fields["authorId"], "authorId", { min: 1, max: MAX_ID }),
  };
  if ("content" in fields) result.content = parseNullableStringField(fields["content"], "content", MAX_CONTENT_LENGTH);
  if ("published" in fields) result.published = parseBooleanField(fields["published"], "published");
  return result;
}

/** Partial update with the same omitted-vs-null rules as the other modules. */
export function parseUpdatePostBody(body: unknown): PostWriteInput {
  const fields = assertPlainObject(body, "Request body");
  assertNoUnknownKeys(fields, ["title", "content", "published", "authorId"]);

  if (Object.keys(fields).length === 0) {
    throw new ValidationError(
      "Update body must contain at least one of: title, content, published, authorId",
    );
  }

  const result: PostWriteInput = {};
  if ("title" in fields) result.title = parseRequiredStringField(fields["title"], "title", MAX_TITLE_LENGTH);
  if ("content" in fields) result.content = parseNullableStringField(fields["content"], "content", MAX_CONTENT_LENGTH);
  if ("published" in fields) result.published = parseBooleanField(fields["published"], "published");
  if ("authorId" in fields) result.authorId = parseRequiredIntField(fields["authorId"], "authorId", { min: 1, max: MAX_ID });
  return result;
}
