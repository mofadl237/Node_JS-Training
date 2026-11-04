import type { EMarketingEventName, Prisma, EMarketingEventStatus } from "@prisma/client";
export type {
  ICreateMarketingEventInput,
  IListMarketingEventQuery,
  IUpdateMarketingEventInput,
} from "./validation.js";

export interface IMarketingEventResponse {
  id: string;
  eventName: EMarketingEventName;
  eventId: string;
  customerId: string | null;
  sessionId: string | null;
  orderId: string | null;
  productId: string | null;
  productPackageId: string | null;
  value: Prisma.Decimal | null;
  contentIds: Prisma.JsonValue | null;
  searchString: string | null;
  fbp: string | null;
  fbc: string | null;
  clientIp: string | null;
  clientUserAgent: string | null;
  eventSourceUrl: string | null;
  hashedUserData: Prisma.JsonValue | null;
  status: EMarketingEventStatus;
  attempts: number;
  lastError: string | null;
  sentAt: Date | null;
  occurredAt: Date;
  createdAt: Date;
}
