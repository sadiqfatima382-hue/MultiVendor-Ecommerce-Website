import {z} from "zod";

export const createPurchaseSchema = z.object({
  body: z.object({
    supplierId: z
      .string()
      .min(1, "Supplier is required."),

    notes: z
      .string()
      .trim()
      .optional(),
  }),
});

export const updatePurchaseSchema = z.object({
  body: z.object({
    supplierId: z
      .string()
      .min(1)
      .optional(),

    notes: z
      .string()
      .trim()
      .optional(),

    discount: z.coerce
      .number()
      .min(0)
      .optional(),

    tax: z
      .number()
      .min(0)
      .optional(),

    shipping: z
      .number()
      .min(0)
      .optional(),
  }),
});

export const addPurchaseItemSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .min(1, "Product is required."),

    productVariantId: z
      .string()
      .min(1, "Variant is required."),

    quantity: z.coerce
      .number()
      .int()
      .positive(),

    unitCost: z.coerce
      .number()
      .positive(),
  }),
});

export const updatePurchaseItemSchema = z.object({
  body: z.object({
    quantity: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    unitCost: z.coerce
      .number()
      .positive()
      .optional(),
  }),
});

export const submitPurchaseSchema = z.object({
  body: z.object({}),
});


export const approvePurchaseSchema = z.object({
  body: z.object({}),
});