import { connectDB } from "@/lib/db";
import { Snapshot } from "@/models/snapshot";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Snapshot.deleteMany({ userId: user._id });

  await User.deleteOne({ _id: user._id });

  return NextResponse.json({
    message: "All your data has been permanently deleted.",
  });
}
