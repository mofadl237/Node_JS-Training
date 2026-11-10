export type {
  ICreateShippingCarrierInput,
  IListShippingCarrierQuery,
  IUpdateShippingCarrierInput,
} from "./validation.js";

export interface IShippingCarrierResponse {
  id: string;
  name: string;
  code: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  supportsApi: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
