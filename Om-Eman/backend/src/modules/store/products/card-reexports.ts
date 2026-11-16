// Tiny re-export barrel so the search module shares the product-list SQL
// without importing deep internals.
export {
  SELECT_FRAGMENT,
  JOIN_FRAGMENT,
} from "./list.js";
export { mapListRowToCard } from "./card.js";
export type {
  IListRow,
  IStoreProductCard,
  IStoreProductImageSnapshot,
  IStoreProductPrice,
  IStoreProductCategoryRef,
  TStoreProductType,
} from "./card.js";
