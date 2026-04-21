import "dotenv/config";
import IORedis from "ioredis";

async function testRedis() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.error("❌ REDIS_URL not found in environment");
    process.exit(1);
  }
  console.log(`Testing Redis connection to: ${redisUrl}`);

  const redis = new IORedis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
  });

  try {
    const result = await redis.ping();
    console.log(`✅ Redis connection successful! Response: ${result}`);
  } catch (error: any) {
    console.error(`❌ Redis connection failed:`, error.message);
  } finally {
    redis.disconnect();
    process.exit(0);
  }
}

testRedis();
