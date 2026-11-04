import type { ELanguage } from "@prisma/client";
export type {
  ICreateProductAliasInput,
  IListProductAliasQuery,
  IUpdateProductAliasInput,
} from "./validation.js";

export interface IProductAliasResponse {
  id: string;
  productId: string;
  alias: string;
  language: ELanguage;
  normalizedAlias: string;
  weight: number;
  isSearchable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
