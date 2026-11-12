import type { ECustomerStatus } from "@prisma/client";

export interface IStoreCustomer {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  isGuest: boolean;
  emailVerifiedAt: string | Date | null;
  status: ECustomerStatus;
}

export interface ICustomerAuthResponse {
  customer: IStoreCustomer;
  token: string;
  expiresInDays: number;
}

export interface IMessageResponse {
  // Development convenience only: when SMTP is disabled the verification link
  // is returned so the flow can be completed locally. Never returned in
  // production (see store/auth/service.ts).
  devVerificationLink?: string;
}
