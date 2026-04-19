import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { Snapshot } from "@/models/snapshot";

export async function POST(req: NextRequest) {
  try {
    const { email, deleteData } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email address." },
        { status: 404 },
      );
    }

    let dataDeletedMsg = "";
    if (deleteData) {
      await Snapshot.deleteMany({ userId: user._id });
      dataDeletedMsg = " All your historical follower data has been deleted.";
    }

    if (!user.isActive) {
      return NextResponse.json({
        message: `You have already unsubscribed.${dataDeletedMsg}`,
      });
    }

    user.isActive = false;
    await user.save();

    return NextResponse.json({
      message: `Done! We'll stop tracking @${user.instaUsername}. You won't receive any more emails.${dataDeletedMsg}`,
    });
  } catch (err: unknown) {
    console.error("[API /unsubscribe] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
