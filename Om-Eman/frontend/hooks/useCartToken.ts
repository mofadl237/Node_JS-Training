"use client";

import { useSyncExternalStore } from "react";
import { getServerCartToken, readCartToken, subscribeCartToken } from "@/lib/cartToken";

export const useCartToken = (): string | undefined =>
  useSyncExternalStore(subscribeCartToken, readCartToken, getServerCartToken);
