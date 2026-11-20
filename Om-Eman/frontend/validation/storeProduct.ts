import { z } from "zod";

const decimalString = z.string().regex(/^\d+(?:\.\d+)?$/);
const categoryRefSchema = z.object({
  slug: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().nullable(),
});
const imageSnapshotSchema = z.object({
  url: z.string().min(1),
  altAr: z.string().nullable(),
  altEn: z.string().nullable(),
});
const productCardSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().nullable(),
  brand: z.string().nullable(),
  productType: z.enum(["FINISHED", "PREDEFINED_BUNDLE"]),
  isFeatured: z.boolean(),
  primaryImage: imageSnapshotSchema.nullable(),
  secondaryImage: z.object({ url: z.string().min(1) }).nullable(),
  price: z.object({
    from: decimalString,
    compareAtFrom: decimalString.nullable(),
    hasMultiplePackages: z.boolean(),
  }),
  defaultPackageId: z.string().min(1),
  saleEndsAt: z.string().nullable(),
  inStock: z.boolean(),
  subcategory: categoryRefSchema,
  category: categoryRefSchema,
});

export const storefrontProductSchema = z.object({
  id: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().nullable(),
  slug: z.string().min(1),
  descriptionAr: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  productType: z.enum(["FINISHED", "PREDEFINED_BUNDLE"]),
  brand: z.string().nullable(),
  aliases: z.array(z.string()),
  publishedAt: z.string().nullable(),
  updatedAt: z.string().min(1),
  images: z.array(
    z.object({
      url: z.string().min(1),
      altAr: z.string().nullable(),
      altEn: z.string().nullable(),
      isPrimary: z.boolean(),
    }),
  ),
  packages: z.array(
    z.object({
      id: z.string().min(1),
      sku: z.string().min(1),
      nameAr: z.string().nullable(),
      nameEn: z.string().nullable(),
      sizeValue: decimalString,
      sizeUnit: z.enum(["G", "KG", "ML", "L", "PIECE", "PACK", "OTHER"]),
      sellingPrice: decimalString,
      compareAtPrice: decimalString.nullable(),
      saleEndsAt: z.string().nullable(),
      stockStatus: z.string().min(1),
      pricePer100g: decimalString.nullable(),
    }),
  ),
  bundleComponents: z.array(
    z.object({
      quantity: decimalString,
      sortOrder: z.number().int(),
      componentPackage: z.object({
        sku: z.string().min(1),
        nameAr: z.string().nullable(),
        sizeValue: decimalString,
        sizeUnit: z.enum(["G", "KG", "ML", "L", "PIECE", "PACK", "OTHER"]),
        sellingPrice: decimalString,
        product: z.object({ nameAr: z.string().min(1), slug: z.string().min(1) }),
      }),
    }),
  ),
  category: categoryRefSchema,
  subcategory: categoryRefSchema,
  related: z.array(productCardSchema),
});
