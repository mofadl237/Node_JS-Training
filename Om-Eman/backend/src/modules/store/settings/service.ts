import { prisma } from "../../../config/prisma.js";
import { env } from "../../../config/env.js";

// Public store settings (B5). SystemSetting rows are internal, so this endpoint
// exposes a hard-coded whitelist only - the customer never sees anything else
// (tax internals, employee data, etc.). Missing keys return null: the MVP never
// invents business values.

export interface IStoreContact {
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  workingHours: string | null;
  address: string | null;
}

export interface IStoreSocial {
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
}

export interface IStoreSettings {
  currency: string;
  taxRate: number | null;
  // Free-shipping threshold from settings; null when the store has not
  // configured it (the frontend must not display a fake threshold).
  freeShippingThreshold: string | null;
  contact: IStoreContact;
  social: IStoreSocial;
}

interface ISettingRow {
  key: string;
  value: unknown;
}

const SETTING_KEYS = [
  "TAX_RATE",
  "FREE_SHIPPING_THRESHOLD",
  "STORE_CONTACT",
  "STORE_SOCIAL",
] as const;

function readNumber(value: unknown, field: string): number | null {
  if (value === null || typeof value !== "object") return null;
  const rate = (value as Record<string, unknown>)[field];
  return typeof rate === "number" ? rate : null;
}

function readAmount(value: unknown, field: string): string | null {
  if (value === null || typeof value !== "object") return null;
  const amount = (value as Record<string, unknown>)[field];
  if (typeof amount !== "number") return null;
  return amount.toFixed(4);
}

function readStringMap(
  value: unknown,
  fields: readonly string[],
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const field of fields) {
    result[field] = null;
  }
  if (value === null || typeof value !== "object") return result;
  const record = value as Record<string, unknown>;
  for (const field of fields) {
    const raw = record[field];
    if (typeof raw === "string" && raw.trim() !== "") {
      result[field] = raw.trim();
    }
  }
  return result;
}

export class StoreSettingsService {
  async getPublic(): Promise<IStoreSettings> {
    const rows = await prisma.systemSetting.findMany({
      where: { key: { in: [...SETTING_KEYS] } },
      select: { key: true, value: true },
    });
    const byKey = new Map<string, unknown>(
      rows.map((row: ISettingRow) => [row.key, row.value]),
    );

    const contact = readStringMap(byKey.get("STORE_CONTACT"), [
      "whatsapp",
      "phone",
      "email",
      "workingHours",
      "address",
    ]);
    const social = readStringMap(byKey.get("STORE_SOCIAL"), [
      "facebook",
      "instagram",
      "tiktok",
      "youtube",
    ]);

    const taxRate = readNumber(byKey.get("TAX_RATE"), "rate");

    return {
      currency: env.DEFAULT_CURRENCY,
      taxRate,
      freeShippingThreshold: readAmount(
        byKey.get("FREE_SHIPPING_THRESHOLD"),
        "amount",
      ),
      contact: {
        whatsapp: contact.whatsapp ?? null,
        phone: contact.phone ?? null,
        email: contact.email ?? null,
        workingHours: contact.workingHours ?? null,
        address: contact.address ?? null,
      },
      social: {
        facebook: social.facebook ?? null,
        instagram: social.instagram ?? null,
        tiktok: social.tiktok ?? null,
        youtube: social.youtube ?? null,
      },
    };
  }
}
