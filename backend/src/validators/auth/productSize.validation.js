import { z } from "zod";

export const createProductSizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product size must be at least 2 characters")
    .max(50, "Product size cannot exceed 50 characters"),
});

export const updateProductSizeSchema =
  createProductSizeSchema.partial();