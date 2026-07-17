import { z } from "zod";

export const createProductImageSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Product ID is required"),

  isPrimary: z
    .boolean()
    .optional(),
});

export const updateProductImageSchema = createProductImageSchema.partial();