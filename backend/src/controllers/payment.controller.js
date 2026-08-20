import {  createPaymentService,  getPaymentByIdService,  getPaymentByOrderService,} from "../services/payment.service.js";

// ==========================================
// CREATE PAYMENT
// ==========================================

export async function createPayment(req, res) {
  try {
    const payment = await createPaymentService(
      req.user.id,
      req.validatedData.orderId,
      req.validatedData.method
    );

    return res.status(201).json({
      success: true,
      message:
        "Payment initialized successfully.",
      data: payment,
    });
  } catch (error) {
    console.error(
      "Create payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ==========================================
// GET PAYMENT BY ID
// ==========================================

export async function getPaymentById(req, res) {
  try {
    const payment =
      await getPaymentByIdService(
        req.user.id,
        req.params.id
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


// ==========================================
// GET PAYMENT BY ORDER
// ==========================================

export async function getPaymentByOrder(
  req,
  res
) {
  try {
    const payment =
      await getPaymentByOrderService(
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