import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("REDIS_URL is not defined in environment variables");
  }
  console.warn("[Redis] REDIS_URL not found, falling back to localhost:6379");
}

export const redis = new IORedis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => {
  console.error("[Redis] Error:", err);
});

redis.on("connect", () => {
  console.log("[Redis] Connected successfully");
});
