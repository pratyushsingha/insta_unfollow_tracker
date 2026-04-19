import "dotenv/config";
import { connectDB } from "../lib/db";
import { User } from "../models/User";
import { Snapshot } from "../models/snapshot";
import { encryptFollowers, decryptFollowers } from "../lib/crypto";

async function main() {
  await connectDB();
  console.log("✅ MongoDB connected!");

  const user = await User.create({
    email: "pratyushsingha83@gmaill.com",
    instaUsername: "pratyushsinghaa",
    isActive: true,
  });
  console.log("✅ User created:", user._id.toString());

  const fakeFollowers = ["john_doe", "travel_vibes", "old_friend", "bonkita04"];
  await Snapshot.create({
    userId: user._id,
    followersEncrypted: encryptFollowers(fakeFollowers),
    takenAt: new Date(),
  });
  console.log("✅ Encrypted snapshot saved");

  const found = await Snapshot.findOne({ userId: user._id });
  const decrypted = decryptFollowers(found!.followersEncrypted);
  console.log("✅ Decrypted followers:", decrypted);
  console.log(
    "✅ Match:",
    JSON.stringify(decrypted) === JSON.stringify(fakeFollowers) ? "YES" : "NO",
  );

//   await Snapshot.deleteMany({ userId: user._id });
//   await User.deleteOne({ email: "pratyushsingha83@gmail.com" });
  console.log("✅ Cleaned up");

  process.exit(0);
}

main().catch(console.error);
