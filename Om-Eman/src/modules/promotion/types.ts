import type { EPromotionType, EDiscountType, Prisma } from "@prisma/client";
export type {
  ICreatePromotionInput,
  IListPromotionQuery,
  IUpdatePromotionInput,
} from "./validation.js";

export interface IPromotionResponse {
  id: string;
  name: string;
  description: string | null;
  promotionType: EPromotionType;
  discountType: EDiscountType;
  value: Prisma.Decimal;
  maxDiscountAmount: Prisma.Decimal | null;
  minOrderValue: Prisma.Decimal | null;
  startsAt: Date;
  endsAt: Date | null;
  usageLimitTotal: number | null;
  usageLimitPerCustomer: number | null;
  combinationRules: Prisma.JsonValue | null;
  allowOnDiscountedItems: boolean;
  audienceMinOrders: number | null;
  audienceMaxOrders: number | null;
  audienceMinSpent: Prisma.Decimal | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
