import redis from "../config/redis.js";

export async function setCache(
  key,
  value,
  expiryInSeconds
) {
  const serializedValue =
    JSON.stringify(value);

  if (expiryInSeconds) {
    await redis.set(
      key,
      serializedValue,
      "EX",
      expiryInSeconds
    );

    return;
  }

  await redis.set(
    key,
    serializedValue
  );
}

export async function getCache(key) {
  const value =
    await redis.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}

export async function deleteCache(key) {
  await redis.del(key);
}