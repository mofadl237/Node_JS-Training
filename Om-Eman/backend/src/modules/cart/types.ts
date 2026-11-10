import type { ECartStatus } from "@prisma/client";
export type {
  ICreateCartInput,
  IListCartQuery,
  IUpdateCartInput,
} from "./validation.js";

export interface ICartResponse {
  id: string;
  customerId: string | null;
  guestToken: string | null;
  status: ECartStatus;
  mergedIntoCartId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
