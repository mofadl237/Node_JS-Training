import { baseApi } from "./base-api";
import type { IApiEnvelope, IImportResult } from "./types";

const toFormData = (file: File): FormData => {
  const body = new FormData();

  body.append("file", file);

  return body;
};

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    importEmployeesCsv: builder.mutation<IImportResult, File>({
      query: (file) => ({
        url: "/api/uploads/employees",
        method: "POST",
        body: toFormData(file),
      }),
      transformResponse: (response: IApiEnvelope<IImportResult>) =>
        response.data,
      invalidatesTags: ["Employees"],
    }),
    importAttendanceCsv: builder.mutation<IImportResult, File>({
      query: (file) => ({
        url: "/api/uploads/attendance",
        method: "POST",
        body: toFormData(file),
      }),
      transformResponse: (response: IApiEnvelope<IImportResult>) =>
        response.data,
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useImportAttendanceCsvMutation,
  useImportEmployeesCsvMutation,
} = uploadsApi;
