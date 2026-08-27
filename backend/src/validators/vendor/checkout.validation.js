import { z } from "zod";

export const validateCheckoutSchema = z.object({
    addressId: z
        .string()
        .cuid("Invalid address ID.")
        .optional(),

    paymentMethod: z
        .enum(["STRIPE", "COD","PAYPAL", "JAZZCASH", "EASYPAISA",], {
            message: "Invalid payment method.",
        }),
});