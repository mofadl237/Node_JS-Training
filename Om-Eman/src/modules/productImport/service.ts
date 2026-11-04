import { Prisma } from "@prisma/client";
import type { ZodIssue } from "zod";
import { prisma } from "../../config/prisma.js";
import { ValidationError } from "../../shared/errors.js";
import { mapPrismaError } from "../../shared/errors/prisma-error.mapper.js";
import { normalizeArabic } from "../../utils/arabic/normalize-arabic.js";
import { cleanProductImportRow, parseProductCsv } from "./csv.js";
import {
  productImportRowSchema,
  productPackageImportSchema,
} from "./validation.js";
import type {
  IProductImportCreatedProduct,
  IProductImportFieldError,
  IProductImportResult,
  IProductImportRow,
  IProductImportRowError,
  IProductPackageImportInput,
} from "./types.js";

const MAX_IMPORT_ROWS = 5000;

const PACKAGE_FIELDS = [
  "barcode",
  "packageNameAr",
  "packageNameEn",
  "sizeValue",
  "sizeUnit",
  "sellingPrice",
  "compareAtPrice",
  "saleEndsAt",
  "stockStatus",
  "isActive",
  "isPublished",
  "sortOrder",
] as const;

interface IProductImportCandidate {
  row: number;
  data: IProductImportRow;
  packageData?: Prisma.ProductPackageCreateWithoutProductInput;
}

function formatIssues(issues: ZodIssue[]): IProductImportFieldError[] {
  return issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join(".") : "row";
    return {
      field,
      message: issue.message || "Validation failed",
    };
  });
}

function validationError(
  row: number,
  issues: ZodIssue[],
): IProductImportRowError {
  const details = formatIssues(issues);
  const first = details[0];
  return {
    row,
    message: first ? `${first.field}: ${first.message}` : "Row validation failed",
    details,
  };
}

function hasPackageFields(data: IProductImportRow): boolean {
  return PACKAGE_FIELDS.some(
    (field) => data[field] !== undefined && data[field] !== null,
  );
}

function buildProductData(
  row: IProductImportRow,
): Prisma.ProductUncheckedCreateInput {
  const searchNameArNormalized =
    row.searchNameArNormalized ?? normalizeArabic(row.nameAr);
  const searchNameEnNormalized =
    row.searchNameEnNormalized ??
    (row.nameEn ? normalizeArabic(row.nameEn) : null);
  const searchText =
    row.searchText ??
    [
      searchNameArNormalized,
      searchNameEnNormalized,
      row.searchKeywords,
      row.brand,
    ]
      .filter((value): value is string => Boolean(value))
      .join(" ");

  return {
    primarySubcategoryId: row.primarySubcategoryId,
    nameAr: row.nameAr,
    slug: row.slug,
    searchNameArNormalized,
    searchNameEnNormalized,
    searchText: searchText.length > 0 ? searchText : null,
    ...(row.nameEn !== undefined ? { nameEn: row.nameEn } : {}),
    ...(row.descriptionAr !== undefined
      ? { descriptionAr: row.descriptionAr }
      : {}),
    ...(row.descriptionEn !== undefined
      ? { descriptionEn: row.descriptionEn }
      : {}),
    ...(row.productType !== undefined ? { productType: row.productType } : {}),
    ...(row.status !== undefined ? { status: row.status } : {}),
    ...(row.brand !== undefined ? { brand: row.brand } : {}),
    ...(row.searchKeywords !== undefined
      ? { searchKeywords: row.searchKeywords }
      : {}),
    ...(row.isFeatured !== undefined ? { isFeatured: row.isFeatured } : {}),
    ...(row.publishedAt !== undefined
      ? { publishedAt: row.publishedAt }
      : {}),
    ...(row.archivedAt !== undefined ? { archivedAt: row.archivedAt } : {}),
  };
}

