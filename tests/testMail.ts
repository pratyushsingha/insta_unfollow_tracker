import { sendUnfollowerReport, sendWelcomeEmail } from "../lib/mailer";
import "dotenv/config";

async function main() {
  console.log("Testing welcome email...");
  await sendWelcomeEmail("pratyushsingha83@gmail.com", "pratyushsingha");
  console.log("✅ Welcome email sent!");

  console.log("Testing unfollow report...");
  await sendUnfollowerReport("pratyushsingha83@gmail.com", "pratyushsingha", [
    "john_doe",
    "travel_vibes",
    "old_friend_99",
  ]);
  console.log("✅ Report email sent!");
}

main().catch(console.error);
