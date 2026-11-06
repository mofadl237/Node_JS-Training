import type { EEmployeeStatus } from "@prisma/client";

export interface ICreateEmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId: string;
  jobTitle?: string;
  status?: EEmployeeStatus;
  hireDate: Date;
}

export interface IUpdateEmployeeInput {
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  departmentId?: string;
  jobTitle?: string | null;
  status?: EEmployeeStatus;
  hireDate?: Date;
}

export interface IEmployeeDepartment {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmployeeResponse {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  departmentId: string;
  jobTitle: string | null;
  status: EEmployeeStatus;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
  department?: IEmployeeDepartment;
}
