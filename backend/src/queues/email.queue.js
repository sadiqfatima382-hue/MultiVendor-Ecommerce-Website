import {Queue } from "bullmq";

const emailQueue = new Queue("email-queue", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

emailQueue.on("error", (error) => {
  console.error("❌ Email queue error:", error);
});

export default emailQueue;