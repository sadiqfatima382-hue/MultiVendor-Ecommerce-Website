import "dotenv/config";

import { addEmailJob } from "../queues/email.queue.js";

const job = await addEmailJob({
  to: process.env.SMTP_USER,

  type: "ORDER_CONFIRMATION",

  data: {
    name: "Test Customer",
    orderNumber: "TEST-1001",
    grandTotal: "5000",
  },
});

console.log(
  "✅ Email job added:",
  job.id
);

process.exit(0);