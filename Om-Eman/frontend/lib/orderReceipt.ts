import type { ICheckoutResult, IOrderReceipt } from "@/interface";
import { orderReceiptSchema } from "@/validation/orderReceipt";

const ORDER_RECEIPT_KEY = "oe.order.receipt";

export const saveOrderReceipt = (result: ICheckoutResult): IOrderReceipt => {
  const receipt: IOrderReceipt = {
    ...result,
    storedAt: new Date().toISOString(),
  };
  orderReceiptSchema.parse(receipt);
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(ORDER_RECEIPT_KEY, JSON.stringify(receipt));
  }
  return receipt;
};

export const readOrderReceipt = (): IOrderReceipt | null => {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ORDER_RECEIPT_KEY);
  if (!raw) return null;
  try {
    const parsedJson: unknown = JSON.parse(raw);
    const parsed = orderReceiptSchema.safeParse(parsedJson);
    if (!parsed.success) {
      window.sessionStorage.removeItem(ORDER_RECEIPT_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    window.sessionStorage.removeItem(ORDER_RECEIPT_KEY);
    return null;
  }
};

export const clearOrderReceipt = (): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(ORDER_RECEIPT_KEY);
  }
};
