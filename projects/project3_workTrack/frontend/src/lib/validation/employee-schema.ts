import { z } from "zod";
import type { TEmployeeStatus } from "@/src/lib/api/types";

export interface IEmployeeValidationMessages {
  employeeCodeRequired: string;
  employeeCodeMax: string;
  firstNameRequired: string;
  firstNameMax: string;
  lastNameRequired: string;
  lastNameMax: string;
  emailInvalid: string;
  phoneInvalid: string;
  departmentRequired: string;
  jobTitleMax: string;
  hireDateRequired: string;
}

export interface IEmployeeFormValues {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  jobTitle: string;
  status: TEmployeeStatus;
  hireDate: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,20}$/;

export const createEmployeeSchema = (
  messages: IEmployeeValidationMessages,
) =>
  z.object({
    employeeCode: z
      .string()
      .trim()
      .min(1, messages.employeeCodeRequired)
      .max(50, messages.employeeCodeMax),
    firstName: z
      .string()
      .trim()
      .min(1, messages.firstNameRequired)
      .max(100, messages.firstNameMax),
    lastName: z
      .string()
      .trim()
      .min(1, messages.lastNameRequired)
      .max(100, messages.lastNameMax),
    email: z
      .string()
      .trim()
      .refine((value) => value === "" || EMAIL_PATTERN.test(value), {
        message: messages.emailInvalid,
      }),
    phone: z
      .string()
      .trim()
      .refine((value) => value === "" || PHONE_PATTERN.test(value), {
        message: messages.phoneInvalid,
      }),
    departmentId: z.string().trim().min(1, messages.departmentRequired),
    jobTitle: z.string().trim().max(100, messages.jobTitleMax),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    hireDate: z.string().trim().min(1, messages.hireDateRequired),
  });
