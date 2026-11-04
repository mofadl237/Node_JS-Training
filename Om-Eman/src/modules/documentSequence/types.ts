export type {
  ICreateDocumentSequenceInput,
  IListDocumentSequenceQuery,
  IUpdateDocumentSequenceInput,
} from "./validation.js";

export interface IDocumentSequenceResponse {
  id: string;
  documentType: string;
  year: number;
  prefix: string | null;
  nextNumber: number;
  padding: number;
  createdAt: Date;
  updatedAt: Date;
}
