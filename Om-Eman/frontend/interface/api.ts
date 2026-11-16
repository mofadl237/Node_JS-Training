export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IEnvelopeFailure {
  success: false;
  message: string;
  code: string;
}

export type IApiResponse<T> = IApiSuccess<T> | IEnvelopeFailure;

export interface IApiError {
  status: number;
  message: string;
  code: string;
}

export interface IUnwrapped<T> {
  data: T;
  meta?: IPaginationMeta;
}

export interface IPaginated<T> {
  items: T[];
  meta: IPaginationMeta;
}
