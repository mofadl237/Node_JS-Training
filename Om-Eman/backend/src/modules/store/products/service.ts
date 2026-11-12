import { prisma } from "../../../config/prisma.js";
import { NotFoundError } from "../../../shared/errors.js";

// Storefront product detail, keyed by slug (SEO URLs are /products/[slug]).
// Only what a product page renders: identity, images, published+active
// packages, bundle contents. Draft/inactive products 404 here even though the
// dashboard can still see them.
export class StoreProductService {
  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        slug: true,
        descriptionAr: true,
        descriptionEn: true,
        productType: true,
        brand: true,
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
      },
    });

    if (!product || product.packages.length === 0) {
      throw new NotFoundError("Product not found", "PRODUCT_NOT_FOUND");
    }

    return product;
  }
}
