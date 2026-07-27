import { createPaymentService, getPaymentByIdService, getPaymentByOrderService, } from "../services/payment.service.js";

export async function createPayment(req, res) {
    try {
        const payment = await createPaymentService(
            req.user.id,
            req.validatedData.orderId,
            req.validatedData.method
        );

        return res.status(201).json({
            success: true,
            message: "Payment created successfully.",
            data: payment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getPaymentById(req, res) {
    try {
        const payment = await getPaymentByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getPaymentByOrder(req, res) {
    try {
        const payment = await getPaymentByOrderService(
            req.user.id,
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}