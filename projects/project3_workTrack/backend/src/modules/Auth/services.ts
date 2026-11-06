import { ERole } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../shared/errors.js";
import { signToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import {
  createRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "../../utils/refresh-token.js";
import type {
  IAuthResponse,
  IAuthTokens,
  IAuthUser,
  ILoginInput,
  ILogoutInput,
  IRefreshTokenInput,
  IRegisterInput,
} from "./type.js";

const AUTH_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  departmentId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AuthService {
  private async issueTokens(user: IAuthUser): Promise<IAuthTokens> {
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = createRefreshToken();

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return {
      token,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: env.JWT_EXPIRES_IN,
      refreshExpiresInDays: env.REFRESH_TOKEN_TTL_DAYS,
    };
  }

  async register(dto: IRegisterInput): Promise<IAuthResponse> {
    const email = dto.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictError("Email already registered", "EMAIL_EXISTS");
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        password: hashedPassword,
        role: ERole.HR,
      },
      select: AUTH_USER_SELECT,
    });

    const tokens = await this.issueTokens(user);

    return { user, ...tokens };
  }

  async login(dto: ILoginInput): Promise<IAuthResponse> {
    const email = dto.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const safeUser: IAuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const tokens = await this.issueTokens(safeUser);

    return { user: safeUser, ...tokens };
  }

  async refresh(dto: IRefreshTokenInput): Promise<IAuthResponse> {
    const tokenHash = hashRefreshToken(dto.refreshToken);
    const existing = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: { select: AUTH_USER_SELECT },
      },
    });

    if (!existing) {
      throw new UnauthorizedError("Invalid refresh token", "REFRESH_TOKEN_INVALID");
    }

    if (existing.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { userId: existing.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedError(
        "Refresh token has been revoked",
        "REFRESH_TOKEN_REVOKED",
      );
    }

    if (existing.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError("Refresh token expired", "REFRESH_TOKEN_EXPIRED");
    }

    const rotated = await prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: existing.id },
        data: { revokedAt: new Date() },
      });

      const refreshToken = createRefreshToken();

      await tx.refreshToken.create({
        data: {
          tokenHash: hashRefreshToken(refreshToken),
          userId: existing.userId,
          expiresAt: getRefreshTokenExpiry(),
        },
      });

      return { refreshToken };
    });

    const token = signToken({
      userId: existing.user.id,
      email: existing.user.email,
      role: existing.user.role,
    });

    return {
      user: existing.user,
      token,
      refreshToken: rotated.refreshToken,
      tokenType: "Bearer",
      expiresIn: env.JWT_EXPIRES_IN,
      refreshExpiresInDays: env.REFRESH_TOKEN_TTL_DAYS,
    };
  }

  async logout(dto: ILogoutInput): Promise<void> {
    const tokenHash = hashRefreshToken(dto.refreshToken);

    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string): Promise<IAuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: AUTH_USER_SELECT,
    });

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    return user;
  }
}
