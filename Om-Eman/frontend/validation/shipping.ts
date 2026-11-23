import { z } from "zod";
import { decimalStringSchema } from "./checkout";

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

export const shippingAreaCitySchema = z.object({
  city: z.string().nullable(),
  cost: decimalStringSchema,
  etaMinDays: z.number().int(),
  etaMaxDays: z.number().int(),
});

export const shippingAreaSchema = z.object({
  governorate: z.string().min(1),
  cities: z.array(shippingAreaCitySchema),
});

export const shippingAreasSchema = z.array(shippingAreaSchema);

export const shippingQuoteSchema = z.object({
  cost: decimalStringSchema,
  etaMinDays: z.number().int(),
  etaMaxDays: z.number().int(),
});

export type TShippingQuoteQuery = z.infer<typeof shippingQuoteQuerySchema>;
