import { z } from "zod";

const addressSchema = z.object({
  governorate: z.string().trim().min(2).max(60),
  city: z.string().trim().min(2).max(60),
  district: z.string().trim().max(60).optional(),
  street: z.string().trim().min(2).max(200),
  building: z.string().trim().max(60).optional(),
  floor: z.string().trim().max(60).optional(),
  landmark: z.string().trim().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const guestCheckoutSchema = z.object({
  phone: z
    .string("phone is required")
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, "phone must be a valid phone number"),
  firstName: z.string().trim().max(60).optional(),
  lastName: z.string().trim().max(60).optional(),
  email: z.string().trim().email().toLowerCase().optional(),
  recipientName: z.string().trim().min(2).max(120),
  address: addressSchema,
  items: z
    .array(
      z.object({
        productPackageId: z.string().min(1),
        quantity: z.number().positive().max(1000),
      }),
    )
    .min(1, "at least one item is required")
    .max(50),
  couponCode: z.string().trim().min(1).max(60).optional(),
  customerNotes: z.string().trim().max(1000).optional(),
  guestToken: z.string().trim().min(10).max(200).optional(),
  clientIp: z.string().trim().max(60).optional(),
  paymentMethod: z.enum(["COD", "ONLINE_TRANSFER"], {
    message: "paymentMethod must be COD or ONLINE_TRANSFER",
  }),
});
