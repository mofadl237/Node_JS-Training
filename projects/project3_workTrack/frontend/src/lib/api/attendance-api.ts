import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  IApiMessageResponse,
  IAttendanceLog,
  IAttendanceLogListParams,
  IAttendanceProcessPayload,
  IAttendanceProcessResult,
  IAttendanceRecord,
  IAttendanceRecordListParams,
  ICreateAttendanceRecordPayload,
  IPaginatedResponse,
  IUpdateAttendanceRecordArgs,
} from "./types";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceLogs: builder.query<
      IPaginatedResponse<IAttendanceLog>,
      IAttendanceLogListParams
    >({
      query: (params) => ({
        url: "/api/attendance/logs",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IAttendanceLog[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Attendance" as const, id: "LOGS" },
              ...result.items.map((log) => ({
                type: "Attendance" as const,
                id: log.id,
              })),
            ]
          : [{ type: "Attendance" as const, id: "LOGS" }],
    }),
    getAttendanceRecords: builder.query<
      IPaginatedResponse<IAttendanceRecord>,
      IAttendanceRecordListParams
    >({
      query: (params) => ({
        url: "/api/attendance/records",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IAttendanceRecord[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Attendance" as const, id: "RECORDS" },
              ...result.items.map((record) => ({
                type: "Attendance" as const,
                id: record.id,
              })),
            ]
          : [{ type: "Attendance" as const, id: "RECORDS" }],
    }),
    createAttendanceRecord: builder.mutation<
      IAttendanceRecord,
      ICreateAttendanceRecordPayload
    >({
      query: (body) => ({
        url: "/api/attendance/records",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IAttendanceRecord>) =>
        response.data,
      invalidatesTags: [{ type: "Attendance", id: "RECORDS" }],
    }),
    updateAttendanceRecord: builder.mutation<
      IAttendanceRecord,
      IUpdateAttendanceRecordArgs
    >({
      query: ({ id, body }) => ({
        url: `/api/attendance/records/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IAttendanceRecord>) =>
        response.data,
      invalidatesTags: [{ type: "Attendance", id: "RECORDS" }],
    }),
    deleteAttendanceRecord: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/attendance/records/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IApiMessageResponse) => ({
        message: response.message,
      }),
      invalidatesTags: [{ type: "Attendance", id: "RECORDS" }],
    }),
    processAttendance: builder.mutation<
      IAttendanceProcessResult,
      IAttendanceProcessPayload
    >({
      query: (body) => ({
        url: "/api/attendance/process",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IAttendanceProcessResult>) =>
        response.data,
      invalidatesTags: [{ type: "Attendance", id: "RECORDS" }],
    }),
  }),
});

export const {
  useCreateAttendanceRecordMutation,
  useDeleteAttendanceRecordMutation,
  useGetAttendanceLogsQuery,
  useGetAttendanceRecordsQuery,
  useProcessAttendanceMutation,
  useUpdateAttendanceRecordMutation,
} = attendanceApi;
