import { z } from "zod";

export const createBrandSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Brand name must be at least 2 characters")
        .max(100, "Brand name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

    logo: z
        .string()
        .trim()
        .optional(),

    status: z
        .boolean()
        .optional()
});

export const updateBrandSchema = createBrandSchema.partial();