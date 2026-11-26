export type TEmployeeRole = "OWNER" | "ADMIN" | "STAFF";
export type TProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type TProductType = "FINISHED" | "PREDEFINED_BUNDLE";

export interface IEmployee {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: TEmployeeRole;
}

export interface IAdminLoginPayload {
  email: string;
  password: string;
}

export interface IAdminLoginResult {
  employee: IEmployee;
}

export interface IAdminLoginBackendResult extends IAdminLoginResult {
  token: string;
}

export interface IAdminListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IProductRow {
  id: string;
  primarySubcategoryId: string;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  productType: TProductType;
  status: TProductStatus;
  brand: string | null;
  searchNameArNormalized: string | null;
  searchNameEnNormalized: string | null;
  searchKeywords: string | null;
  searchText: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminProxyTarget {
  path: string;
}
