import { prisma } from "../../../config/prisma.js";
import { NotFoundError } from "../../../shared/errors.js";
import type { ESizeUnit } from "@prisma/client";
import { listRelatedProducts } from "./list.js";
import {
  pricePer100,
  type IStoreProductCard,
  type IStorefrontPackage,
  type IStorefrontProduct,
  type TStoreProductType,
} from "./card.js";

// Storefront product detail, keyed by slug (SEO URLs are /products/[slug]).
// Only what a product page renders: identity, images, published+active
// packages, bundle contents, category refs for breadcrumbs, aliases, and a
// handful of related cards. Ineligible storefront products 404 here (same
// baseline public eligibility as listing) even though dashboard may see them.

export class StoreProductService {
  async getStorefrontDetail(slug: string): Promise<IStorefrontProduct> {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: "ACTIVE",
        OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
        primarySubcategory: { isActive: true, category: { isActive: true } },
      },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        slug: true,
        descriptionAr: true,
        descriptionEn: true,
        productType: true,
        brand: true,
        publishedAt: true,
        updatedAt: true,
        primarySubcategoryId: true,
        images: {
          select: { url: true, altAr: true, altEn: true, isPrimary: true },
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        },
        packages: {
          where: { isActive: true, isPublished: true },
          select: {
            id: true,
            sku: true,
            nameAr: true,
            nameEn: true,
            sizeValue: true,
            sizeUnit: true,
            sellingPrice: true,
            compareAtPrice: true,
            saleEndsAt: true,
            stockStatus: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        bundleComponents: {
          select: {
            quantity: true,
            sortOrder: true,
            componentPackage: {
              select: {
                sku: true,
                nameAr: true,
                sizeValue: true,
                sizeUnit: true,
                sellingPrice: true,
                product: { select: { nameAr: true, slug: true } },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
        aliases: { select: { alias: true }, orderBy: { alias: "asc" } },
        primarySubcategory: {
          select: {
            slug: true,
            nameAr: true,
            nameEn: true,
            category: { select: { slug: true, nameAr: true, nameEn: true } },
          },
        },
      },
    });

    if (!product || product.packages.length === 0) {
      throw new NotFoundError("Product not found", "PRODUCT_NOT_FOUND");
    }

    const related = await listRelatedProducts(
      product.primarySubcategoryId,
      product.id,
    );

    return {
      id: product.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      slug: product.slug,
      descriptionAr: product.descriptionAr,
      descriptionEn: product.descriptionEn,
      productType: product.productType === "PREDEFINED_BUNDLE"
        ? "PREDEFINED_BUNDLE"
        : "FINISHED",
      brand: product.brand,
      aliases: product.aliases.map((alias) => alias.alias),
      publishedAt:
        product.publishedAt !== null
          ? product.publishedAt.toISOString()
          : null,
      updatedAt: product.updatedAt.toISOString(),
      images: product.images,
      packages: product.packages.map((pkg) => ({
        id: pkg.id,
        sku: pkg.sku,
        nameAr: pkg.nameAr,
        nameEn: pkg.nameEn,
        sizeValue: pkg.sizeValue.toString(),
        sizeUnit: pkg.sizeUnit,
        sellingPrice: pkg.sellingPrice.toString(),
        compareAtPrice:
          pkg.compareAtPrice !== null ? pkg.compareAtPrice.toString() : null,
        saleEndsAt:
          pkg.saleEndsAt !== null ? pkg.saleEndsAt.toISOString() : null,
        stockStatus: pkg.stockStatus,
        pricePer100g: pricePer100(pkg.sizeValue, pkg.sizeUnit, pkg.sellingPrice),
      })),
      bundleComponents: product.bundleComponents.map((component) => ({
        quantity: component.quantity.toString(),
        sortOrder: component.sortOrder,
        componentPackage: {
          sku: component.componentPackage.sku,
          nameAr: component.componentPackage.nameAr,
          sizeValue: component.componentPackage.sizeValue.toString(),
          sizeUnit: component.componentPackage.sizeUnit,
          sellingPrice: component.componentPackage.sellingPrice.toString(),
          product: {
            nameAr: component.componentPackage.product.nameAr,
            slug: component.componentPackage.product.slug,
          },
        },
      })),
      category: product.primarySubcategory.category,
      subcategory: {
        slug: product.primarySubcategory.slug,
        nameAr: product.primarySubcategory.nameAr,
        nameEn: product.primarySubcategory.nameEn,
      },
      related,
    };
  }
}
