import { z } from "zod";

export interface IDepartmentValidationMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  descriptionMax: string;
}

export interface IDepartmentFormValues {
  name: string;
  description: string;
}

export const createDepartmentSchema = (
  messages: IDepartmentValidationMessages,
) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameMin)
      .max(100, messages.nameMax),
    description: z.string().trim().max(500, messages.descriptionMax),
  });
