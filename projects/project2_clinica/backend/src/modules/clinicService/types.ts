export interface ICreateClinicServiceInput {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface IUpdateClinicServiceInput {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface IClinicServiceResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
