import type { ListResult, SortOrder } from "./shared.interfaces.js";

export type UserSortField = "id" | "name" | "email" | "createdAt";

export interface GetUsersOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  sortBy: UserSortField;
  sortOrder: SortOrder;
}

/** Partial write payload. `name`/`email` are required on create (see parser). */
export interface UserWriteInput {
  name?: string;
  email?: string;
  phone?: string | null;
}

/** JSON shape returned by the API (BigInt ids are strings, Decimal is number). */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export type GetUsersResult = ListResult<UserDto>;
