import "dotenv/config";

import emailQueue from "../queues/email.queue.js";

const job =
  await emailQueue.add(
    "send-test-email",
    {
      to: process.env.TEST_EMAIL,

      subject:
        "BullMQ Test Email",

      text:
        "BullMQ + Redis + Nodemailer are working successfully!",

      html: `
        <h2>BullMQ Test</h2>
        <p>
          BullMQ, Redis and Nodemailer
          are working successfully! 🚀
        </p>
      `,
    }
  );

console.log(
  "📨 Email job added:",
  job.id
);

await emailQueue.close();