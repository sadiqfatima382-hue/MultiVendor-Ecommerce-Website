import stripe from "../config/stripe.js";
import { updatePayment, findPaymentByOrderId, } from "../repositories/payment.repository.js";
import { updateOrder, } from "../repositories/order.repository.js";

export async function stripeWebhook(req, res) {
  const signature =
    req.headers["stripe-signature"];

  let event;

  /*
  |--------------------------------------------------------------------------
  | Verify Stripe Webhook
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | Process Stripe Event
  |--------------------------------------------------------------------------
  */

  try {
    switch (event.type) {

      // =====================================================
      // CHECKOUT COMPLETED
      // =====================================================

      case "checkout.session.completed": {

        const session =
          event.data.object;

        const orderId =
          session.metadata?.orderId;

        const paymentId =
          session.metadata?.paymentId;


        if (!orderId || !paymentId) {
          console.error(
            "❌ Checkout Session is missing orderId or paymentId metadata."
          );

          break;
        }


        /*
        |--------------------------------------------------------------------------
        | Find Payment
        |--------------------------------------------------------------------------
        */

        const payment =
          await findPaymentByOrderId(orderId);


        if (!payment) {
          console.error(
            `❌ Payment not found for order ${orderId}`
          );

          break;
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Processing
        |--------------------------------------------------------------------------
        */

        if (payment.status === "PAID") {
          console.log(
            `ℹ️ Payment already marked as PAID: ${payment.id}`
          );

          break;
        }


        /*
        |--------------------------------------------------------------------------
        | Update Payment
        |--------------------------------------------------------------------------
        */

        await updatePayment(
          payment.id,
          {
            status: "PAID",

            transactionId:
              session.payment_intent,

            stripeSessionId:
              session.id,

            gatewayResponse:
              session,

            paidAt: new Date(),
          }
        );


        /*
        |--------------------------------------------------------------------------
        | Update Order
        |--------------------------------------------------------------------------
        */

        await updateOrder(
          orderId,
          {
            paymentStatus: "PAID",
          }
        );


        console.log(
          `✅ Stripe Checkout payment successful for order ${orderId}`
        );

        break;
      }


      // =====================================================
      // CHECKOUT EXPIRED
      // =====================================================

      case "checkout.session.expired": {

        const session =
          event.data.object;

        const orderId =
          session.metadata?.orderId;


        if (!orderId) {
          console.error(
            "❌ Expired Checkout Session has no orderId metadata."
          );

          break;
        }


        const payment =
          await findPaymentByOrderId(orderId);


        if (!payment) {
          console.error(
            `❌ Payment not found for order ${orderId}`
          );

          break;
        }


        /*
        |--------------------------------------------------------------------------
        | Don't change an already paid payment
        |--------------------------------------------------------------------------
        */

        if (payment.status === "PAID") {
          break;
        }


        await updatePayment(
          payment.id,
          {
            status: "CANCELLED",

            stripeSessionId:
              session.id,

            gatewayResponse:
              session,
          }
        );


        await updateOrder(
          orderId,
          {
            paymentStatus: "FAILED",
          }
        );


        console.log(
          `⚠️ Stripe Checkout expired for order ${orderId}`
        );

        break;
      }


      // =====================================================
      // DEFAULT
      // =====================================================

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