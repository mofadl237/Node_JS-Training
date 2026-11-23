import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type {
  IPaymentProofPayload,
  IPaymentProofResult,
  IProofSignPayload,
  IUploadSignature,
} from "@/interface";
import {
  paymentProofResultSchema,
  paymentProofSchema,
  proofSignSchema,
  uploadSignatureSchema,
} from "@/validation/paymentProof";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signProof: build.mutation<IUploadSignature, IProofSignPayload>({
      query: (payload) => ({
        url: "/uploads/sign-proof",
        method: "POST",
        body: proofSignSchema.parse(payload),
      }),
      transformResponse: (response: IApiSuccess<IUploadSignature>) =>
        uploadSignatureSchema.parse(unwrapEnvelope(response).data),
    }),
    submitProof: build.mutation<IPaymentProofResult, IPaymentProofPayload>({
      query: (payload) => ({
        url: "/store/payments/proof",
        method: "POST",
        body: paymentProofSchema.parse(payload),
      }),
      transformResponse: (response: IApiSuccess<IPaymentProofResult>) =>
        paymentProofResultSchema.parse(unwrapEnvelope(response).data),
    }),
  }),
  overrideExisting: false,
});

export const { useSignProofMutation, useSubmitProofMutation } = paymentApi;
