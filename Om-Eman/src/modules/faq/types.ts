export type {
  ICreateFaqInput,
  IListFaqQuery,
  IUpdateFaqInput,
} from "./validation.js";

export interface IFaqResponse {
  id: string;
  questionAr: string;
  questionEn: string | null;
  answerAr: string;
  answerEn: string | null;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
