import { z } from "zod";
export const createProductColorSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Product type must be atleast 2 characters")
        .max(50, "Product type cannot exceed 50 characters"),

    hexCode: z
        .string()
        .trim()
        .regex(
            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            "Invalid hex color"
        )
        .optional()

})
export const updateProductColorSchema = createProductColorSchema.partial();