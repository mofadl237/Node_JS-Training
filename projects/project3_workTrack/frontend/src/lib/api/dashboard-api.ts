import { baseApi } from "./base-api";
import type {
  IApiEnvelope,
  IDashboardQueryParams,
  IDashboardSummary,
  IHrKpiReport,
} from "./types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<
      IDashboardSummary,
      IDashboardQueryParams
    >({
      query: (params) => ({
        url: "/api/dashboard/summary",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IDashboardSummary>) =>
        response.data,
      providesTags: ["Dashboard"],
    }),
    getHrKpiReport: builder.query<IHrKpiReport, IDashboardQueryParams>({
      query: (params) => ({
        url: "/api/dashboard/hr-kpi",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IHrKpiReport>) =>
        response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetHrKpiReportQuery,
} = dashboardApi;
