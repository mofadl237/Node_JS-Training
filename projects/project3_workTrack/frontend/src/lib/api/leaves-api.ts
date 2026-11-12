import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  IApiMessageResponse,
  ICreateLeavePayload,
  ILeave,
  ILeaveListParams,
  IPaginatedResponse,
  IUpdateLeaveArgs,
} from "./types";

export const leavesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query<IPaginatedResponse<ILeave>, ILeaveListParams>({
      query: (params) => ({
        url: "/api/leaves",
        params,
      }),
      transformResponse: (response: IApiEnvelope<ILeave[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Leaves" as const, id: "LIST" },
              ...result.items.map((leave) => ({
                type: "Leaves" as const,
                id: leave.id,
              })),
            ]
          : [{ type: "Leaves" as const, id: "LIST" }],
    }),
    createLeave: builder.mutation<ILeave, ICreateLeavePayload>({
      query: (body) => ({
        url: "/api/leaves",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<ILeave>) => response.data,
      invalidatesTags: ["Leaves"],
    }),
    updateLeave: builder.mutation<ILeave, IUpdateLeaveArgs>({
      query: ({ id, body }) => ({
        url: `/api/leaves/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: IApiEnvelope<ILeave>) => response.data,
      invalidatesTags: ["Leaves"],
    }),
    deleteLeave: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/leaves/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IApiMessageResponse) => ({
        message: response.message,
      }),
      invalidatesTags: ["Leaves"],
    }),
  }),
});

export const {
  useCreateLeaveMutation,
  useDeleteLeaveMutation,
  useGetLeavesQuery,
  useUpdateLeaveMutation,
} = leavesApi;
