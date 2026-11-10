import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TTheme } from "@/src/lib/theme/types";
import type { TRootState } from "./store";

interface IThemeState {
  value: TTheme;
  isHydrated: boolean;
}

const initialState: IThemeState = {
  value: "light",
  isHydrated: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    hydrateTheme(state, action: PayloadAction<TTheme>) {
      state.value = action.payload;
      state.isHydrated = true;
    },
    setTheme(state, action: PayloadAction<TTheme>) {
      state.value = action.payload;
      state.isHydrated = true;
    },
    toggleTheme(state) {
      state.value = state.value === "light" ? "dark" : "light";
      state.isHydrated = true;
    },
  },
});

export const { hydrateTheme, setTheme, toggleTheme } = themeSlice.actions;

export const selectTheme = (state: TRootState) => state.theme.value;
export const selectThemeHydrated = (state: TRootState) =>
  state.theme.isHydrated;

export default themeSlice.reducer;
