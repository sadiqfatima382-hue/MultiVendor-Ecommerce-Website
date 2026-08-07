import { z } from "zod";

export const createComponentTypeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must not exceed 100 characters."),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters.")
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  }),
});

export const updateComponentTypeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must not exceed 100 characters.")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters.")
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  }),
});

export const componentTypeIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});