import { z } from "zod";

export const createProductVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, "SKU must be at least 3 characters")
    .max(100, "SKU cannot exceed 100 characters"),

  price: z
    .coerce
    .number()
    .positive("Price must be greater than 0"),

  comparePrice: z
    .coerce
    .number()
    .positive("Compare price must be greater than 0")
    .optional(),

  stock: z
    .coerce
    .number()
    .int()
    .min(0, "Stock cannot be negative"),

  productId: z
    .string()
    .trim()
    .min(1, "Product is required"),

  sizeId: z
    .string()
    .trim()
    .optional(),

  colorId: z
    .string()
    .trim()
    .optional(),

  weightId: z
    .string()
    .trim()
    .optional(),
});

export const updateProductVariantSchema =
  createProductVariantSchema.partial();