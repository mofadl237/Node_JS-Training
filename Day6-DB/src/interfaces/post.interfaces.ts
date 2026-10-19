/**
 * Post CRUD contract types — mirrors users.interfaces.ts.
 */
import type { Post } from "../generated/prisma/client.js";
import type { ListResult, SortOrder } from "./shared.interfaces.js";

/** Columns a client is allowed to sort by (createdAt enables feed ordering). */
export type PostSortField = "id" | "title" | "published" | "authorId" | "createdAt";

/**
 * Fully-validated options for `GET /posts`.
 * createdFrom/createdTo are inclusive bounds on createdAt — the date-range
 * counterpart of the users module's minAge/maxAge.
 */
export interface GetPostsOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  title?: string | undefined;
  published?: boolean | undefined;
  authorId?: number | undefined;
  createdFrom?: Date | undefined;
  createdTo?: Date | undefined;
  sortBy: PostSortField;
  sortOrder: SortOrder;
}

export type GetPostsResult = ListResult<Post>;

/**
 * Write payload. `title` and `authorId` are non-nullable in the schema so
 * they are required on create; `published` is omitted (not null) when the
 * client wants the column default (false) to apply.
 */
export interface PostWriteInput {
  title?: string;
  content?: string | null;
  published?: boolean;
  authorId?: number;
}
