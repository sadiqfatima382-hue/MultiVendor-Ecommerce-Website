import { z } from "zod";

export const createVendorConfigSchema = z.object({
  logo: z.string().url().optional(),

  banner: z.string().url().optional(),

  storeDescription: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  businessEmail: z
    .email()
    .optional(),

  businessPhone: z
    .string()
    .trim()
    .optional(),

  facebook: z.string().url().optional(),

  instagram: z.string().url().optional(),

  twitter: z.string().url().optional(),

  linkedin: z.string().url().optional(),

  youtube: z.string().url().optional(),

  returnPolicy: z.string().optional(),

  shippingPolicy: z.string().optional(),

  privacyPolicy: z.string().optional(),

  termsConditions: z.string().optional(),

  metaTitle: z
    .string()
    .max(100)
    .optional(),

  metaDescription: z
    .string()
    .max(160)
    .optional(),

  metaKeywords: z.string().optional(),
});

export const updateVendorConfigSchema =
  createVendorConfigSchema.partial();