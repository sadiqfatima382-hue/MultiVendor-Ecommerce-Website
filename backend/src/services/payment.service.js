import { createPayment, findPaymentByOrderId, findPaymentById, } from "../repositories/payment.repository.js";
import { findOrderById, updateOrder, } from "../repositories/order.repository.js";

export async function createPaymentService(
  userId,
  orderId,
  method
) {
  // Find order
  const order = await findOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  // Ownership check
  if (order.userId !== userId) {
    throw new Error(
      "You are not authorized to make payment for this order."
    );
  }

  // Prevent duplicate payment
  const existingPayment = await findPaymentByOrderId(orderId);

  if (existingPayment) {
    throw new Error(
      "Payment already exists for this order."
    );
  }

  // Create payment
  const payment = await createPayment({
    orderId,

    amount: order.grandTotal,

    method,

    status: "PENDING",
  });

  // Keep order synchronized
  await updateOrder(orderId, {
    paymentMethod: method,
    paymentStatus: "PENDING",
  });

  return payment;
}

export async function getPaymentByIdService(
  paymentId
) {
  const payment = await findPaymentById(paymentId);

 if (payment.order.userId !== userId) {
  throw new Error("You are not authorized to access this payment.");
}
  return payment;
}

export async function getPaymentByOrderService(
  userId,
  orderId
) {
  const order = await findOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.userId !== userId) {
    throw new Error(
      "You are not authorized to access this payment."
    );
  }

  const payment = await findPaymentByOrderId(orderId);

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return payment;
}