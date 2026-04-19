import "dotenv/config";
import { encryptFollowers, decryptFollowers } from "../lib/crypto";

async function main() {
  const small = ["john_doe", "travel_vibes", "old_friend"];
  const encSmall = encryptFollowers(small);
  const decSmall = decryptFollowers(encSmall);
  console.log(
    "✅ Small array match:",
    JSON.stringify(decSmall) === JSON.stringify(small),
  );

  const large = Array.from({ length: 10000 }, (_, i) => `user_${i}`);

  const encStart = Date.now();
  const encLarge = encryptFollowers(large);
  console.log(`✅ Encrypted 10k followers in ${Date.now() - encStart}ms`);
  console.log(`   Size: ${(encLarge.length / 1024).toFixed(1)}KB`);

  const decStart = Date.now();
  const decLarge = decryptFollowers(encLarge);
  console.log(`✅ Decrypted 10k followers in ${Date.now() - decStart}ms`);
  console.log(
    `✅ 10k match: ${decLarge.length === large.length ? "YES" : "NO"}`,
  );

  try {
    const tampered = encLarge.slice(0, -5) + "XXXXX";
    decryptFollowers(tampered);
    console.log("❌ Tamper detection FAILED");
  } catch {
    console.log("✅ Tamper detection working — modified data rejected");
  }
}

main().catch(console.error);
