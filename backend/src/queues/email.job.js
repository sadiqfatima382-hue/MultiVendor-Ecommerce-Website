import { emailQueue } from "./email.queue.js";

export async function addEmailJob({
  to,
  type,
  data,
}) {
  return emailQueue.add(
    type,
    {
      to,
      type,
      data,
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: 100,

      removeOnFail: 500,
    }
  );
}