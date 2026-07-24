import { z } from "zod";

export const validateCheckoutSchema = z.object({
  addressId: z
    .string()
    .cuid("Invalid address ID.")
    .optional(),
});