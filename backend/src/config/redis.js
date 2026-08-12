import "dotenv/config";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),

  password:
    process.env.REDIS_PASSWORD || undefined,

  maxRetriesPerRequest: null,

  retryStrategy(times) {
    const delay = Math.min(
      times * 100,
      3000
    );

    return delay;
  },
});

redis.on("connect", () => {
  console.log("🔗 Redis connecting...");
});

redis.on("ready", () => {
  console.log("✅ Redis is ready.");
});

redis.on("error", (error) => {
  console.error(
    "❌ Redis error:",
    error.message
  );
});

redis.on("close", () => {
  console.log("⚠️ Redis connection closed.");
});

export default redis;