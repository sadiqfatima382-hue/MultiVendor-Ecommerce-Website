import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z
    .string()
    .trim()
    .min(1, "Order ID is required."),

  method: z.enum([
    "COD",
    "STRIPE",
    "PAYPAL",
    "JAZZCASH",
    "EASYPAISA",
  ]),
});