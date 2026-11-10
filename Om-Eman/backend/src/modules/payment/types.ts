import type { EPaymentMethod, EPaymentStatus, Prisma } from "@prisma/client";
export type {
  ICreatePaymentInput,
  IListPaymentQuery,
  IUpdatePaymentInput,
} from "./validation.js";

export interface IPaymentResponse {
  id: string;
  orderId: string;
  method: EPaymentMethod;
  status: EPaymentStatus;
  amount: Prisma.Decimal;
  proofImageUrl: string | null;
  proofUploadedAt: Date | null;
  confirmedAt: Date | null;
  confirmedByEmployeeId: string | null;
  rejectionReason: string | null;
  transactionReference: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
