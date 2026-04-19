import { Queue } from "bullmq";
import IORedis from "ioredis";

export interface FollowerJobData {
  userId: string;
  email: string;
  instaUsername: string;
}

export const connection = new IORedis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const followerQueue = new Queue<FollowerJobData>("follower-check", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

followerQueue.on("error", (err: unknown) => {
  console.error("[Queue] BullMQ queue error:", err);
});

console.log("[Queue] BullMQ queue initialized");
