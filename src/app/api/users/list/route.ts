import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../mongodb";
import User from "../../../models/User";

await dbConnect();

export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json();
    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ success: false, error: "Invalid emails array" }, { status: 400 });
    }

    const users = await User.find({ email: { $in: emails } }).select("email name phone").lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users by emails:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
