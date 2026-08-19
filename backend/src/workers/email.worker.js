import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "../config/queue.js";
import { sendOtpEmail, sendPasswordResetEmail, sendOrderConfirmationEmail, } from "../utils/mailer.js";

const emailWorker = new Worker(
  "email-queue",

  async (job) => {
    console.log(
      `📧 Processing email job: ${job.id}`
    );

    const {
      type,
      to,
      subject,
      text,
      html,
      ...data
    } = job.data;

    console.log(
      "📨 Email type:",
      type
    );

    switch (type) {
      case "ORDER_PLACED": {
        const {
          to,
          name,
          orderNumber,
          grandTotal,
        } = job.data;

        await sendOrderConfirmationEmail({
          to,
          name,
          orderNumber,
          grandTotal,
        });

        console.log(
          `✅ Order confirmation email sent to ${to}`
        );

        break;
      }

      case "OTP": {
        const {
          to,
          name,
          otp,
        } = job.data;

        await sendOtpEmail({
          to,
          name,
          otp,
        });

        console.log(
          `✅ OTP email sent to ${to}`
        );

        break;
      }

      case "PASSWORD_RESET": {
        const {
          to,
          name,
          resetUrl,
        } = job.data;

        await sendPasswordResetEmail({
          to,
          name,
          resetUrl,
        });

        console.log(
          `✅ Password reset email sent to ${to}`
        );

        break;
      }

      default:
        throw new Error(
          `Unknown email type: ${type}`
        );
    }

    return {
      success: true,
      emailType: type,
      recipient: to,
    };
  },

  {
    connection,
  }
);

// ==============================================
// JOB COMPLETED
// ==============================================

emailWorker.on(
  "completed",
  (job) => {
    console.log(
      `✅ Job ${job.id} completed`
    );
  }
);

// ==============================================
// JOB FAILED
// ==============================================

emailWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `❌ Job failed: ${job?.id}`,
      error.message
    );
  }
);

// ==============================================
// WORKER ERROR
// ==============================================

emailWorker.on(
  "error",
  (error) => {
    console.error(
      "❌ Worker error:",
      error
    );
  }
);

console.log(
  "🚀 Email worker started."
);