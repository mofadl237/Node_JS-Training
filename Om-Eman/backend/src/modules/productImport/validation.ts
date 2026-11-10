import { z } from "zod";
import { createProductPackageSchema } from "../productPackage/validation.js";
import { createProductSchema } from "../product/validation.js";

const csvBoolean = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return value;

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y", "نعم"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "لا"].includes(normalized)) return false;
  return value;
}, z.boolean());

const packageShape = createProductPackageSchema.omit({ productId: true }).shape;

export const productImportRowSchema = createProductSchema.extend({
  isFeatured: csvBoolean.optional(),
  sku: packageShape.sku.optional(),
  barcode: packageShape.barcode,
  packageNameAr: packageShape.nameAr,
  packageNameEn: packageShape.nameEn,
  sizeValue: packageShape.sizeValue.optional(),
  sizeUnit: packageShape.sizeUnit.optional(),
  sellingPrice: packageShape.sellingPrice.optional(),
  compareAtPrice: packageShape.compareAtPrice,
  saleEndsAt: packageShape.saleEndsAt,
  stockStatus: packageShape.stockStatus,
  isActive: csvBoolean.optional(),
  isPublished: csvBoolean.optional(),
  sortOrder: packageShape.sortOrder,
});

export const productPackageImportSchema = createProductPackageSchema.omit({
  productId: true,
});

export type IProductImportRow = z.infer<typeof productImportRowSchema>;
export type IProductPackageImportInput = z.infer<
  typeof productPackageImportSchema
>;
