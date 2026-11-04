export type {
  ICreateCouponInput,
  IListCouponQuery,
  IUpdateCouponInput,
} from "./validation.js";

export interface ICouponResponse {
  id: string;
  promotionId: string;
  code: string;
  customerId: string | null;
  usageLimit: number | null;
  perCustomerLimit: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
