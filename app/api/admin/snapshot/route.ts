import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { followerQueue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { identifier, adminSecret } = await req.json();

    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret || adminSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!identifier) {
      return NextResponse.json({ error: "Missing identifier (username or email)" }, { status: 400 });
    }

    await connectDB();

    // Find user by username or email
    const cleanIdentifier = identifier.replace(/^@/, "").toLowerCase().trim();
    const user = await User.findOne({
      $or: [
        { instaUsername: cleanIdentifier },
        { email: cleanIdentifier }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add job to queue
    await followerQueue.add(
      `manual-check-${user._id}-${Date.now()}`,
      {
        userId: user._id.toString(),
        email: user.email,
        instaUsername: user.instaUsername,
      },
      {
        jobId: `manual-${user._id}-${Date.now()}`,
      }
    );

    return NextResponse.json({
      success: true,
      message: `Manual snapshot triggered for @${user.instaUsername}`,
      data: {
        userId: user._id,
        instaUsername: user.instaUsername,
        email: user.email
      }
    });

  } catch (err: any) {
    console.error("[Admin Snapshot Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
