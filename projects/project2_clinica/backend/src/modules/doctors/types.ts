import { UserRole } from "@prisma/client";

export interface IDoctorUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ICreateDoctorInput {
  userId?: string;
  user?: IDoctorUserInput;
  specializationId: string;
  imageUrl?: string;
  bio?: string;
}

export interface IUpdateDoctorInput {
  specializationId?: string;
  imageUrl?: string;
  bio?: string;
}

export interface IDoctorResponse {
  id: string;
  userId: string;
  specializationId: string;
  imageUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string | null;
  };
  specialization?: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
}

export interface IDoctorListQuery {
  specializationId?: string;
  page?: number;
  limit?: number;
}
