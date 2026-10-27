export interface ICreateSpecializationInput {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface IUpdateSpecializationInput {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface ISpecializationResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
