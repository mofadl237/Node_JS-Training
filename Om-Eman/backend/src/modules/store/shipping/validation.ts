import { z } from "zod";

// Arabic or Latin names with common punctuation (Cairo / القاهرة).
const AREA_NAME_PATTERN = /^[\u0600-\u06FF\sA-Za-z()()-]{2,60}$/;

export const shippingQuoteQuerySchema = z.object({
  governorate: z
    .string("governorate is required")
    .trim()
    .min(2)
    .max(60)
    .regex(AREA_NAME_PATTERN, "governorate name is invalid"),
  city: z
    .string("city is required")
    .trim()
    .min(2)
    .max(60)
    .regex(AREA_NAME_PATTERN, "city name is invalid"),
});

export type IShippingQuoteQuery = z.infer<typeof shippingQuoteQuerySchema>;
