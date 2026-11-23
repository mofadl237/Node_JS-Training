"use client";

import { useSyncExternalStore } from "react";
import type { IOrderReceipt } from "@/interface";
import { readOrderReceipt } from "@/lib/orderReceipt";

type TReceiptStatus = "loading" | "ready" | "missing";

interface IReceiptSnapshot {
  receipt: IOrderReceipt | null;
  status: TReceiptStatus;
}

const LOADING_SNAPSHOT: IReceiptSnapshot = Object.freeze({
  receipt: null,
  status: "loading",
});
const EMPTY_KEY = "";

let cachedKey = EMPTY_KEY;
let cachedSnapshot: IReceiptSnapshot = LOADING_SNAPSHOT;
let hasRead = false;

const getReceiptKey = (receipt: IOrderReceipt | null): string =>
  receipt ? `${receipt.orderId}:${receipt.trackingToken}:${receipt.storedAt}` : EMPTY_KEY;

const readSnapshot = (): IReceiptSnapshot => {
  const receipt = readOrderReceipt();
  const key = getReceiptKey(receipt);
  if (hasRead && key === cachedKey) return cachedSnapshot;

  hasRead = true;
  cachedKey = key;
  cachedSnapshot = receipt
    ? { receipt, status: "ready" }
    : { receipt: null, status: "missing" };
  return cachedSnapshot;
};

const getSnapshot = (): IReceiptSnapshot =>
  typeof window === "undefined" ? LOADING_SNAPSHOT : readSnapshot();

const getServerSnapshot = (): IReceiptSnapshot => LOADING_SNAPSHOT;

const subscribe = (onStoreChange: () => void): (() => void) => {
  const sync = (): void => onStoreChange();
  window.addEventListener("pageshow", sync);
  window.addEventListener("popstate", sync);
  window.addEventListener("focus", sync);
  return () => {
    window.removeEventListener("pageshow", sync);
    window.removeEventListener("popstate", sync);
    window.removeEventListener("focus", sync);
  };
};

export const useOrderReceipt = (): IReceiptSnapshot =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
