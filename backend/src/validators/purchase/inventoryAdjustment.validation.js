import { z } from "zod";

export const createInventoryAdjustmentSchema =
    z.object({
        body: z.object({
            reason: z
                .string()
                .trim()
                .min(3),

            notes: z
                .string()
                .trim()
                .optional(),

            items: z
                .array(
                    z.object({
                        productVariantId:
                            z.string().cuid(),

                        adjustedStock:
                            z.number().int().min(0),
                    })
                )
                .min(1),
        }),
    });