/**
 * User CRUD contract types.
 *
 * Why: services, controllers and validators need one shared definition of
 * "what a list query / create payload looks like" so the layers stay loosely
 * coupled and refactoring a service never ripples into HTTP code.
 */
import type { users as User } from "../generated/prisma/client.js";
import type { ListResult, PaginationMeta, SortOrder } from "./shared.interfaces.js";

// Re-exported so existing user-module imports keep working while the shared
// definitions live in one place for all modules.
export type { PaginationMeta, SortOrder };

/** Columns a client is allowed to sort by — anything else is rejected. */
export type UserSortField = "id" | "name" | "email" | "age";

/**
 * Fully-validated options for the list endpoint.
 * `page`/`limit`/`sortBy`/`sortOrder` are always present (defaults applied
 * during parsing); filter fields stay optional so the service can compose a
 * single Prisma `where` from whatever was actually provided.
 *
 * `| undefined` is explicit on the optional fields because the project enables
 * `exactOptionalPropertyTypes` — without it, passing `search: undefined`
 * would be a type error even though it is logically "not provided".
 */
export interface GetUsersOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  age?: number | undefined;
  minAge?: number | undefined;
  maxAge?: number | undefined;
  sortBy: UserSortField;
  sortOrder: SortOrder;
}

/** Shape of `GET /api/users` — matches the response contract of the task. */
export type GetUsersResult = ListResult<User>;

/**
 * Create/update payload for a user.
 * Every column in the Prisma schema is nullable, so `null` is a legal,
 * intentional value (it means "clear this column") and must not be confused
 * with "field omitted". No `| undefined` on the value types because the
 * project enables `exactOptionalPropertyTypes` and this object is passed
 * straight into Prisma's update/create input types.
 */
export interface UserWriteInput {
  name?: string | null;
  email?: string | null;
  age?: number | null;
}
