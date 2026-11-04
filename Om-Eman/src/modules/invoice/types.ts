import type { EInvoiceStatus, Prisma } from "@prisma/client";
export type {
  ICreateInvoiceInput,
  IListInvoiceQuery,
  IUpdateInvoiceInput,
} from "./validation.js";

export interface IInvoiceResponse {
  id: string;
  invoiceNumber: string;
  orderId: string;
  status: EInvoiceStatus;
  issuedAt: Date;
  issuedByEmployeeId: string | null;
  sellerName: string;
  sellerTaxNumber: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  addressSnapshot: Prisma.JsonValue | null;
  subtotal: Prisma.Decimal;
  discountTotal: Prisma.Decimal;
  shippingTotal: Prisma.Decimal;
  taxTotal: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
  taxRateSnapshot: Prisma.Decimal | null;
  taxAmount: Prisma.Decimal;
  notes: string | null;
  voidedAt: Date | null;
  voidReason: string | null;
  pdfUrl: string | null;
  pdfGeneratedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
