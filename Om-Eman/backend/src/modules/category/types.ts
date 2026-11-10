export type {
  ICreateCategoryInput,
  IListCategoryQuery,
  IUpdateCategoryInput,
} from "./validation.js";

export interface ICategoryResponse {
  id: string;
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
