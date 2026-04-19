import { ApifyClient } from "apify-client";
import { logError, logInfo, logWarn } from "./logger";

const rawTokens = process.env.APIFY_API_TOKENS || process.env.APIFY_API_TOKEN || "";
const tokens = rawTokens.split(",").map((t) => t.trim()).filter(Boolean);

if (tokens.length === 0) {
  console.error("[Apify] No API tokens found in environment variables.");
}

let currentTokenIndex = 0;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getClient() {
  const token = tokens[currentTokenIndex] || tokens[0];
  return new ApifyClient({ token });
}

const ACTOR_ID = "8dqiL379xy0Ldrhdr";

export interface ApifyFollower {
  username?: string;
  full_name?: string;
  id?: string;
  is_private?: boolean;
  is_verified?: boolean;
  profile_pic_url?: string;
}

export async function fetchFollowers(
  instaUsername: string,
  maxCount: number = 5000,
): Promise<string[]> {
  await logInfo(`Fetching followers for @${instaUsername}...`);

  const input = {
    usernames: [instaUsername],
    max_count: maxCount,
  };

  for (let attempt = 0; attempt < tokens.length; attempt++) {
    const client = getClient();
    try {
      // Run the actor and wait for it to finish
      const run = await client.actor(ACTOR_ID).call(input);

      if (run.status !== "SUCCEEDED") {
        throw new Error(
          `[Apify] Actor run failed with status: ${run.status} for @${instaUsername}`,
        );
      }

      // Fetch results from dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      if (!items || items.length === 0) {
        // If we still have other keys to try, let's rotate and try again.
        // Instagram often returns 0 items silently when rate-limited.
        if (attempt < tokens.length - 1) {
          await logWarn(
            `Zero followers for @${instaUsername} on key ${currentTokenIndex}. Rotating and retrying...`,
          );
          currentTokenIndex = (currentTokenIndex + 1) % tokens.length;
          continue;
        }

        await logWarn(
          `No followers returned for @${instaUsername} after trying all available keys.`,
        );
        return [];
      }

      // Extract just the usernames
      const followers = (items as ApifyFollower[])
        .map((item) => item.username)
        .filter(Boolean);

      await logInfo(
        `Fetched ${followers.length} followers for @${instaUsername} using key index ${currentTokenIndex}`,
      );

      return followers;
    } catch (err: any) {
      const message = err.message || String(err);
      if (
        message.includes("429") ||
        message.includes("credit") ||
        message.includes("Too Many Requests") ||
        message.includes("limit")
      ) {
        await logWarn(
          `Key index ${currentTokenIndex} failed (rate limit/credit). Rotating to next key...`,
          { message, instaUsername }
        );
        currentTokenIndex = (currentTokenIndex + 1) % tokens.length;
        // The loop will now retry with the new token
      } else {
        // If it's a different error (e.g. account not found), throw it immediately
        throw err;
      }
    }
  }

  // If we exhaust the loop, it means all tokens failed with rate limit/credit errors
  throw new Error(`[Apify] All available API tokens exhausted or rate-limited for @${instaUsername}.`);
}
