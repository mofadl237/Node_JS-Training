"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Provider } from "react-redux";
import { PageLoader } from "@/src/components/ui/PageLoader/PageLoader";
import { makeStore, type TAppStore } from "./store";

interface IStoreProviderProps {
  children: ReactNode;
}

let clientStore: TAppStore | null = null;

const getClientStore = (): TAppStore | null => {
  if (typeof window === "undefined") return null;

  if (!clientStore) {
    clientStore = makeStore();
  }

  return clientStore;
};

const getServerStore = (): TAppStore | null => null;

const subscribe = () => () => {};

export function StoreProvider({ children }: IStoreProviderProps) {
  const store = useSyncExternalStore(
    subscribe,
    getClientStore,
    getServerStore,
  );

  if (!store) {
    return <PageLoader />;
  }

  return <Provider store={store}>{children}</Provider>;
}
