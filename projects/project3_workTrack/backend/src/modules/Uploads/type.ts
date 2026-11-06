import type { ERole, EUploadType } from "@prisma/client";

export interface IUploadUserSummary {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export interface IUploadedFileResponse {
  id: string;
  fileName: string;
  originalName: string;
  type: EUploadType;
  uploadedById: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  createdAt: Date;
  uploadedBy: IUploadUserSummary;
}

export interface IImportRowError {
  row: number;
  employeeCode?: string;
  message: string;
}

export interface IImportResult {
  upload: IUploadedFileResponse;
  errors: IImportRowError[];
}
