import { UserRole } from "@prisma/client";

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole | `${UserRole}`;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  phone: string | null;
}

export interface IAuthResponse {
  user: IAuthUser;
  token: string;
}
