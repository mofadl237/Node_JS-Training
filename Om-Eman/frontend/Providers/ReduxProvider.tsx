"use client";

import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { store } from "@/store/store";

interface IProps {
  children: ReactNode;
}

export const ReduxProvider = ({ children }: IProps) => <Provider store={store}>{children}</Provider>;
