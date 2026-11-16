import { prisma } from "../../../config/prisma.js";
import {
  resolveShippingTariff,
  listShippingAreas,
  type IShippingArea,
} from "../../../services/shipping.service.js";

// Public shipping endpoints (B9): the configured delivery areas (for the
// checkout address dropdowns) and a live quote for one governorate/city pair.
// The quote resolves through the exact same rule as checkout, so the price the
// customer sees is always the price checkout applies.

export interface IShippingQuoteResponse {
  cost: string;
  etaMinDays: number;
  etaMaxDays: number;
}

export { listShippingAreas, type IShippingArea };

export class StoreShippingService {
  async quote(
    governorate: string,
    city: string,
  ): Promise<IShippingQuoteResponse> {
    const tariff = await resolveShippingTariff(prisma, governorate, city);
    return {
      cost: tariff.baseCost.toString(),
      etaMinDays: tariff.etaMinDays,
      etaMaxDays: tariff.etaMaxDays,
    };
  }
}
