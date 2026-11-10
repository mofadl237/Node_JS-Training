export type {
  ICreateSubcategoryInput,
  IListSubcategoryQuery,
  IUpdateSubcategoryInput,
} from "./validation.js";

export interface ISubcategoryResponse {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
