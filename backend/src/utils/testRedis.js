import redis from "../config/redis.js";

try {
  await redis.set(
    "test:key",
    "Redis is working"
  );

  const value =
    await redis.get("test:key");

  console.log("✅ Redis value:", value);

  await redis.del("test:key");

  console.log("✅ Redis test completed.");
} catch (error) {
  console.error(
    "❌ Redis test failed:",
    error.message
  );
} finally {
  await redis.quit();
}