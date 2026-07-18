import { z } from "zod";

export const createVendorSchema = z.object({
    businessName: z
        .string()
        .trim()
        .min(2, "Business name must be atleast 2 characters")
        .max(50, "Business name cannot exceed 50 characters"),

    description: z
        .string()
        .trim()
        .max(5000, "Description cannot exceed 5000 characters")
        .optional(),

    phone: z
        .string()
        .trim()
        .min(7, "Phone number is too short")
        .max(20, "Phone number cannot exceed 20 characters")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .transform((email) => email.toLowerCase())
        .optional(),

    address: z
        .string()
        .trim()
        .max(500, "Address cannot exceed 500 characters")
        .optional(),

    city: z
        .string()
        .trim()
        .optional(),

    country: z
        .string()
        .trim()
        .optional(),
    ownerId: z
        .string()
        .trim()
        .min(1, "Owner ID is required"),
})
export const updateVendorSchema = createVendorSchema.partial();