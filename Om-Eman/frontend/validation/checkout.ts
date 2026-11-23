import { z } from "zod";

const DECIMAL_STRING_PATTERN = /^\d+(\.\d{1,4})?$/;

export const decimalStringSchema = z.string().regex(DECIMAL_STRING_PATTERN);

export const checkoutAddressSchema = z.object({
  governorate: z.string("governorate is required").trim().min(2).max(60),
  city: z.string("city is required").trim().min(2).max(60),
  district: z.string().trim().max(60).optional(),
  street: z.string("street is required").trim().min(2).max(200),
  building: z.string().trim().max(60).optional(),
  floor: z.string().trim().max(60).optional(),
  landmark: z.string().trim().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const checkoutItemSchema = z.object({
  productPackageId: z.string().min(1),
  quantity: z.number().positive().max(1000),
});

export const checkoutFormSchema = z.object({
  phone: z
    .string("phone is required")
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, "phone must be a valid phone number"),
  firstName: z.string().trim().max(60).optional(),
  lastName: z.string().trim().max(60).optional(),
  email: z.string().trim().email().toLowerCase().optional(),
  recipientName: z.string().trim().min(2).max(120),
  address: checkoutAddressSchema,
  items: z.array(checkoutItemSchema).min(1).max(50),
  couponCode: z.string().trim().min(1).max(60).optional(),
  customerNotes: z.string().trim().max(1000).optional(),
  guestToken: z.string().trim().min(10).max(200).optional(),
  paymentMethod: z.enum(["COD", "ONLINE_TRANSFER"], {
    message: "paymentMethod must be COD or ONLINE_TRANSFER",
  }),
});

export const guestCheckoutSchema = checkoutFormSchema;

export const orderTotalsSchema = z.object({
  subtotal: decimalStringSchema,
  discountTotal: decimalStringSchema,
  shippingTotal: decimalStringSchema,
  taxTotal: decimalStringSchema,
  grandTotal: decimalStringSchema,
  currency: z.string().trim().min(3).max(8),
});

export const checkoutResultSchema = z.object({
  orderId: z.string().min(1),
  orderNumber: z.string().min(1),
  trackingToken: z
    .string()
    .regex(/^[A-Za-z0-9_-]{43,64}$/, "tracking token is invalid"),
  paymentMethod: z.enum(["COD", "ONLINE_TRANSFER"]),
  paymentId: z.string().min(1),
  totals: orderTotalsSchema,
});

export type TCheckoutForm = z.infer<typeof checkoutFormSchema>;
