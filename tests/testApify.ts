import "dotenv/config";
import { fetchFollowers } from "../lib/instagram";

async function main() {
  console.log("Fetching followers...");
  const followers = await fetchFollowers("pratyushsinghaa", 50);
  console.log(`✅ Got ${followers.length} followers`);
  console.log("First 5:", followers.slice(0, 5));
}

main().catch(console.error);
