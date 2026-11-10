import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthSession, IAuthUser } from "@/src/lib/api/types";
import type { TRootState } from "./store";

interface IAuthState {
  user: IAuthUser | null;
  isHydrated: boolean;
}

const initialState: IAuthState = {
  user: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<IAuthSession | null>) {
      state.user = action.payload?.user ?? null;
      state.isHydrated = true;
    },
    setSession(state, action: PayloadAction<IAuthSession>) {
      state.user = action.payload.user;
      state.isHydrated = true;
    },
    clearSession(state) {
      state.user = null;
      state.isHydrated = true;
    },
  },
});

export const { hydrate, setSession, clearSession } = authSlice.actions;

export const selectCurrentUser = (state: TRootState) => state.auth.user;
export const selectIsAuthenticated = (state: TRootState) =>
  state.auth.user !== null;
export const selectIsHydrated = (state: TRootState) =>
  state.auth.isHydrated;

export default authSlice.reducer;
