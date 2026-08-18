import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "../config/queue.js";
import {  sendOtpEmail,  sendPasswordResetEmail,  sendOrderConfirmationEmail,} from "../utils/mailer.js";

const worker = new Worker(
  "email-queue",
  async (job) => {
    const {
      to,
      type,
      data,
    } = job.data;

    console.log(
      `📧 Processing email job: ${job.id}`
    );

    switch (type) {
      case "OTP":
        await sendOtpEmail({
          to,
          ...data,
        });
        break;

      case "PASSWORD_RESET":
        await sendPasswordResetEmail({
          to,
          ...data,
        });
        break;

      case "ORDER_CONFIRMATION":
        await sendOrderConfirmationEmail({
          to,
          ...data,
        });
        break;

      default:
        throw new Error(
          `Unknown email type: ${type}`
        );
    }

    console.log(
      `✅ Email job ${job.id} completed.`
    );
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(
    `✅ Job completed: ${job.id}`
  );
});

worker.on("failed", (job, error) => {
  console.error(
    `❌ Job failed: ${job?.id}`,
    error.message
  );
});

console.log("🚀 Email worker started.");