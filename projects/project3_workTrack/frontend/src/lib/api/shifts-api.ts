import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  IPaginatedResponse,
  IShift,
  IShiftListParams,
} from "./types";

export const shiftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query<
      IPaginatedResponse<IShift>,
      IShiftListParams
    >({
      query: (params) => ({
        url: "/api/shifts",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IShift[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Shifts" as const, id: "LIST" },
              ...result.items.map((shift) => ({
                type: "Shifts" as const,
                id: shift.id,
              })),
            ]
          : [{ type: "Shifts" as const, id: "LIST" }],
    }),
  }),
});

export const { useGetShiftsQuery } = shiftsApi;
