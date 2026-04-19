import { connectDB } from "@/lib/db";
import { Snapshot } from "@/models/snapshot";
import { decryptFollowers } from "@/lib/crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { snapshotId, adminSecret } = await req.json();

    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret || adminSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!snapshotId) {
      return NextResponse.json({ error: "Missing snapshotId" }, { status: 400 });
    }

    await connectDB();

    const snapshot = await Snapshot.findById(snapshotId);
    if (!snapshot) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
    }

    const followers = decryptFollowers(snapshot.followersEncrypted);

    return NextResponse.json({
      success: true,
      data: {
        snapshotId: snapshot._id,
        userId: snapshot.userId,
        timestamp: snapshot.createdAt,
        count: followers.length,
        followers: followers
      }
    });

  } catch (err: any) {
    console.error("[Admin Decrypt Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
