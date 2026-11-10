import type { EPromotionScope } from "@prisma/client";
export type {
  ICreatePromotionTargetInput,
  IListPromotionTargetQuery,
  IUpdatePromotionTargetInput,
} from "./validation.js";

export interface IPromotionTargetResponse {
  id: string;
  promotionId: string;
  scope: EPromotionScope;
  productId: string | null;
  productPackageId: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  createdAt: Date;
}
