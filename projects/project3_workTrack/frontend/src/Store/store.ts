import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/src/lib/api/base-api";
import authReducer from "./auth-slice";
import themeReducer from "./theme-slice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
};

export type TAppStore = ReturnType<typeof makeStore>;
export type TRootState = ReturnType<TAppStore["getState"]>;
export type TAppDispatch = TAppStore["dispatch"];
