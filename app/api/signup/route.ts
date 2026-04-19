import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, instaUsername } = await req.json();

    // Basic validation
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

    // Sanitize username (remove @ if user typed it)
    const cleanUsername = instaUsername.replace(/^@/, "").toLowerCase().trim();

    if (!/^[a-zA-Z0-9_.]{1,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram username" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.instaUsername = cleanUsername;
        await existing.save();
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

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      instaUsername: cleanUsername,
      isActive: true,
    });
    await user.save();
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
