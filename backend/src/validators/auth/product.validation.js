import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name cannot exceed 200 characters"),

  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description cannot exceed 500 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),

  status: z
    .boolean()
    .optional(),

  categoryId: z
    .string()
    .trim()
    .min(1, "Category is required"),

  brandId: z
    .string()
    .trim()
    .optional(),

  typeId: z
    .string()
    .trim()
    .min(1, "Product type is required"),

  baseId: z
    .string()
    .trim()
    .optional(),

  badgeId: z
    .string()
    .trim()
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();