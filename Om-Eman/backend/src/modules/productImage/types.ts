export type {
  ICreateProductImageInput,
  IListProductImageQuery,
  IUpdateProductImageInput,
} from "./validation.js";

export interface IProductImageResponse {
  id: string;
  productId: string;
  url: string;
  altAr: string | null;
  altEn: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
