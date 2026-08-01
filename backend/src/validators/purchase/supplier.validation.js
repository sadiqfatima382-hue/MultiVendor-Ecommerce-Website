import { z } from "zod";

export const createSupplierSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    email: z
      .email()
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .optional(),

    company: z
      .string()
      .trim()
      .max(100)
      .optional(),

    address: z
      .string()
      .trim()
      .max(500)
      .optional(),
  }),
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    email: z
      .email()
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .optional(),

    company: z
      .string()
      .trim()
      .max(100)
      .optional(),

    address: z
      .string()
      .trim()
      .max(500)
      .optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE"])
      .optional(),
  }),
});

export const supplierIdSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});