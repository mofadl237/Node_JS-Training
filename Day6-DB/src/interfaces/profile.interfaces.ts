/**
 * Profile CRUD contract types — mirrors users.interfaces.ts.
 *
 * Why: same rationale as the user module — one shared definition of the
 * list/write payloads so services, controllers and validators agree.
 */
import type { Profile } from "../generated/prisma/client.js";
import type { ListResult, SortOrder } from "./shared.interfaces.js";

/** Columns a client is allowed to sort by. */
export type ProfileSortField = "id" | "userId" | "bio" | "avatar";

/**
 * Fully-validated options for `GET /profiles`.
 * `| undefined` on optional fields again required by exactOptionalPropertyTypes.
 */
export interface GetProfilesOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  bio?: string | undefined;
  avatar?: string | undefined;
  /** Exact match on the unique FK — the natural lookup key of a profile. */
  userId?: number | undefined;
  sortBy: ProfileSortField;
  sortOrder: SortOrder;
}

export type GetProfilesResult = ListResult<Profile>;

/**
 * Write payload. `userId` is required on create (non-nullable FK) and
 * optional on update; bio/avatar are nullable columns, so `null` means
 * "clear" and omission means "leave untouched".
 */
export interface ProfileWriteInput {
  userId?: number;
  bio?: string | null;
  avatar?: string | null;
}
