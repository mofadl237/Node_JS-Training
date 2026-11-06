import type { ERole } from "@prisma/client";

export interface IJwtPayload {
  userId: string;
  email: string;
  role: ERole;
}
