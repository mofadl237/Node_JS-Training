import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  IAdminLoginResult,
  IApiError,
  IEmployee,
  IProductRow,
  IUnwrapped,
} from "@/interface";
import {
  adminProductListUrl,
  requestAdmin,
  type IAdminProductListArgs,
} from "@/lib/adminClientFetch";
import {
  adminEmptyResultSchema,
  adminEmployeeSchema,
  adminLoginResultSchema,
  type TAdminLoginForm,
} from "@/validation/adminLogin";
import {
  adminPaginationMetaSchema,
  adminProductListSchema,
} from "@/validation/adminProduct";

export const dashboardApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery<IApiError>(),
  tagTypes: ["AdminSession", "AdminProducts"],
  endpoints: (build) => ({
    loginEmployee: build.mutation<IUnwrapped<IAdminLoginResult>, TAdminLoginForm>({
      queryFn: (body) =>
        requestAdmin({
          url: "/api/session",
          method: "POST",
          body,
          schema: adminLoginResultSchema,
        }),
      invalidatesTags: ["AdminSession", "AdminProducts"],
    }),
    getEmployeeSession: build.query<IUnwrapped<IEmployee>, void>({
      queryFn: () =>
        requestAdmin({
          url: "/api/session",
          method: "GET",
          schema: adminEmployeeSchema,
        }),
      providesTags: ["AdminSession"],
    }),
    logoutEmployee: build.mutation<IUnwrapped<null>, void>({
      queryFn: () =>
        requestAdmin({
          url: "/api/session",
          method: "DELETE",
          schema: adminEmptyResultSchema,
        }),
      invalidatesTags: ["AdminSession", "AdminProducts"],
    }),
    getAdminProducts: build.query<IUnwrapped<IProductRow[]>, IAdminProductListArgs>({
      queryFn: (args) =>
        requestAdmin({
          url: adminProductListUrl(args),
          method: "GET",
          schema: adminProductListSchema,
          metaSchema: adminPaginationMetaSchema,
        }),
      providesTags: ["AdminProducts"],
    }),
  }),
});

export default dashboardApi.reducer;

export const {
  useGetEmployeeSessionQuery,
  useLoginEmployeeMutation,
  useLogoutEmployeeMutation,
  useGetAdminProductsQuery,
} = dashboardApi;
