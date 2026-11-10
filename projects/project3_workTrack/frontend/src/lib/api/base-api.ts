import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { clearSession } from "@/src/Store/auth-slice";
import { tokenStorage } from "@/src/lib/auth/token-storage";
import { API_BASE_URL } from "@/src/lib/config/env";
import type { IApiEnvelope, IAuthResponse, IAuthSession } from "./types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const session = tokenStorage.read();

    headers.set("accept", "application/json");

    if (session?.token) {
      headers.set("authorization", `Bearer ${session.token}`);
    }

    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const session = tokenStorage.read();

  if (!session?.refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clear();
      return null;
    }

    const payload = (await response.json()) as IApiEnvelope<IAuthResponse>;
    const nextSession: IAuthSession = {
      user: payload.data.user,
      token: payload.data.token,
      refreshToken: payload.data.refreshToken,
    };

    tokenStorage.write(nextSession);

    return nextSession.token;
  } catch {
    return null;
  }
};

const getRefreshedToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const isAuthEndpoint = (url: string): boolean =>
  ["/api/auth/login", "/api/auth/refresh", "/api/auth/logout"].some((path) =>
    url.includes(path),
  );

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const url = typeof args === "string" ? args : args.url;

    if (isAuthEndpoint(url)) return result;

    const token = await getRefreshedToken();

    if (token) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      tokenStorage.clear();
      api.dispatch(clearSession());
      api.dispatch(baseApi.util.resetApiState());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Departments",
    "Employees",
    "Attendance",
    "Shifts",
    "Leaves",
    "Dashboard",
    "Audit",
  ],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: () => ({}),
});
