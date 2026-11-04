import type { EProductType, EProductStatus } from "@prisma/client";
export type {
  ICreateProductInput,
  IListProductQuery,
  IUpdateProductInput,
} from "./validation.js";

export interface IProductResponse {
  id: string;
  primarySubcategoryId: string;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  productType: EProductType;
  status: EProductStatus;
  brand: string | null;
  searchNameArNormalized: string | null;
  searchNameEnNormalized: string | null;
  searchKeywords: string | null;
  searchText: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
