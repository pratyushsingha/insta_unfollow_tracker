import "dotenv/config";
import { connectDB } from "../lib/db";
import { User } from "../models/user";
import { Snapshot } from "../models/snapshot";
import { fetchFollowers } from "../lib/instagram";
import { sendWelcomeEmail } from "../lib/mailer";
import { encryptFollowers } from "../lib/crypto";
import mongoose from "mongoose";

async function manualSetup(identifier: string) {
  try {
    await connectDB();

    const cleanIdentifier = identifier.replace(/^@/, "").toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ instaUsername: cleanIdentifier }, { email: cleanIdentifier }],
    });

    if (!user) {
      console.error("❌ User not found in database.");
      process.exit(1);
    }

    console.log(`\n🚀 Manually setting up @${user.instaUsername} (${user.email})...`);

    // 1. Check if they already have snapshots
    const existingSnapshots = await Snapshot.countDocuments({ userId: user._id });
    if (existingSnapshots > 0) {
      console.log(`ℹ️ User already has ${existingSnapshots} snapshot(s). Skipping baseline creation.`);
    } else {
      console.log(`📸 Fetching baseline followers from Instagram...`);
      const followers = await fetchFollowers(user.instaUsername);
      
      console.log(`💾 Saving initial snapshot (${followers.length} followers)...`);
      await new Snapshot({
        userId: user._id,
        followersEncrypted: encryptFollowers(followers),
        takenAt: new Date(),
      }).save();
    }

    // 2. Send welcome email regardless (to fix "missed email" issues)
    console.log(`📧 Sending Welcome Email via Resend...`);
    await sendWelcomeEmail(user.email, user.instaUsername);

    console.log("\n✅ SUCCESS: Setup complete and email sent!\n");
    process.exit(0);
  } catch (err: any) {
    console.error("\n❌ FATAL ERROR:", err.message);
    process.exit(1);
  }
}

const arg = process.argv[2];
if (!arg) {
  console.log("\nUsage: npx tsx scripts/manual-setup.ts <email_or_username>");
  console.log("Example: npx tsx scripts/manual-setup.ts \"@cristiano\"\n");
  process.exit(1);
}

manualSetup(arg);
