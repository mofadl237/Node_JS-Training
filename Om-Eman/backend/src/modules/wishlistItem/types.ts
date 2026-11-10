export type {
  ICreateWishlistItemInput,
  IListWishlistItemQuery,
  IUpdateWishlistItemInput,
} from "./validation.js";

export interface IWishlistItemResponse {
  id: string;
  customerId: string;
  productPackageId: string;
  createdAt: Date;
}
