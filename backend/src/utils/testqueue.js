// import "dotenv/config";

// import { addEmailJob } from "../queues/email.queue.js";

// const job = await addEmailJob({
//   to: process.env.SMTP_USER,

//   type: "ORDER_CONFIRMATION",

//   data: {
//     name: "Test Customer",
//     orderNumber: "TEST-1001",
//     grandTotal: "5000",
//   },
// });

// console.log(
//   "✅ Email job added:",
//   job.id
// );

// process.exit(0);

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