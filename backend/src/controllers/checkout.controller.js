import { getCheckoutSummaryService, validateCheckoutService, } from "../services/checkout.service.js";

export async function getCheckoutSummary(req, res) {
    try {
        const result =
            await getCheckoutSummaryService(
                req.user.id,
                req.query.addressId
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function validateCheckout(req, res) {
    try {
        const result =
            await validateCheckoutService(
                req.user.id,
                req.validatedData?.addressId
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}