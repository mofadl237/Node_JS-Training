export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserInput {
  name?: string;
  phone?: string | null;
  password?: string;
}
