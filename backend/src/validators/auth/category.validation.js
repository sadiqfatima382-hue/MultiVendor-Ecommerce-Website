import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  image: z
    .string()
    .trim()
    .optional(),

  parentId: z
    .string()
    .cuid("Invalid parent category ID.")
    .optional(),
});