import type { Prisma } from "@prisma/client";
export type {
  ICreateSystemSettingInput,
  IListSystemSettingQuery,
  IUpdateSystemSettingInput,
} from "./validation.js";

export interface ISystemSettingResponse {
  id: string;
  key: string;
  value: Prisma.JsonValue;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
