import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  IApiMessageResponse,
  ICreateDepartmentPayload,
  IDepartment,
  IDepartmentListParams,
  IPaginatedResponse,
  IUpdateDepartmentPayload,
} from "./types";

interface IUpdateDepartmentArgs {
  id: string;
  body: IUpdateDepartmentPayload;
}

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<
      IPaginatedResponse<IDepartment>,
      IDepartmentListParams
    >({
      query: (params) => ({
        url: "/api/departments",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IDepartment[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Departments" as const, id: "LIST" },
              ...result.items.map((department) => ({
                type: "Departments" as const,
                id: department.id,
              })),
            ]
          : [{ type: "Departments" as const, id: "LIST" }],
    }),
    getDepartmentById: builder.query<IDepartment, string>({
      query: (id) => `/api/departments/${id}`,
      transformResponse: (response: IApiEnvelope<IDepartment>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Departments", id }],
    }),
    getDepartmentEmployeeCount: builder.query<number, string>({
      query: (departmentId) => ({
        url: "/api/employees",
        params: { departmentId, page: 1, limit: 1 },
      }),
      transformResponse: (response: IApiEnvelope<unknown[]>) =>
        response.meta?.total ?? 0,
      providesTags: ["Employees"],
    }),
    createDepartment: builder.mutation<
      IDepartment,
      ICreateDepartmentPayload
    >({
      query: (body) => ({
        url: "/api/departments",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IDepartment>) => response.data,
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation<IDepartment, IUpdateDepartmentArgs>({
      query: ({ id, body }) => ({
        url: `/api/departments/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IDepartment>) => response.data,
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/departments/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IApiMessageResponse) => ({
        message: response.message,
      }),
      invalidatesTags: ["Departments", "Employees"],
    }),
  }),
});

export const {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByIdQuery,
  useGetDepartmentEmployeeCountQuery,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} = departmentsApi;
