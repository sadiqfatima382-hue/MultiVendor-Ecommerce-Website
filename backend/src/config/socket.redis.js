import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import env from "./env.js";

const redisUrl =
  env.REDIS_URL || "redis://localhost:6379";

const pubClient = new Redis(redisUrl);
const subClient = new Redis(redisUrl);

pubClient.on("error", (error) => {
  console.error(
    "❌ Redis Publisher Error:",
    error
  );
});

subClient.on("error", (error) => {
  console.error(
    "❌ Redis Subscriber Error:",
    error
  );
});

export async function initializeSocketRedis(io) {
  try {
    io.adapter(
      createAdapter(
        pubClient,
        subClient
      )
    );

    console.log(
      "🔴 Socket.IO Redis adapter connected"
    );

    return {
      pubClient,
      subClient,
    };
  } catch (error) {
    console.error(
      "❌ Socket.IO Redis adapter failed:",
      error
    );

    throw error;
  }
}