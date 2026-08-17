import {Queue } from "bullmq";

// export async function addEmailJob({
//   to,
//   type,
//   data,
// }) {
//   return emailQueue.add(
//     type,
//     {
//       to,
//       type,
//       data,
//     },
//     {
//       attempts: 3,

//       backoff: {
//         type: "exponential",
//         delay: 5000,
//       },

//       removeOnComplete: 100,

//       removeOnFail: 500,
//     }
//   );
// }

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