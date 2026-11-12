import { prisma } from "../../src/config/prisma.js";

// Returns true when PostgreSQL is reachable. Integration tests self-skip when
// the database is down instead of failing.
export async function isDatabaseUp(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export { prisma };
