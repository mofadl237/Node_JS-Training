import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  IAuditLog,
  IAuditLogListParams,
  IPaginatedResponse,
} from "./types";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<
      IPaginatedResponse<IAuditLog>,
      IAuditLogListParams
    >({
      query: (params) => ({
        url: "/api/audit-logs",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IAuditLog[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Audit" as const, id: "LIST" },
              ...result.items.map((log) => ({
                type: "Audit" as const,
                id: log.id,
              })),
            ]
          : [{ type: "Audit" as const, id: "LIST" }],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
