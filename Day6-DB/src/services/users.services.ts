/**
 * User CRUD services — the only layer that talks to Prisma.
 *
 * Why one shared client: `../config/prisma.js` instantiates PrismaClient once
 * with the PrismaPg adapter pinned to the `users_module` schema; importing it
 * here reuses that single instance instead of opening a new pool per call.
 *
 * Why services throw instead of responding: keeping HTTP concerns (status
 * codes, res.json) in controllers means these functions are reusable from
 * jobs/tests and the central error middleware can map thrown errors once.
 */
import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { NotFoundError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import type {
  GetUsersOptions,
  GetUsersResult,
  UserWriteInput,
} from "../interfaces/users.interfaces.js";

/**
 * Build a single composable `where` object from the validated list options.
 * Why one builder: the same object feeds both findMany and count, so the
 * reported `total` always matches the rows the filters actually select —
 * a classic bug source when two hand-written queries drift apart.
 * All field filters are combined with AND; `search` itself is an OR across
 * name/email using Prisma's case-insensitive mode (PostgreSQL ILIKE under
 * the hood — no raw SQL, no injection surface).
 */
export function buildUsersWhere(options: GetUsersOptions): Prisma.usersWhereInput {
  const conditions: Prisma.usersWhereInput[] = [];

  if (options.search !== undefined) {
    conditions.push({
      OR: [
        { name: { contains: options.search, mode: "insensitive" } },
        { email: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }

  if (options.name !== undefined) {
    conditions.push({ name: { contains: options.name, mode: "insensitive" } });
  }

  if (options.email !== undefined) {
    conditions.push({ email: { contains: options.email, mode: "insensitive" } });
  }

  // Exact age can coexist with minAge/maxAge (AND semantics): Prisma accepts
  // multiple conditions on the same field and applies them conjunctively.
  if (options.age !== undefined) {
    conditions.push({ age: options.age });
  }
  if (options.minAge !== undefined) {
    conditions.push({ age: { gte: options.minAge } });
  }
  if (options.maxAge !== undefined) {
    conditions.push({ age: { lte: options.maxAge } });
  }

  // An empty array would make Prisma ignore the filter entirely — returning
  // an empty object keeps findMany/count behaving as "no filter".
  return conditions.length > 0 ? { AND: conditions } : {};
}

/**
 * List users with filtering, search, sorting and pagination.
 * The concurrent findMany+count and pagination math live in runListQuery so
 * every module computes `total`/`totalPages` identically.
 */
export async function getUsersService(options: GetUsersOptions): Promise<GetUsersResult> {
  const where = buildUsersWhere(options);
  const skip = (options.page - 1) * options.limit;

  // orderBy is built from an allowlisted field only (validated earlier), and
  // always followed by `id` as a deterministic tie-breaker: without it,
  // PostgreSQL may return rows sharing the same age/name in a different order
  // on every page, which makes pagination skip or duplicate rows.
  const orderBy: Prisma.usersOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  return runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () =>
      prisma.users.findMany({
        where,
        orderBy,
        skip,
        take: options.limit,
      }),
    fetchTotal: () => prisma.users.count({ where }),
  });
}

/**
 * Get a single user by id.
 * Why findUnique + explicit throw: returning null to every caller would force
 * each controller to remember the 404 case; throwing once here centralizes it.
 */
export async function getUserByIdService(id: number) {
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  return user;
}

/**
 * Create a user. The input was already validated/normalized in the
 * controller, so this function trusts it and only handles the DB round-trip.
 */
export async function createUserService(input: UserWriteInput) {
  return prisma.users.create({
    data: {
      name: input.name ?? null,
      email: input.email ?? null,
      age: input.age ?? null,
    },
  });
}

/**
 * Update a user by id.
 * `data` only contains keys the client actually sent (omitted fields are
 * absent, explicit `null` is preserved to clear a column) — that is why we
 * pass it straight through instead of re-normalizing here.
 * If the id doesn't exist Prisma throws P2025, which the error middleware
 * maps to 404.
 */
export async function updateUserService(id: number, data: UserWriteInput) {
  return prisma.users.update({
    where: { id },
    data,
  });
}

/**
 * Delete a user by id. P2025 (unknown id) again maps to 404 centrally.
 * Related Profile/Post rows are removed by the schema's onDelete: Cascade.
 */
export async function deleteUserService(id: number) {
  await prisma.users.delete({ where: { id } });
}
