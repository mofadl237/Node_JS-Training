"use client";

import { useCallback, useState } from "react";
import type { SerializedError } from "@reduxjs/toolkit";
import { useOrderReceipt } from "@/hooks/useOrderReceipt";
import type { ITrackedOrder } from "@/interface";
import type { IApiError } from "@/interface/api";
import { useGetTrackedOrderQuery } from "@/store/trackApi";
import { trackingTokenSchema } from "@/validation/track";

export type TTrackLookupStatus =
  | "initial"
  | "loading"
  | "success"
  | "empty"
  | "validation"
  | "notFound"
  | "rateLimited"
  | "network"
  | "error";

export type TTrackErrorKey =
  | "track.errors.validation"
  | "track.errors.notFound"
  | "track.errors.rateLimited"
  | "track.errors.network"
  | "track.errors.unexpected";

interface IManualLookup {
  attempted: boolean;
  token: string | null;
  invalid: boolean;
}

export interface IUseTrackLookupResult {
  status: TTrackLookupStatus;
  order: ITrackedOrder | null;
  errorKey: TTrackErrorKey | null;
  isLoading: boolean;
  hasReceipt: boolean;
  isUsingReceipt: boolean;
  lookup: (value: string) => boolean;
  useReceipt: () => void;
}

const INITIAL_MANUAL: IManualLookup = Object.freeze({
  attempted: false,
  token: null,
  invalid: false,
});

const resolveErrorKey = (error: IApiError | SerializedError): TTrackErrorKey => {
  if (!("status" in error)) return "track.errors.unexpected";
  if (error.status === 0) return "track.errors.network";
  if (error.status === 429 || error.code === "TOO_MANY_REQUESTS") {
    return "track.errors.rateLimited";
  }
  if (error.status === 404 || error.code === "ORDER_NOT_FOUND") {
    return "track.errors.notFound";
  }
  if (error.status === 400 || error.code === "VALIDATION_ERROR") {
    return "track.errors.validation";
  }
  return "track.errors.unexpected";
};

const resolveErrorStatus = (key: TTrackErrorKey): TTrackLookupStatus => {
  if (key === "track.errors.validation") return "validation";
  if (key === "track.errors.notFound") return "notFound";
  if (key === "track.errors.rateLimited") return "rateLimited";
  if (key === "track.errors.network") return "network";
  return "error";
};

export const useTrackLookup = (): IUseTrackLookupResult => {
  const { receipt, status: receiptStatus } = useOrderReceipt();
  const [manual, setManual] = useState<IManualLookup>(INITIAL_MANUAL);

  const receiptToken = receipt?.trackingToken ?? null;
  const token = manual.attempted ? manual.token : receiptToken;
  const skipQuery =
    (receiptStatus === "loading" && !manual.attempted) || manual.invalid || token === null;

  const { data, error, isFetching, isLoading: isQueryLoading, isSuccess, refetch } =
    useGetTrackedOrderQuery(token ?? "", {
      skip: skipQuery,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  const lookup = useCallback(
    (value: string): boolean => {
      const parsed = trackingTokenSchema.safeParse(value.trim());
      if (!parsed.success) {
        setManual({ attempted: true, token: null, invalid: true });
        return false;
      }
      if (parsed.data === token) {
        void refetch();
        return true;
      }
      setManual({ attempted: true, token: parsed.data, invalid: false });
      return true;
    },
    [refetch, token],
  );

  const useReceipt = useCallback((): void => {
    setManual(INITIAL_MANUAL);
  }, []);

  let status: TTrackLookupStatus = "initial";
  let errorKey: TTrackErrorKey | null = null;

  if (manual.invalid) {
    errorKey = "track.errors.validation";
    status = "validation";
  } else if (isFetching || isQueryLoading || (receiptStatus === "loading" && !manual.attempted)) {
    status = "loading";
  } else if (isSuccess) {
    status = data ? "success" : "empty";
  } else if (error) {
    errorKey = resolveErrorKey(error);
    status = resolveErrorStatus(errorKey);
  }

  return {
    status,
    order: data ?? null,
    errorKey,
    isLoading: status === "loading",
    hasReceipt: receiptToken !== null,
    isUsingReceipt: !manual.attempted && receiptToken !== null,
    lookup,
    useReceipt,
  };
};
