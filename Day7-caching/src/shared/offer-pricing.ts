/**
 * Shared offer/money helpers.
 *
 * All arithmetic runs on Prisma.Decimal (decimal.js) so 0.1 + 0.2 problems
 * never reach prices or order totals. `roundMoney` is the only place money is
 * rounded (2 decimals, HALF_UP).
 */
import { Prisma } from "../generated/prisma/client.js";

export function activeOfferDateWhere(now = new Date()): Prisma.OfferWhereInput {
  return {
    AND: [
      { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
      { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
    ],
  };
}

export function roundMoney(value: Prisma.Decimal): Prisma.Decimal {
  return value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

export function applyPercentage(
  price: Prisma.Decimal,
  discountPercent: Prisma.Decimal,
): Prisma.Decimal {
  const hundred = new Prisma.Decimal(100);
  return roundMoney(price.mul(hundred.minus(discountPercent)).div(hundred));
}
