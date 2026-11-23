"use client";

import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TPaymentStatus } from "@/interface";
import { useOrderReceipt } from "@/hooks/useOrderReceipt";
import { isApiError } from "@/lib/cartError";
import { resolveCheckoutErrorKey } from "@/lib/checkoutError";
import { uploadProofImage } from "@/lib/proofUpload";
import { useSignProofMutation, useSubmitProofMutation } from "@/store/paymentApi";

interface IProofUploadState {
  errorKey: string | undefined;
  paymentStatus: TPaymentStatus | undefined;
  isBusy: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReferenceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
}

const resolveProofErrorKey = (error: unknown): string => {
  if (isApiError(error)) {
    if (error.status === 429) return "payment.errors.rateLimited";
    if (error.status === 0) return "payment.errors.networkUnclear";
  }
  return resolveCheckoutErrorKey(error, "payment.errors.unexpected");
};

export const useProofUpload = (): IProofUploadState => {
  const { receipt } = useOrderReceipt();
  const [signProof, signState] = useSignProofMutation();
  const [submitProof, submitState] = useSubmitProofMutation();
  const [file, setFile] = useState<File | null>(null);
  const [transactionReference, setTransactionReference] = useState("");
  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<TPaymentStatus | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const inFlight = useRef(false);

  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setErrorKey(undefined);
  }, []);

  const onReferenceChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTransactionReference(event.target.value);
    setErrorKey(undefined);
  }, []);

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (
        inFlight.current ||
        paymentStatus ||
        isUploading ||
        signState.isLoading ||
        submitState.isLoading
      ) {
        return;
      }

      if (receipt?.paymentMethod !== "ONLINE_TRANSFER") {
        setErrorKey("payment.errors.methodNotOnline");
        return;
      }
      if (!file) {
        setErrorKey("payment.errors.fileRequired");
        return;
      }

      inFlight.current = true;
      setIsUploading(true);
      setErrorKey(undefined);

      const amount = Number(receipt.totals.grandTotal);
      if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
        inFlight.current = false;
        setIsUploading(false);
        setErrorKey("payment.errors.invalidAmount");
        return;
      }

      void (async () => {
        try {
          const signature = await signProof({
            orderId: receipt.orderId,
            trackingToken: receipt.trackingToken,
          }).unwrap();
          const upload = await uploadProofImage({ file, signature });
          if (!upload.ok) {
            setErrorKey(upload.errorKey);
            return;
          }

          const trimmedReference = transactionReference.trim();
          const result = await submitProof({
            orderId: receipt.orderId,
            trackingToken: receipt.trackingToken,
            method: "ONLINE_TRANSFER",
            amount,
            proofImageUrl: upload.secureUrl,
            ...(trimmedReference ? { transactionReference: trimmedReference } : {}),
          }).unwrap();

          if (result.paymentStatus === "PROOF_UPLOADED") {
            setPaymentStatus(result.paymentStatus);
            setErrorKey(undefined);
          } else {
            setErrorKey("payment.errors.unexpectedStatus");
          }
        } catch (error) {
          setErrorKey(resolveProofErrorKey(error));
        } finally {
          inFlight.current = false;
          setIsUploading(false);
        }
      })();
    },
    [
      file,
      isUploading,
      paymentStatus,
      receipt,
      signProof,
      signState.isLoading,
      submitProof,
      submitState.isLoading,
      transactionReference,
    ],
  );

  return {
    errorKey,
    paymentStatus,
    isBusy: isUploading || signState.isLoading || submitState.isLoading,
    onFileChange,
    onReferenceChange,
    submit,
  };
};
