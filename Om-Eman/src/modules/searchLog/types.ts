export type {
  ICreateSearchLogInput,
  IListSearchLogQuery,
  IUpdateSearchLogInput,
} from "./validation.js";

export interface ISearchLogResponse {
  id: string;
  rawQuery: string;
  normalizedQuery: string;
  resultCount: number;
  customerId: string | null;
  sessionId: string | null;
  clickedProductId: string | null;
  createdAt: Date;
}
