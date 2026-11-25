export type TCustomerStatus = "ACTIVE" | "BLOCKED" | "MERGED";

export interface IStoreCustomer {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  isGuest: boolean;
  emailVerifiedAt: string | null;
  status: TCustomerStatus;
}

export interface ICustomerAuthResponse {
  customer: IStoreCustomer;
  token: string;
  expiresInDays: number;
}

export interface ICustomerMessageResponse {
  devVerificationLink?: string;
}

export interface IRegisterCustomerPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface IVerifyEmailPayload {
  token: string;
}

export interface ICustomerLoginPayload {
  email: string;
  password: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
}

export interface IMergeCartPayload {
  guestToken: string;
}

export interface IMergeCartResult {
  mergedCartId: string | null;
}
