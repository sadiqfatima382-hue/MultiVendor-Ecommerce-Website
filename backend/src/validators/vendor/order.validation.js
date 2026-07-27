import { z } from "zod";

export const createOrderSchema = z.object({
  paymentMethod: z.enum([
    "COD",
    "STRIPE",
    "PAYPAL",
    "JAZZCASH",
    "EASYPAISA",
  ]),
});