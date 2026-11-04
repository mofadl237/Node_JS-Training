import type { Prisma } from "@prisma/client";
export type {
  ICreateInvoiceLineInput,
  IListInvoiceLineQuery,
  IUpdateInvoiceLineInput,
} from "./validation.js";

export interface IInvoiceLineResponse {
  id: string;
  invoiceId: string;
  orderItemId: string | null;
  productPackageId: string | null;
  descriptionAr: string;
  descriptionEn: string | null;
  sku: string;
  quantity: Prisma.Decimal;
  unitPrice: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  taxRate: Prisma.Decimal | null;
  taxAmount: Prisma.Decimal;
  lineTotal: Prisma.Decimal;
  createdAt: Date;
}
