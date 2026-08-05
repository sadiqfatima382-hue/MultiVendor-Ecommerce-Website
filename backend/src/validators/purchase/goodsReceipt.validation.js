import { z } from "zod";

export const receivePurchaseSchema = z.object({
  body: z.object({
    notes: z
      .string()
      .trim()
      .optional(),
  }),
});