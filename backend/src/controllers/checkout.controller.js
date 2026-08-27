// import { getCheckoutSummaryService, validateCheckoutService, } from "../services/checkout.service.js";
// import { createPaymentService } from "../services/payment.service.js";

// export async function getCheckoutSummary(req, res) {
//     try {
//         const result =
//             await getCheckoutSummaryService(
//                 req.user.id,
//                 req.query.addressId
//             );

//         return res.status(200).json({
//             success: true,
//             data: result,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

// export async function validateCheckout(req, res) {
//     try {
//         const result =
//             await validateCheckoutService(
//                 req.user.id,
//                 req.validatedData?.addressId
//             );

//         const payment = await createPaymentService(
//             req.user.id,
//             req.validatedData.orderId,
//             req.validatedData.method
//         );

//         return res.status(201).json({
//             success: true,
//             message:
//                 "Payment initialized successfully.",
//             data: payment,
//         });

//         // return res.status(200).json({
//         //     success: true,
//         //     data: result,
//         // });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

import {
    getCheckoutSummaryService,
    validateCheckoutService,
} from "../services/checkout.service.js";

import { createOrderService } from "../services/order.service.js";
import { createPaymentService } from "../services/payment.service.js";


// ======================================================
// GET CHECKOUT SUMMARY
// ======================================================

export async function getCheckoutSummary(req, res) {
    try {
        const result = await getCheckoutSummaryService(
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


// ======================================================
// VALIDATE CHECKOUT
// CREATE ORDER
// CREATE PAYMENT
// ======================================================

export async function validateCheckout(req, res) {
    try {
        const {
            addressId,
            paymentMethod,
        } = req.validatedData;

        // ----------------------------------------------
        // 1. Validate checkout
        // ----------------------------------------------

        await validateCheckoutService(
            req.user.id,
            addressId
        );

        // ----------------------------------------------
        // 2. Create order
        // ----------------------------------------------

        const order = await createOrderService(
            req.user.id,
            paymentMethod,
            addressId
        );

        // ----------------------------------------------
        // 3. Create payment
        // ----------------------------------------------

        const payment = await createPaymentService(
            req.user.id,
            order.orderId,
            paymentMethod
        );

        // ----------------------------------------------
        // 4. Return response
        // ----------------------------------------------

        return res.status(201).json({
            success: true,
            message:
                "Checkout validated and payment initialized successfully.",
            data: {
                order,
                payment,
            },
        });

    } catch (error) {
        console.error(
            "Validate checkout error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}