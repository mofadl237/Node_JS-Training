import { z } from "zod";

export interface ILoginValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}

export interface ILoginFormValues {
  email: string;
  password: string;
}

export const createLoginSchema = (messages: ILoginValidationMessages) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  });
