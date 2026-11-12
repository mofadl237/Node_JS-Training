import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  IApiMessageResponse,
  ICreateEmployeeShiftPayload,
  ICreateShiftPayload,
  IEmployeeShift,
  IEmployeeShiftListParams,
  IPaginatedResponse,
  IShift,
  IShiftListParams,
  IUpdateEmployeeShiftArgs,
  IUpdateShiftArgs,
} from "./types";

export const shiftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query<IPaginatedResponse<IShift>, IShiftListParams>({
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
    createShift: builder.mutation<IShift, ICreateShiftPayload>({
      query: (body) => ({
        url: "/api/shifts",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IShift>) => response.data,
      invalidatesTags: ["Shifts"],
    }),
    updateShift: builder.mutation<IShift, IUpdateShiftArgs>({
      query: ({ id, body }) => ({
        url: `/api/shifts/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IShift>) => response.data,
      invalidatesTags: ["Shifts"],
    }),
    deleteShift: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/shifts/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IApiMessageResponse) => ({
        message: response.message,
      }),
      invalidatesTags: ["Shifts"],
    }),
    getEmployeeShifts: builder.query<
      IPaginatedResponse<IEmployeeShift>,
      IEmployeeShiftListParams
    >({
      query: (params) => ({
        url: "/api/shifts/assignments",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IEmployeeShift[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Shifts" as const, id: "ASSIGNMENTS" },
              ...result.items.map((assignment) => ({
                type: "Shifts" as const,
                id: assignment.id,
              })),
            ]
          : [{ type: "Shifts" as const, id: "ASSIGNMENTS" }],
    }),
    createEmployeeShift: builder.mutation<
      IEmployeeShift,
      ICreateEmployeeShiftPayload
    >({
      query: (body) => ({
        url: "/api/shifts/assignments",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IEmployeeShift>) =>
        response.data,
      invalidatesTags: ["Shifts"],
    }),
    updateEmployeeShift: builder.mutation<
      IEmployeeShift,
      IUpdateEmployeeShiftArgs
    >({
      query: ({ id, body }) => ({
        url: `/api/shifts/assignments/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IEmployeeShift>) =>
        response.data,
      invalidatesTags: ["Shifts"],
    }),
    deleteEmployeeShift: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/shifts/assignments/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IApiMessageResponse) => ({
        message: response.message,
      }),
      invalidatesTags: ["Shifts"],
    }),
  }),
});

export const {
  useCreateEmployeeShiftMutation,
  useCreateShiftMutation,
  useDeleteEmployeeShiftMutation,
  useDeleteShiftMutation,
  useGetEmployeeShiftsQuery,
  useGetShiftsQuery,
  useUpdateEmployeeShiftMutation,
  useUpdateShiftMutation,
} = shiftsApi;
