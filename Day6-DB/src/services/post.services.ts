/**
 * Post CRUD services — same architecture as users.services.ts.
 *
 * Extra considerations vs users:
 * - `authorId` is a required FK: a create/update pointing at a missing user
 *   raises P2003, which the error middleware maps to 400;
 * - `published` has a DB default (false), so the create path omits the key
 *   entirely when the client didn't send it instead of writing a value;
 * - `createdAt` is server-generated (DEFAULT now()) and never accepted from
 *   client input.
 */
import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { NotFoundError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import type {
  GetPostsOptions,
  GetPostsResult,
  PostWriteInput,
} from "../interfaces/post.interfaces.js";

/**
 * Build a single composable `where` from validated list options — reused for
 * findMany and count so `total` always matches the filtered rows.
 */
export function buildPostsWhere(options: GetPostsOptions): Prisma.PostWhereInput {
  const conditions: Prisma.PostWhereInput[] = [];

  if (options.search !== undefined) {
    conditions.push({
      OR: [
        { title: { contains: options.search, mode: "insensitive" } },
        { content: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }

  if (options.title !== undefined) {
    conditions.push({ title: { contains: options.title, mode: "insensitive" } });
  }
  if (options.published !== undefined) {
    conditions.push({ published: options.published });
  }
  if (options.authorId !== undefined) {
    conditions.push({ authorId: options.authorId });
  }
  // Inclusive date bounds on createdAt — same gte/lte style as minAge/maxAge.
  if (options.createdFrom !== undefined || options.createdTo !== undefined) {
    conditions.push({
      createdAt: {
        ...(options.createdFrom !== undefined ? { gte: options.createdFrom } : {}),
        ...(options.createdTo !== undefined ? { lte: options.createdTo } : {}),
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

/** List posts with filtering, sorting (newest-first by default) and pagination. */
export async function getPostsService(options: GetPostsOptions): Promise<GetPostsResult> {
  const where = buildPostsWhere(options);
  const skip = (options.page - 1) * options.limit;

  // Deterministic `id` tie-breaker, same rationale as the users module.
  const orderBy: Prisma.PostOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  return runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () =>
      prisma.post.findMany({ where, orderBy, skip, take: options.limit }),
    fetchTotal: () => prisma.post.count({ where }),
  });
}

/** Get one post by its primary key. */
export async function getPostByIdService(id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  return post;
}

/**
 * Create a post. Only keys the client actually sent are spread into `data`,
 * so omitting `published` lets the column default (false) apply and omitting
 * `content` stores NULL — no accidental overwrites with hardcoded values.
 * A missing authorId raises P2003 → 400 via the error middleware.
 */
export async function createPostService(input: PostWriteInput & { title: string; authorId: number }) {
  return prisma.post.create({
    data: {
      title: input.title,
      authorId: input.authorId,
      // Spread only what was provided: `published: undefined` would still
      // override the default under exactOptionalPropertyTypes semantics.
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.published !== undefined ? { published: input.published } : {}),
    },
  });
}

/**
 * Update a post by id. `data` only contains keys the client sent; explicit
 * null clears `content` (the only nullable text column). `title`/`published`
 * are non-nullable in the schema, so their parsers never emit null.
 */
export async function updatePostService(id: number, data: PostWriteInput) {
  return prisma.post.update({
    where: { id },
    data,
  });
}

/** Delete a post by id (P2025 → 404 via the error middleware). */
export async function deletePostService(id: number) {
  await prisma.post.delete({ where: { id } });
}
