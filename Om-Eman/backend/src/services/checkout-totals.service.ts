import { Prisma } from "@prisma/client";
import type { ITransactionClient } from "./document-number.service.js";
import { resolveCoupon } from "./coupon.service.js";
import { resolveShippingTariff } from "./shipping.service.js";

// Money rules for checkout: coupon discount, shipping tariff, tax rate, and
// the grand total. Extracted from guest-checkout.service.ts so each file
// stays under the 200-line limit.

export interface IOrderTotals {
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  taxTotal: string;
  grandTotal: string;
  currency: string;
}

export interface IAddressSnapshotInput {
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

// Reads the single tax rate from SystemSetting. Missing setting = no tax;
// the MVP never invents a rate.
async function readTaxRate(tx: ITransactionClient): Promise<number> {
  const setting = await tx.systemSetting.findUnique({
    where: { key: "TAX_RATE" },
    select: { value: true },
  });
  const raw = setting?.value as { rate?: unknown } | null | undefined;
  const rate = typeof raw?.rate === "number" ? raw.rate : 0;
  return Math.max(0, Math.min(rate, 1));
}

// Resolves the coupon, the shipping tariff, and the tax rate in one place so
// checkout and any future payment re-calculation use identical arithmetic.
export async function computeCheckoutTotals(
  tx: ITransactionClient,
  params: {
    couponCode?: string | undefined;
    customerId: string;
    subtotal: Prisma.Decimal;
    address: IAddressSnapshotInput;
  },
): Promise<{
  discountTotal: Prisma.Decimal;
  shippingTotal: Prisma.Decimal;
  taxTotal: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
  coupon: Awaited<ReturnType<typeof resolveCoupon>>;
}> {
  const coupon = await resolveCoupon(
    tx,
    params.couponCode,
    params.customerId,
    params.subtotal,
  );
  const discountTotal = coupon?.discount ?? new Prisma.Decimal(0);

  const shipping = await resolveShippingTariff(
    tx,
    params.address.governorate,
    params.address.city,
  );
  const shippingTotal = shipping.baseCost;

  const taxRate = await readTaxRate(tx);
  const taxable = params.subtotal.minus(discountTotal);
  const taxTotal = taxable.mul(taxRate);
  const grandTotal = taxable.add(shippingTotal).add(taxTotal);

  return { discountTotal, shippingTotal, taxTotal, grandTotal, coupon };
}

// The order keeps an immutable copy of the delivery address (AGENTS.md rule
// 5): old orders must stay correct when the customer edits their addresses.
export function buildOrderAddressSnapshot(
  address: IAddressSnapshotInput,
  phone: string,
  recipientName: string,
): Prisma.OrderAddressSnapshotCreateWithoutOrderInput {
  return {
    recipientName,
    phone,
    governorate: address.governorate,
    city: address.city,
    district: address.district ?? null,
    street: address.street,
    building: address.building ?? null,
    floor: address.floor ?? null,
    landmark: address.landmark ?? null,
    latitude:
      address.latitude !== undefined
        ? new Prisma.Decimal(address.latitude.toFixed(4))
        : null,
    longitude:
      address.longitude !== undefined
        ? new Prisma.Decimal(address.longitude.toFixed(4))
        : null,
  };
}
