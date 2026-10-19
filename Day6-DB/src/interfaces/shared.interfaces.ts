/**
 * Cross-module contract types.
 *
 * Why a shared file: pagination/sorting envelopes are identical for users,
 * profiles and posts. Defining them once means adding a module never
 * re-invents (or silently diverges from) the response shape clients already
 * depend on.
 */

export type SortOrder = "asc" | "desc";

/** Pagination metadata returned next to the rows so clients can paginate. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Standard list envelope: `{ data: [...], pagination: {...} }`. */
export interface ListResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
