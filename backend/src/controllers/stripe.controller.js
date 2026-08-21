import stripe from "../config/stripe.js";

import {
  updatePayment,
  findPaymentByOrderId,
} from "../repositories/payment.repository.js";

import {
  updateOrder,
} from "../repositories/order.repository.js";

export async function stripeWebhook(req, res) {
  const signature =
    req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    switch (event.type) {

      // ========================================
      // PAYMENT SUCCEEDED
      // ========================================

      case "payment_intent.succeeded": {
        const paymentIntent =
          event.data.object;

        const orderId =
          paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.error(
            "❌ Stripe PaymentIntent has no orderId metadata."
          );

          break;
        }

        const payment =
          await findPaymentByOrderId(
            orderId
          );

        if (!payment) {
          console.error(
            `❌ Payment not found for order ${orderId}`
          );

          break;
        }

        // Prevent duplicate webhook processing
        if (payment.status === "PAID") {
          console.log(
            `ℹ️ Payment already marked as PAID: ${payment.id}`
          );

          break;
        }

        await updatePayment(
          payment.id,
          {
            status: "PAID",

            transactionId:
              paymentIntent.id,

            gatewayResponse:
              paymentIntent,

            paidAt: new Date(),
          }
        );

        await updateOrder(
          orderId,
          {
            paymentStatus: "PAID",
          }
        );

        console.log(
          `✅ Stripe payment successful for order ${orderId}`
        );

        break;
      }


      // ========================================
      // PAYMENT FAILED
      // ========================================

      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data.object;

        const orderId =
          paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.error(
            "❌ Stripe PaymentIntent has no orderId metadata."
          );

          break;
        }

        const payment =
          await findPaymentByOrderId(
            orderId
          );

        if (!payment) {
          console.error(
            `❌ Payment not found for order ${orderId}`
          );

          break;
        }

        await updatePayment(
          payment.id,
          {
            status: "FAILED",

            transactionId:
              paymentIntent.id,

            gatewayResponse:
              paymentIntent,
          }
        );

        await updateOrder(
          orderId,
          {
            paymentStatus: "FAILED",
          }
        );

        console.log(
          `❌ Stripe payment failed for order ${orderId}`
        );

        break;
      }


      default:
        console.log(
          `ℹ️ Unhandled Stripe event: ${event.type}`
        );
    }

    return res.status(200).json({
      received: true,
    });

  } catch (error) {
    console.error(
      "❌ Stripe webhook processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
}