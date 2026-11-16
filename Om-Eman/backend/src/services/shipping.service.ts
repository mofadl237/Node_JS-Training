import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { BadRequestError } from "../shared/errors.js";
import type { ITransactionClient } from "./document-number.service.js";

// Cheapest active tariff for the governorate/city pair. Missing tariff rows
// mean free shipping is NOT implied - it means the store has not configured
// that area yet, and callers must fail loudly instead of guessing.
//
// This is the single source of the pricing rule: checkout and the public
// shipping quote must resolve the exact same tariff.

export interface IResolvedShippingTariff {
  baseCost: Prisma.Decimal;
  etaMinDays: number;
  etaMaxDays: number;
}

export async function resolveShippingTariff(
  client: ITransactionClient,
  governorate: string,
  city: string,
): Promise<IResolvedShippingTariff> {
  const tariff = await client.shippingTariff.findFirst({
    where: {
      isActive: true,
      governorate,
      OR: [
        { city },
        { city: null },
      ],
      carrier: { isActive: true },
    },
    orderBy: { baseCost: "asc" },
    select: { baseCost: true, etaMinDays: true, etaMaxDays: true },
  });

  if (!tariff) {
    throw new BadRequestError(
      `No shipping tariff configured for ${governorate} / ${city}`,
      "SHIPPING_AREA_NOT_CONFIGURED",
    );
  }

  return tariff;
}

export interface IShippingAreaCity {
  city: string | null;
  cost: string;
  etaMinDays: number;
  etaMaxDays: number;
}

export interface IShippingArea {
  governorate: string;
  cities: IShippingAreaCity[];
}

// Public list of configured delivery areas, used to build the checkout
// address dropdowns. Only active tariffs of active carriers are exposed, so
// customers can never select an area checkout would reject.
export async function listShippingAreas(): Promise<IShippingArea[]> {
  const tariffs = await prisma.shippingTariff.findMany({
    where: { isActive: true, carrier: { isActive: true } },
    orderBy: [{ governorate: "asc" }, { baseCost: "asc" }],
    select: {
      governorate: true,
      city: true,
      baseCost: true,
      etaMinDays: true,
      etaMaxDays: true,
    },
  });

  const areaMap = new Map<string, IShippingArea>();
  const seenPairs = new Set<string>();

  for (const tariff of tariffs) {
    const pairKey = `${tariff.governorate}::${tariff.city ?? ""}`;
    // The query is ordered by baseCost ascending, so the first row per
    // (governorate, city) pair is the cheapest - keep it.
    if (seenPairs.has(pairKey)) continue;
    seenPairs.add(pairKey);

    let area = areaMap.get(tariff.governorate);
    if (!area) {
      area = { governorate: tariff.governorate, cities: [] };
      areaMap.set(tariff.governorate, area);
    }
    area.cities.push({
      city: tariff.city,
      cost: tariff.baseCost.toString(),
      etaMinDays: tariff.etaMinDays,
      etaMaxDays: tariff.etaMaxDays,
    });
  }

  return [...areaMap.values()].sort((a, b) =>
    a.governorate.localeCompare(b.governorate),
  );
}
