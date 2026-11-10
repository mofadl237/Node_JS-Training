import type { ELanguage } from "@prisma/client";
export type {
  ICreateSearchSynonymInput,
  IListSearchSynonymQuery,
  IUpdateSearchSynonymInput,
} from "./validation.js";

export interface ISearchSynonymResponse {
  id: string;
  groupKey: string;
  term: string;
  normalizedTerm: string;
  language: ELanguage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
