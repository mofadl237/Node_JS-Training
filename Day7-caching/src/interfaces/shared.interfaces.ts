/**
 * Cross-module contract types: pagination/sorting envelopes shared by every
 * list endpoint.
 */

export type SortOrder = "asc" | "desc";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ListResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
