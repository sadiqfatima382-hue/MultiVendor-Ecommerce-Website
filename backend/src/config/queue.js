import "dotenv/config";

import { Queue } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password:
    process.env.REDIS_PASSWORD || undefined,
};

export const emailQueue = new Queue(
  "email",
  {
    connection,
  }
);

export { connection };