import type { Prisma } from "@prisma/client";
export type {
  ICreatePromotionRedemptionInput,
  IListPromotionRedemptionQuery,
  IUpdatePromotionRedemptionInput,
} from "./validation.js";

export interface IPromotionRedemptionResponse {
  id: string;
  promotionId: string;
  couponId: string | null;
  orderId: string;
  orderItemId: string | null;
  customerId: string;
  discountAmount: Prisma.Decimal;
  rulesSnapshot: Prisma.JsonValue | null;
  redeemedAt: Date;
  createdAt: Date;
}
