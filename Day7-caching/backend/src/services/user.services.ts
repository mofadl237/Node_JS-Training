/**
 * User services — the only layer that talks to Prisma for users.
 * Services throw; controllers/error middleware decide HTTP status codes.
 */
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { User } from "../generated/prisma/client.js";
import { ConflictError, NotFoundError } from "../shared/errors.js";
import { runListQuery } from "../shared/list-query.js";
import { logger } from "../shared/logger.js";
import type {
  GetUsersOptions,
  GetUsersResult,
  UserDto,
  UserWriteInput,
} from "../interfaces/user.interfaces.js";

export function toUserDto(user: User): UserDto {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
  };
}

/** One where builder shared by findMany + count so totals always match. */
export function buildUsersWhere(options: GetUsersOptions): Prisma.UserWhereInput {
  const conditions: Prisma.UserWhereInput[] = [];

  if (options.search !== undefined) {
    conditions.push({
      OR: [
        { name: { contains: options.search, mode: "insensitive" } },
        { email: { contains: options.search, mode: "insensitive" } },
        { phone: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }
  if (options.name !== undefined) {
    conditions.push({ name: { contains: options.name, mode: "insensitive" } });
  }
  if (options.email !== undefined) {
    conditions.push({ email: { contains: options.email, mode: "insensitive" } });
  }
  if (options.phone !== undefined) {
    conditions.push({ phone: { contains: options.phone, mode: "insensitive" } });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

export async function getUsersService(options: GetUsersOptions): Promise<GetUsersResult> {
  const where = buildUsersWhere(options);
  const skip = (options.page - 1) * options.limit;

  const orderBy: Prisma.UserOrderByWithRelationInput[] =
    options.sortBy === "id"
      ? [{ id: options.sortOrder }]
      : [{ [options.sortBy]: options.sortOrder }, { id: "asc" }];

  const result = await runListQuery({
    page: options.page,
    limit: options.limit,
    fetchRows: () => prisma.user.findMany({ where, orderBy, skip, take: options.limit }),
    fetchTotal: () => prisma.user.count({ where }),
  });

  return { data: result.data.map(toUserDto), pagination: result.pagination };
}

export async function getUserByIdService(id: bigint): Promise<UserDto> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  return toUserDto(user);
}

export async function createUserService(
  input: UserWriteInput & { name: string; email: string },
): Promise<UserDto> {
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
    },
  });

  logger.info("User created", { userId: user.id.toString(), email: user.email });
  return toUserDto(user);
}

export async function updateUserService(
  id: bigint,
  data: UserWriteInput,
): Promise<UserDto> {
  const user = await prisma.user.update({ where: { id }, data });
  logger.info("User updated", { userId: user.id.toString() });
  return toUserDto(user);
}

export async function deleteUserService(id: bigint): Promise<void> {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new ConflictError(
        "This user has orders and cannot be deleted. Keep the account for order history.",
      );
    }
    throw error;
  }

  logger.info("User deleted", { userId: id.toString() });
}
