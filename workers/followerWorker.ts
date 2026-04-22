import "dotenv/config";
import { Worker, Job } from "bullmq";
import { connection, FollowerJobData } from "../lib/queue";
import { fetchFollowers } from "../lib/instagram";
import {
  sendWelcomeEmail,
  sendUnfollowerReport,
  sendAccountErrorEmail,
} from "../lib/mailer";
import { User } from "../models/user";
import mongoose from "mongoose";
import { Snapshot } from "@/models/snapshot";
import { connectDB } from "@/lib/db";
import { decryptFollowers, encryptFollowers } from "@/lib/crypto";
import * as Sentry from "@sentry/nextjs";
import { logError, logInfo, logWarn } from "@/lib/logger";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function processJob(job: Job<FollowerJobData>): Promise<void> {
  const { userId, email, instaUsername } = job.data;

  await logInfo(`Processing @${instaUsername} (${userId})`, { job: job.id });

  // 1. Fetch current followers from Apify
  let todayFollowers: string[];
  try {
    todayFollowers = await fetchFollowers(instaUsername);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[Worker] Failed to fetch followers for @${instaUsername}: ${message}`,
    );

    if (
      message.includes("not found") ||
      message.includes("private") ||
      message.includes("not authorized")
    ) {
      await User.findByIdAndUpdate(userId, { isActive: false });
      await sendAccountErrorEmail(email, instaUsername, message);
      await logWarn(`Deactivated @${instaUsername} due to permanent error`, { message });
      return; // don't retry for permanent errors
    }

    throw err; // let BullMQ retry for temporary errors
  }

  // 2. Get most recent snapshot
  const lastSnapshot = await Snapshot.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ takenAt: -1 });

  const snapshotCount = await Snapshot.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  });

  // 3. Save today's snapshot
  await new Snapshot({
    userId: new mongoose.Types.ObjectId(userId),
    followersEncrypted: encryptFollowers(todayFollowers),
    takenAt: new Date(),
  }).save();

  console.log(
    `[Worker] Saved snapshot for @${instaUsername} — ${todayFollowers.length} followers`,
  );
  console.log(job.data);
  // 4. First ever snapshot → welcome email, skip comparison
  if (snapshotCount === 0) {
    await sendWelcomeEmail(email, instaUsername);
    console.log(
      `[Worker] First snapshot for @${instaUsername} — welcome email sent`,
    );
    return;
  }

  // 5. Compare yesterday vs today
  const yesterdayFollowers = lastSnapshot?.followersEncrypted
    ? decryptFollowers(lastSnapshot.followersEncrypted)
    : [];
  const unfollowers = yesterdayFollowers.filter(
    (u) => !todayFollowers.includes(u),
  );

  console.log(
    `[Worker] @${instaUsername}: ${unfollowers.length} unfollowers found`,
  );

  // 6. Send daily report
  await sendUnfollowerReport(email, instaUsername, unfollowers);

  // 7. Polite delay before next job
  await sleep(5000);
}

async function startWorker(): Promise<void> {
  await connectDB();

  const worker = new Worker<FollowerJobData>("follower-check", processJob, {
    connection,
    concurrency: 2,
  });

  worker.on("completed", async (job) => {
    await logInfo(
      `Job ${job.id} completed for @${job.data.instaUsername}`
    );
  });

  worker.on("failed", async (job, err) => {
    await logError(
      `Job ${job?.id} failed for @${job?.data.instaUsername}`,
      { error: err.message }
    );
  });

  worker.on("error", (err) => {
    console.error("[Worker] Worker error:", err);
  });

  console.log("[Worker] BullMQ worker started, waiting for jobs...");
}

startWorker().catch((err) => {
  console.error("[Worker] Fatal error:", err);
  process.exit(1);
});
