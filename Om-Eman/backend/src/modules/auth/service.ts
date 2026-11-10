import { EEmployeeStatus } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors.js";
import { comparePassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";
import type { IAuthEmployee, IAuthResponse, ILoginInput } from "./types.js";

const authEmployeeSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
} as const;

export class AuthService {
  async login(dto: ILoginInput): Promise<IAuthResponse> {
    const email = dto.email.toLowerCase().trim();
    const employee = await prisma.employee.findUnique({
      where: { email },
      select: {
        ...authEmployeeSelect,
        passwordHash: true,
        status: true,
      },
    });

    if (!employee) {
      throw new UnauthorizedError(
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    if (employee.status !== EEmployeeStatus.ACTIVE) {
      throw new UnauthorizedError(
        "Employee account is not active",
        "EMPLOYEE_DISABLED",
      );
    }

    const passwordValid = await comparePassword(
      dto.password,
      employee.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedError(
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    await prisma.employee.update({
      where: { id: employee.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken({
      employeeId: employee.id,
      email: employee.email,
      role: employee.role,
    });

    return {
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
      },
      token,
    };
  }

  async me(employeeId: string): Promise<IAuthEmployee> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: authEmployeeSelect,
    });

    if (!employee) {
      throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
    }

    return employee;
  }
}
