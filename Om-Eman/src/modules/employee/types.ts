import type { EEmployeeRole, EEmployeeStatus } from "@prisma/client";
export type {
  ICreateEmployeeInput,
  IListEmployeeQuery,
  IUpdateEmployeeInput,
} from "./validation.js";

export interface IEmployeeResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: EEmployeeRole;
  status: EEmployeeStatus;
  lastLoginAt: Date | null;
  disabledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
