import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import env from "./env.js";

const redisUrl =
  env.REDIS_URL || "redis://localhost:6379";

const pubClient = createClient({
  url: redisUrl,
});

const subClient = pubClient.duplicate();

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
    await Promise.all([
      pubClient.connect(),
      subClient.connect(),
    ]);

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