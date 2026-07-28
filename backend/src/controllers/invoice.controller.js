import { createInvoiceService, getInvoiceByIdService, getInvoiceByOrderService, } from "../services/invoice.service.js";

export async function createInvoice(req, res) {
    try {
        const invoice = await createInvoiceService(
            req.params.orderId
        );

        return res.status(201).json({
            success: true,
            message: "Invoice generated successfully.",
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getInvoiceById(req, res) {
    try {
        const invoice = await getInvoiceByIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getInvoiceByOrder(req, res) {
    try {
        const invoice = await getInvoiceByOrderService(
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}