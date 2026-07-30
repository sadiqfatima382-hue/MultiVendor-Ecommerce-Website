import { z } from "zod";

export const productIdSchema = z.object({
  params: z.object({
    productId: z.string().cuid("Invalid product id."),
  }),
});