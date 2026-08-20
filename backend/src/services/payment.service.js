// import { createPayment, findPaymentByOrderId, findPaymentById, } from "../repositories/payment.repository.js";
// import { findOrderById, updateOrder, } from "../repositories/order.repository.js";

// export async function createPaymentService(
//   userId,
//   orderId,
//   method
// ) {
//   // Find order
//   const order = await findOrderById(orderId);

//   if (!order) {
//     throw new Error("Order not found.");
//   }

//   // Ownership check
//   if (order.userId !== userId) {
//     throw new Error(
//       "You are not authorized to make payment for this order."
//     );
//   }

//   // Prevent duplicate payment
//   const existingPayment = await findPaymentByOrderId(orderId);

//   if (existingPayment) {
//     throw new Error(
//       "Payment already exists for this order."
//     );
//   }

//   // Create payment
//   const payment = await createPayment({
//     orderId,

//     amount: order.grandTotal,

//     method,

//     status: "PENDING",
//   });

//   // Keep order synchronized
//   await updateOrder(orderId, {
//     paymentMethod: method,
//     paymentStatus: "PENDING",
//   });

//   return payment;
// }

// export async function getPaymentByIdService(
//   paymentId
// ) {
//   const payment = await findPaymentById(paymentId);

//  if (payment.order.userId !== userId) {
//   throw new Error("You are not authorized to access this payment.");
// }
//   return payment;
// }

// export async function getPaymentByOrderService(
//   userId,
//   orderId
// ) {
//   const order = await findOrderById(orderId);

//   if (!order) {
//     throw new Error("Order not found.");
//   }

//   if (order.userId !== userId) {
//     throw new Error(
//       "You are not authorized to access this payment."
//     );
//   }

//   const payment = await findPaymentByOrderId(orderId);

//   if (!payment) {
//     throw new Error("Payment not found.");
//   }

//   return payment;
// }

import stripe from "../config/stripe.js";

import {
  createPayment,
  findPaymentByOrderId,
  findPaymentById,
} from "../repositories/payment.repository.js";

import {
  findOrderById,
  updateOrder,
} from "../repositories/order.repository.js";

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
  const existingPayment =
    await findPaymentByOrderId(orderId);

  if (existingPayment) {
    throw new Error(
      "Payment already exists for this order."
    );
  }

  // ==========================================
  // COD
  // ==========================================

  if (method === "COD") {
    const payment = await createPayment({
      orderId,
      amount: order.grandTotal,
      method: "COD",
      status: "PENDING",
    });

    await updateOrder(orderId, {
      paymentMethod: "COD",
      paymentStatus: "PENDING",
    });

    return {
      payment,
      paymentRequired: false,
    };
  }

  // ==========================================
  // STRIPE
  // ==========================================

  if (method === "STRIPE") {
    // Convert Decimal amount to number
    const amount = Number(order.grandTotal);

    if (!amount || amount <= 0) {
      throw new Error(
        "Invalid order amount."
      );
    }

    // Stripe uses smallest currency unit.
    // Example: $10.50 -> 1050 cents
    const stripeAmount = Math.round(
      amount * 100
    );

    // Create Stripe PaymentIntent
    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: stripeAmount,

        currency:
          process.env.STRIPE_CURRENCY || "usd",

        metadata: {
          orderId,
          userId,
        },

        automatic_payment_methods: {
          enabled: true,
        },
      });

    // Create our database payment
    const payment = await createPayment({
      orderId,

      amount: order.grandTotal,

      method: "STRIPE",

      status: "PENDING",

      transactionId:
        paymentIntent.id,

      gatewayResponse:
        paymentIntent,
    });

    // Keep order synchronized
    await updateOrder(orderId, {
      paymentMethod: "STRIPE",
      paymentStatus: "PENDING",
    });

    return {
      payment,
      paymentRequired: true,
      clientSecret:
        paymentIntent.client_secret,
    };
  }

  // ==========================================
  // Unsupported method
  // ==========================================

  throw new Error(
    `Payment method ${method} is not currently supported.`
  );
}


// ==========================================
// GET PAYMENT BY ID
// ==========================================

export async function getPaymentByIdService(
  userId,
  paymentId
) {
  const payment =
    await findPaymentById(paymentId);

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  if (
    payment.order.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to access this payment."
    );
  }

  return payment;
}


// ==========================================
// GET PAYMENT BY ORDER
// ==========================================

export async function getPaymentByOrderService(
  userId,
  orderId
) {
  const order =
    await findOrderById(orderId);

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  if (order.userId !== userId) {
    throw new Error(
      "You are not authorized to access this payment."
    );
  }

  const payment =
    await findPaymentByOrderId(orderId);

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  return payment;
}