import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { followerQueue } from "@/lib/queue";
import { getProfileInfo } from "@/lib/instagram";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, instaUsername } = await req.json();

    if (!email || !instaUsername) {
      return NextResponse.json(
        { error: "Email and Instagram username are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // 1. URL Validation Check
    if (instaUsername.includes("instagram.com") || instaUsername.includes("http")) {
      return NextResponse.json(
        { error: "Please enter only your username (e.g. 'pratyushsingha'), not the full URL." },
        { status: 400 },
      );
    }

    const cleanUsername = instaUsername.replace(/^@/, "").toLowerCase().trim();

    if (!/^[a-zA-Z0-9_.]{1,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram username" },
        { status: 400 },
      );
    }

    try {
      const profile = await getProfileInfo(cleanUsername);
      
      if (!profile.exists) {
        return NextResponse.json({ error: "Instagram account not found. Please check the spelling." }, { status: 400 });
      }

      if (profile.isPrivate) {
        return NextResponse.json({ 
          error: "Your account is private. We can only track public accounts. Please make it public and try again." 
        }, { status: 400 });
      }
    } catch (err: any) {
      console.error("[Signup] Profile check skipped due to error:", err.message);
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.instaUsername = cleanUsername;
        await existing.save();

        await followerQueue.add(`check-${existing._id}`, {
          userId: existing._id.toString(),
          email: existing.email,
          instaUsername: cleanUsername,
        });

        return NextResponse.json({
          message: `Welcome back! We'll start tracking @${cleanUsername} again.`,
          reactivated: true,
        });
      }
      return NextResponse.json(
        { error: "This email is already signed up. Check your inbox!" },
        { status: 409 },
      );
    }

    const user = new User({
      email: email.toLowerCase(),
      instaUsername: cleanUsername,
      isActive: true,
    });
    await user.save();

    await followerQueue.add(`check-${user._id}`, {
      userId: user._id.toString(),
      email: user.email,
      instaUsername: cleanUsername,
    });

    return NextResponse.json(
      {
        message: `You're signed up! We'll start tracking @${cleanUsername} and email you tomorrow morning.`,
        username: cleanUsername,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("[API /signup] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
