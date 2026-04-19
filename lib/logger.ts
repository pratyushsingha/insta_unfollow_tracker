import { Log } from "@/models/Log";
import { connectDB } from "@/lib/db";

export async function logInfo(message: string, meta?: Record<string, any>) {
  console.log(`[INFO] ${message}`, meta || "");
  try {
    await connectDB();
    await Log.create({ level: "info", message, meta });
  } catch (err) {
    console.error("Failed to save info log to DB:", err);
  }
}

export async function logWarn(message: string, meta?: Record<string, any>) {
  console.warn(`[WARN] ${message}`, meta || "");
  try {
    await connectDB();
    await Log.create({ level: "warn", message, meta });
  } catch (err) {
    console.error("Failed to save warn log to DB:", err);
  }
}

export async function logError(message: string, meta?: Record<string, any>) {
  console.error(`[ERROR] ${message}`, meta || "");
  try {
    await connectDB();
    await Log.create({ level: "error", message, meta });
  } catch (err) {
    console.error("Failed to save error log to DB:", err);
  }
}
