export interface IProductImportFieldError {
  field: string;
  message: string;
}

export interface IProductImportRowError {
  row: number;
  message: string;
  details?: IProductImportFieldError[];
}

export interface IProductImportCreatedProduct {
  id: string;
  nameAr: string;
  slug: string;
  packageSku: string | null;
}

export interface IProductImportResult {
  totalRows: number;
  created: number;
  failed: number;
  createdProducts: IProductImportCreatedProduct[];
  errors: IProductImportRowError[];
}

export type {
  IProductImportRow,
  IProductPackageImportInput,
} from "./validation.js";
