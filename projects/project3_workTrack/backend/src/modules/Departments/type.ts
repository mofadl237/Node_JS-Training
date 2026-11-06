export interface ICreateDepartmentInput {
  name: string;
  description?: string;
}

export interface IUpdateDepartmentInput {
  name?: string;
  description?: string | null;
}

export interface IDepartmentResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
