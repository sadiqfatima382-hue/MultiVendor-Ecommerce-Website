import { z } from "zod";

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().trim().min(3),

    name: z.string().trim().min(3),

    description: z.string().optional(),

    discountType: z.enum([
      "FIXED",
      "PERCENTAGE",
    ]),

    discountValue: z.number().positive(),

    minimumOrderAmount:
      z.number().nonnegative().optional(),

    maximumDiscount:
      z.number().positive().optional(),

    usageLimit:
      z.number().int().positive().optional(),

    perUserLimit:
      z.number().int().positive(),

    startsAt:
      z.coerce.date().optional(),

    expiresAt:
      z.coerce.date().optional(),

    isActive:
      z.boolean().optional(),
  }),
});

export const updateCouponSchema =
  createCouponSchema.partial();

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string(),

    subtotal: z.number().positive(),
  }),
});