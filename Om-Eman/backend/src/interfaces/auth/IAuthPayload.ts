import type { EEmployeeRole } from "@prisma/client";

export interface IAuthPayload {
  employeeId: string;
  email: string;
  role: EEmployeeRole;
}
