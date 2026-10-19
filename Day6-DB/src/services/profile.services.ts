/**
 * Profile CRUD services — same architecture as users.services.ts.
 *
 * The shared Prisma client (users_module schema) is reused; errors are thrown
 * (not responded to) so the central error middleware maps them:
 * - findUnique miss → NotFoundError → 404;
 * - update/delete of a missing id → Prisma P2025 → 404;
 * - creating a second profile for the same user → P2002 on the unique
 *   userId column → 409 (this module, unlike users, HAS a unique constraint).
 */
import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { NotFoundError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import type {
  GetProfilesOptions,
  GetProfilesResult,
  ProfileWriteInput,
} from "../interfaces/profile.interfaces.js";

/**
 * Build a single composable `where` from validated list options — same
 * contract as buildUsersWhere: reused for both findMany and count so `total`
 * always matches the filtered rows.
 */
export function buildProfilesWhere(options: GetProfilesOptions): Prisma.ProfileWhereInput {
  const conditions: Prisma.ProfileWhereInput[] = [];

  // search spans bio + avatar with OR semantics, case-insensitive
  // (PostgreSQL ILIKE via Prisma — no raw SQL).
  if (options.search !== undefined) {
    conditions.push({
      OR: [
        { bio: { contains: options.search, mode: "insensitive" } },
        { avatar: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }

  if (options.bio !== undefined) {
    conditions.push({ bio: { contains: options.bio, mode: "insensitive" } });
  }
  if (options.avatar !== undefined) {
    conditions.push({ avatar: { contains: options.avatar, mode: "insensitive" } });
  }
  // Exact match — userId is the unique natural key of a profile.
  if (options.userId !== undefined) {
    conditions.push({ userId: options.userId });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

/** List profiles with filtering, sorting and pagination. */
export async function getProfilesService(
  options: GetProfilesOptions,
): Promise<GetProfilesResult> {
  const where = buildProfilesWhere(options);
  const skip = (options.page - 1) * options.limit;

  // Deterministic `id` tie-breaker, same rationale as the users module.
  const orderBy: Prisma.ProfileOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  return runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () =>
      prisma.profile.findMany({ where, orderBy, skip, take: options.limit }),
    fetchTotal: () => prisma.profile.count({ where }),
  });
}

/** Get one profile by its primary key. */
export async function getProfileByIdService(id: number) {
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) {
    throw new NotFoundError(`Profile with id ${id} not found`);
  }
  return profile;
}

/**
 * Get the profile of a user via the unique userId — the most common lookup
 * in the app ("show me my profile"), served by the unique index.
 */
export async function getProfileByUserIdService(userId: number) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    throw new NotFoundError(`Profile for user ${userId} not found`);
  }
  return profile;
}

/**
 * Create a profile. `userId` must reference an existing user — if it does
 * not, PostgreSQL raises a foreign-key error (P2003) which the error
 * middleware maps to 400. A duplicate userId hits the unique index (P2002)
 * and maps to 409.
 * The intersection type makes "userId is always present on create" explicit
 * without an `as` cast — parseCreateProfileBody already guarantees it.
 */
export async function createProfileService(input: ProfileWriteInput & { userId: number }) {
  return prisma.profile.create({
    data: {
      userId: input.userId,
      bio: input.bio ?? null,
      avatar: input.avatar ?? null,
    },
  });
}

/**
 * Update a profile by id. `data` only contains keys the client sent (omitted
 * fields absent, explicit null preserved to clear a column) — passed straight
 * through; P2025 (missing id) maps to 404 centrally.
 */
export async function updateProfileService(id: number, data: ProfileWriteInput) {
  return prisma.profile.update({
    where: { id },
    data,
  });
}

/** Delete a profile by id (P2025 → 404 via the error middleware). */
export async function deleteProfileService(id: number) {
  await prisma.profile.delete({ where: { id } });
}
