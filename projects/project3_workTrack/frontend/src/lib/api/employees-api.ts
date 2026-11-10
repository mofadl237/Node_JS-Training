import { baseApi } from "./base-api";
import { buildFallbackMeta } from "./pagination";
import type {
  IApiEnvelope,
  ICreateEmployeePayload,
  IEmployee,
  IEmployeeListParams,
  IPaginatedResponse,
  IUpdateEmployeeArgs,
} from "./types";

export const employeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      IPaginatedResponse<IEmployee>,
      IEmployeeListParams
    >({
      query: (params) => ({
        url: "/api/employees",
        params,
      }),
      transformResponse: (response: IApiEnvelope<IEmployee[]>) => ({
        items: response.data,
        meta: response.meta ?? buildFallbackMeta(response.data.length),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Employees" as const, id: "LIST" },
              ...result.items.map((employee) => ({
                type: "Employees" as const,
                id: employee.id,
              })),
            ]
          : [{ type: "Employees" as const, id: "LIST" }],
    }),
    getEmployeeById: builder.query<IEmployee, string>({
      query: (id) => `/api/employees/${id}`,
      transformResponse: (response: IApiEnvelope<IEmployee>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Employees", id }],
    }),
    createEmployee: builder.mutation<IEmployee, ICreateEmployeePayload>({
      query: (body) => ({
        url: "/api/employees",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IEmployee>) => response.data,
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation<IEmployee, IUpdateEmployeeArgs>({
      query: ({ id, body }) => ({
        url: `/api/employees/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IEmployee>) => response.data,
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} = employeesApi;
