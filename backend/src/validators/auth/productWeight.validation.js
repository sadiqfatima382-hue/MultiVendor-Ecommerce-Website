import { z } from "zod";

export const createProductWeightSchema = z.object({
    value: z.coerce.number().positive("Weight must be greater than 0"),

    unit: z
        .string()
        .trim()
        .min(1, "Unit is required")
        .max(20, "Unit cannot exceed 20 characters"),
});

export const updateProductWeightSchema =
    createProductWeightSchema.partial();