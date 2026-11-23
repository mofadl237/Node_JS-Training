export type TCheckoutPaymentMethod = "COD" | "ONLINE_TRANSFER";

export type TPaymentStatus =
  | "PENDING"
  | "PROOF_UPLOADED"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELED";

export interface ICheckoutAddress {
  governorate: string;
  city: string;
  district?: string;
  street: string;
  building?: string;
  floor?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface ICheckoutItem {
  productPackageId: string;
  quantity: number;
}

export interface IGuestCheckoutPayload {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  recipientName: string;
  address: ICheckoutAddress;
  items: ICheckoutItem[];
  couponCode?: string;
  customerNotes?: string;
  guestToken?: string;
  paymentMethod: TCheckoutPaymentMethod;
}

export interface IOrderTotals {
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  taxTotal: string;
  grandTotal: string;
  currency: string;
}

export interface ICheckoutResult {
  orderId: string;
  orderNumber: string;
  trackingToken: string;
  paymentMethod: TCheckoutPaymentMethod;
  paymentId: string;
  totals: IOrderTotals;
}

export interface ICheckoutCartLine {
  package: { id: string } | null;
  quantity: string;
}

export interface IShippingAreaCity {
  city: string | null;
  cost: string;
  etaMinDays: number;
  etaMaxDays: number;
}

export interface IShippingArea {
  governorate: string;
  cities: IShippingAreaCity[];
}

export interface IShippingQuoteQuery {
  governorate: string;
  city: string;
}

export interface IShippingQuote {
  cost: string;
  etaMinDays: number;
  etaMaxDays: number;
}

export interface ICouponPreviewPayload {
  couponCode: string;
  items: ICheckoutItem[];
}

export interface ICouponPreview {
  valid: boolean;
  couponCode: string;
  discountType: string;
  discount: string;
  subtotal: string;
  discountedSubtotal: string;
}

export interface IProofSignPayload {
  orderId: string;
  trackingToken: string;
}

export interface IUploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  uploadUrl: string;
}

export interface IPaymentProofPayload {
  orderId: string;
  trackingToken: string;
  method: "ONLINE_TRANSFER";
  amount: number;
  proofImageUrl: string;
  transactionReference?: string;
}

export interface IPaymentProofResult {
  paymentId: string;
  paymentStatus: TPaymentStatus;
}

export interface IOrderReceipt extends ICheckoutResult {
  storedAt: string;
}
