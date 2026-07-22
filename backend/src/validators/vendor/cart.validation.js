import { z } from "zod";

export const addToCartSchema = z.object({
  productVariantId: z
    .string()
    .trim()
    .min(1, "Product variant is required."),

  quantity: z
    .number()
    .int("Quantity must be an integer.")
    .min(1, "Quantity must be at least 1."),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be an integer.")
    .min(1, "Quantity must be at least 1."),
});