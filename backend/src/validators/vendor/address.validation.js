import { z } from "zod";

export const createAddressSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters.")
        .max(100, "Full name cannot exceed 100 characters."),

    phone: z
        .string()
        .trim()
        .min(10, "Phone number is invalid.")
        .max(20, "Phone number cannot exceed 20 characters."),

    country: z
        .string()
        .trim()
        .min(2, "Country is required.")
        .max(100, "Country cannot exceed 100 characters."),

    state: z
        .string()
        .trim()
        .min(2, "State is required.")
        .max(100, "State cannot exceed 100 characters."),

    city: z
        .string()
        .trim()
        .min(2, "City is required.")
        .max(100, "City cannot exceed 100 characters."),

    postalCode: z
        .string()
        .trim()
        .max(20, "Postal code cannot exceed 20 characters.")
        .optional(),

    addressLine1: z
        .string()
        .trim()
        .min(5, "Address is required.")
        .max(255, "Address cannot exceed 255 characters."),

    addressLine2: z
        .string()
        .trim()
        .max(255, "Address cannot exceed 255 characters.")
        .optional(),

    landmark: z
        .string()
        .trim()
        .max(255, "Landmark cannot exceed 255 characters.")
        .optional(),

    type: z.enum(["HOME", "OFFICE", "OTHER"]),

    label: z
        .string()
        .trim()
        .max(50, "Label cannot exceed 50 characters.")
        .optional(),

    isDefault: z
        .boolean()
        .optional(),
});
export const updateAddressSchema = createAddressSchema.partial();