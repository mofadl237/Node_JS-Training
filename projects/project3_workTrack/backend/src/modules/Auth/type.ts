import type { ERole } from "@prisma/client";

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface ILogoutInput {
  refreshToken: string;
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
  departmentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthTokens {
  token: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  refreshExpiresInDays: number;
}

export interface IAuthResponse extends IAuthTokens {
  user: IAuthUser;
}
