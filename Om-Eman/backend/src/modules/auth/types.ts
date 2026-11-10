import type { EEmployeeRole } from "@prisma/client";
import type { ILoginInput } from "./validation.js";

export type { ILoginInput };

export interface IAuthEmployee {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: EEmployeeRole;
}

export interface IAuthResponse {
  employee: IAuthEmployee;
  token: string;
}