function buildPackageData(
  pkg: IProductPackageImportInput,
): Prisma.ProductPackageCreateWithoutProductInput {
  return {
    sku: pkg.sku,
    sizeValue: pkg.sizeValue,
    sizeUnit: pkg.sizeUnit,
    sellingPrice: pkg.sellingPrice,
    ...(pkg.barcode !== undefined ? { barcode: pkg.barcode } : {}),
    ...(pkg.nameAr !== undefined ? { nameAr: pkg.nameAr } : {}),
    ...(pkg.nameEn !== undefined ? { nameEn: pkg.nameEn } : {}),
    ...(pkg.compareAtPrice !== undefined
      ? { compareAtPrice: pkg.compareAtPrice }
      : {}),
    ...(pkg.saleEndsAt !== undefined ? { saleEndsAt: pkg.saleEndsAt } : {}),
    ...(pkg.stockStatus !== undefined
      ? { stockStatus: pkg.stockStatus }
      : {}),
    ...(pkg.isActive !== undefined ? { isActive: pkg.isActive } : {}),
    ...(pkg.isPublished !== undefined
      ? { isPublished: pkg.isPublished }
      : {}),
    ...(pkg.sortOrder !== undefined ? { sortOrder: pkg.sortOrder } : {}),
  };
}

export class ProductImportService {
  async importCsv(buffer: Buffer): Promise<IProductImportResult> {
    if (buffer.length === 0) {
      throw new ValidationError("CSV file is empty", "CSV_FILE_EMPTY");
    }

    const rows = await parseProductCsv(buffer);
    if (rows.length === 0) {
      throw new ValidationError(
        "CSV file has no data rows",
        "CSV_NO_DATA_ROWS",
      );
    }
    if (rows.length > MAX_IMPORT_ROWS) {
      throw new ValidationError(
        `CSV file must not contain more than ${MAX_IMPORT_ROWS} rows`,
        "CSV_TOO_MANY_ROWS",
      );
    }

    const errors: IProductImportRowError[] = [];
    const candidates: IProductImportCandidate[] = [];
    const seenSlugs = new Map<string, number>();
    const seenSkus = new Map<string, number>();
    const seenBarcodes = new Map<string, number>();

    for (let index = 0; index < rows.length; index += 1) {
      const rowNumber = index + 2;
      const row = cleanProductImportRow(rows[index] ?? {});
      const parsed = productImportRowSchema.safeParse(row);

      if (!parsed.success) {
        errors.push(validationError(rowNumber, parsed.error.issues));
        continue;
      }

      const data = parsed.data;
      const firstSlugRow = seenSlugs.get(data.slug);
      if (firstSlugRow !== undefined) {
        errors.push({
          row: rowNumber,
          message: `Duplicate slug "${data.slug}" in CSV; first seen at row ${firstSlugRow}`,
        });
        continue;
      }
      seenSlugs.set(data.slug, rowNumber);

      let packageData:
        | Prisma.ProductPackageCreateWithoutProductInput
        | undefined;

      if (data.sku !== undefined) {
        const parsedPackage = productPackageImportSchema.safeParse({
          sku: data.sku,
          barcode: data.barcode,
          nameAr: data.packageNameAr,
          nameEn: data.packageNameEn,
          sizeValue: data.sizeValue,
          sizeUnit: data.sizeUnit,
          sellingPrice: data.sellingPrice,
          compareAtPrice: data.compareAtPrice,
          saleEndsAt: data.saleEndsAt,
          stockStatus: data.stockStatus,
          isActive: data.isActive,
          isPublished: data.isPublished,
          sortOrder: data.sortOrder,
        });

        if (!parsedPackage.success) {
          errors.push(validationError(rowNumber, parsedPackage.error.issues));
          continue;
        }

        const pkg = parsedPackage.data;
        if (
          pkg.compareAtPrice !== undefined &&
          pkg.compareAtPrice !== null &&
          Number(pkg.compareAtPrice) <= Number(pkg.sellingPrice)
        ) {
          errors.push({
            row: rowNumber,
            message: "compareAtPrice must be greater than sellingPrice",
          });
          continue;
        }

        const firstSkuRow = seenSkus.get(pkg.sku);
        if (firstSkuRow !== undefined) {
          errors.push({
            row: rowNumber,
            message: `Duplicate sku "${pkg.sku}" in CSV; first seen at row ${firstSkuRow}`,
          });
          continue;
        }
        seenSkus.set(pkg.sku, rowNumber);

        if (pkg.barcode) {
          const firstBarcodeRow = seenBarcodes.get(pkg.barcode);
          if (firstBarcodeRow !== undefined) {
            errors.push({
              row: rowNumber,
              message: `Duplicate barcode "${pkg.barcode}" in CSV; first seen at row ${firstBarcodeRow}`,
            });
            continue;
          }
          seenBarcodes.set(pkg.barcode, rowNumber);
        }

        packageData = buildPackageData(pkg);
      } else if (hasPackageFields(data)) {
        errors.push({
          row: rowNumber,
          message: "Package fields require a sku",
        });
        continue;
      }

      candidates.push({
        row: rowNumber,
        data,
        ...(packageData !== undefined ? { packageData } : {}),
      });
    }

    if (candidates.length === 0) {
      throw new ValidationError(
        "No valid rows found in CSV",
        "CSV_NO_VALID_ROWS",
        { errors },
      );
    }

    const slugs = candidates.map((candidate) => candidate.data.slug);
    const skus = candidates
      .map((candidate) => candidate.packageData?.sku)
      .filter((sku): sku is string => Boolean(sku));
    const barcodes = candidates
      .map((candidate) => candidate.packageData?.barcode)
      .filter((barcode): barcode is string => Boolean(barcode));
    const subcategoryIds = Array.from(
      new Set(candidates.map((candidate) => candidate.data.primarySubcategoryId)),
    );

    const [
      existingProducts,
      existingPackagesBySku,
      existingPackagesByBarcode,
      existingSubcategories,
    ] = await Promise.all([
      prisma.product.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true },
      }),
      skus.length > 0
        ? prisma.productPackage.findMany({
            where: { sku: { in: skus } },
            select: { sku: true },
          })
        : Promise.resolve([]),
      barcodes.length > 0
        ? prisma.productPackage.findMany({
            where: { barcode: { in: barcodes } },
            select: { barcode: true },
          })
        : Promise.resolve([]),
      prisma.subcategory.findMany({
        where: { id: { in: subcategoryIds } },
        select: { id: true },
      }),
    ]);

    const existingSlugs = new Set(existingProducts.map((item) => item.slug));
    const existingSkus = new Set(existingPackagesBySku.map((item) => item.sku));
    const existingBarcodes = new Set(
      existingPackagesByBarcode
        .map((item) => item.barcode)
        .filter((barcode): barcode is string => Boolean(barcode)),
    );
    const existingSubcategoryIds = new Set(
      existingSubcategories.map((item) => item.id),
    );

    const ready: IProductImportCandidate[] = [];

    for (const candidate of candidates) {
      const reasons: string[] = [];

      if (existingSlugs.has(candidate.data.slug)) {
        reasons.push(`slug "${candidate.data.slug}" already exists`);
      }
      if (!existingSubcategoryIds.has(candidate.data.primarySubcategoryId)) {
        reasons.push(
          `primarySubcategoryId "${candidate.data.primarySubcategoryId}" does not exist`,
        );
      }
      if (candidate.packageData && existingSkus.has(candidate.packageData.sku)) {
        reasons.push(`sku "${candidate.packageData.sku}" already exists`);
      }
      if (
        candidate.packageData?.barcode &&
        existingBarcodes.has(candidate.packageData.barcode)
      ) {
        reasons.push(
          `barcode "${candidate.packageData.barcode}" already exists`,
        );
      }

      if (reasons.length > 0) {
        errors.push({ row: candidate.row, message: reasons.join("; ") });
        continue;
      }

      ready.push(candidate);
    }

    const createdProducts: IProductImportCreatedProduct[] = [];

    for (const candidate of ready) {
      try {
        const created = await prisma.product.create({
          data: {
            ...buildProductData(candidate.data),
            ...(candidate.packageData
              ? { packages: { create: candidate.packageData } }
              : {}),
          },
          select: {
            id: true,
            nameAr: true,
            slug: true,
            packages: { select: { sku: true }, take: 1 },
          },
        });

        createdProducts.push({
          id: created.id,
          nameAr: created.nameAr,
          slug: created.slug,
          packageSku: created.packages[0]?.sku ?? null,
        });
      } catch (error) {
        const mapped = mapPrismaError(error);
        errors.push({
          row: candidate.row,
          message:
            mapped?.message ??
            (error instanceof Error
              ? error.message
              : "Failed to create product"),
        });
      }
    }

    return {
      totalRows: rows.length,
      created: createdProducts.length,
      failed: errors.length,
      createdProducts,
      errors,
    };
  }
}
