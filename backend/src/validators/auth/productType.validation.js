import{z} from "zod";
export const createProductTypeSchema = z.object({
    name:z
    .string()
    .trim()
    .min(2,"Product type must be atleast 2 characters")
    .max(50,"Product type cannot exceed 50 characters")
})
export const updateProductTypeSchema = createProductTypeSchema.partial();