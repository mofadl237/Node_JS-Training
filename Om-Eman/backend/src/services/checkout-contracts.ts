import type { ICheckoutItemInput } from "./checkout-items.service.js";
import type {
  IAddressSnapshotInput,
  IOrderTotals,
} from "./checkout-totals.service.js";

// The contract types shared by the guest-checkout service, the checkout
// controller, and the customer-claim checkout. Kept in one file so the
// orchestration service stays under the 200-line limit.

export type IGuestAddressInput = IAddressSnapshotInput;

export type TCheckoutPaymentMethod = "COD" | "ONLINE_TRANSFER";

export interface IGuestCheckoutInput {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  recipientName: string;
  address: IGuestAddressInput;
  items: ICheckoutItemInput[];
  couponCode?: string;
  customerNotes?: string;
  // How the customer intends to pay. COD creates a pending Payment row that
  // an employee settles; ONLINE_TRANSFER creates the pending row the customer
  // then attaches a transfer-proof image to.
  paymentMethod: TCheckoutPaymentMethod;
  // Guest cart token; when provided the checked-out cart is marked CHECKED_OUT.
  guestToken?: string;
  clientIp?: string;
  clientUserAgent?: string;
}

export interface IGuestCheckoutResult {
  orderId: string;
  orderNumber: string;
  trackingToken: string;
  paymentMethod: TCheckoutPaymentMethod;
  paymentId: string;
  totals: IOrderTotals;
}
