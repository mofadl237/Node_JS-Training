import type { ENotificationRecipientType, ENotificationChannel, ENotificationType, ENotificationStatus, Prisma } from "@prisma/client";
export type {
  ICreateNotificationInput,
  IListNotificationQuery,
  IUpdateNotificationInput,
} from "./validation.js";

export interface INotificationResponse {
  id: string;
  recipientType: ENotificationRecipientType;
  customerId: string | null;
  employeeId: string | null;
  channel: ENotificationChannel;
  notificationType: ENotificationType;
  title: string;
  body: string;
  status: ENotificationStatus;
  idempotencyKey: string | null;
  sentAt: Date | null;
  readAt: Date | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}
