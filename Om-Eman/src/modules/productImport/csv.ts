import { Readable } from "node:stream";
import csvParser from "csv-parser";

const HEADER_ALIASES: Record<string, string> = {
  primarysubcategoryid: "primarySubcategoryId",
  primarysubcategory: "primarySubcategoryId",
  subcategoryid: "primarySubcategoryId",
  subcategory: "primarySubcategoryId",
  namear: "nameAr",
  arabicname: "nameAr",
  nameen: "nameEn",
  englishname: "nameEn",
  descriptionar: "descriptionAr",
  arabicdescription: "descriptionAr",
  descriptionen: "descriptionEn",
  englishdescription: "descriptionEn",
  producttype: "productType",
  type: "productType",
  status: "status",
  brand: "brand",
  searchkeywords: "searchKeywords",
  keywords: "searchKeywords",
  searchnamearnormalized: "searchNameArNormalized",
  searchnameennormalized: "searchNameEnNormalized",
  searchtext: "searchText",
  isfeatured: "isFeatured",
  featured: "isFeatured",
  publishedat: "publishedAt",
  archivedat: "archivedAt",
  sku: "sku",
  packagesku: "sku",
  barcode: "barcode",
  packagenamear: "packageNameAr",
  packagenameen: "packageNameEn",
  sizevalue: "sizeValue",
  size: "sizeValue",
  sizeunit: "sizeUnit",
  unit: "sizeUnit",
  sellingprice: "sellingPrice",
  price: "sellingPrice",
  compareatprice: "compareAtPrice",
  compareprice: "compareAtPrice",
  saleendsat: "saleEndsAt",
  stockstatus: "stockStatus",
  isactive: "isActive",
  active: "isActive",
  ispublished: "isPublished",
  published: "isPublished",
  sortorder: "sortOrder",
};

const BOOLEAN_FIELDS = new Set(["isFeatured", "isActive", "isPublished"]);

function normalizeHeader(header: string): string {
  const cleaned = header.replace(/^\uFEFF/, "").trim();
  const key = cleaned.replace(/[\s_-]+/g, "").toLowerCase();
  return HEADER_ALIASES[key] ?? cleaned;
}

function parseBoolean(value: string): boolean | undefined {
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y", "نعم"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "لا"].includes(normalized)) return false;
  return undefined;
}

export function cleanProductImportRow(
  row: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(row)) {
    if (typeof rawValue !== "string") {
      cleaned[key] = rawValue;
      continue;
    }

    const value = rawValue.trim();
    if (value.length === 0) continue;

    if (BOOLEAN_FIELDS.has(key)) {
      const parsed = parseBoolean(value);
      cleaned[key] = parsed ?? value;
      continue;
    }

    if (value.toLowerCase() === "null") {
      cleaned[key] = null;
      continue;
    }

    cleaned[key] = value;
  }

  return cleaned;
}

export function parseProductCsv(
  buffer: Buffer,
): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const rows: Record<string, unknown>[] = [];
    const source = Readable.from([buffer]);

    source
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => normalizeHeader(header),
          mapValues: ({ value }) =>
            typeof value === "string" ? value.trim() : value,
          skipComments: "#",
        }),
      )
      .on("data", (row: Record<string, unknown>) => {
        rows.push(row);
      })
      .on("error", reject)
      .on("end", () => resolve(rows));
  });
}
