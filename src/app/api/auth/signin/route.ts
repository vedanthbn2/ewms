import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../mongodb";
import User from "../../../models/User";
import Receiver from "../../../models/Receiver";
import fs from "fs";
import path from "path";

await dbConnect();

const adminCredentialsPath = path.resolve(process.cwd(), "users.json");
const adminCredentialsRaw = fs.readFileSync(adminCredentialsPath, "utf-8");
const adminCredentials = JSON.parse(adminCredentialsRaw).find(
  (user: any) => user.role === "admin"
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    // Check User collection first
    const user = await User.findOne({ email: emailTrimmed });
    if (user) {
      const isMatch = await bcrypt.compare(passwordTrimmed, user.password);
      if (isMatch) {
        return NextResponse.json({
          success: true,
          id: user._id,
          email: user.email,
          fullName: user.name,
          phoneNumber: user.phone,
          token: "mock-token-" + Date.now(),
          role: user.role === "admin" ? "admin" : "user",
        });
      }
    }

    // Check Receiver collection
    const receiver = await Receiver.findOne({ email: emailTrimmed });
    if (receiver) {
      const isMatch = await bcrypt.compare(passwordTrimmed, receiver.password);
      if (isMatch) {
        return NextResponse.json({
          success: true,
          id: receiver._id,
          email: receiver.email,
          fullName: receiver.name,
          phoneNumber: receiver.phone,
          token: "mock-token-" + Date.now(),
          role: "receiver",
        });
      }
    }

    // Check local admin credentials as fallback
    console.log("Checking local admin credentials fallback");
    console.log("adminCredentials:", adminCredentials);
    console.log("emailTrimmed:", emailTrimmed);
    console.log("passwordTrimmed:", passwordTrimmed);
    if (
      adminCredentials &&
      emailTrimmed === adminCredentials.email.toLowerCase() &&
      passwordTrimmed === adminCredentials.password
    ) {
      console.log("Local admin credentials matched");
      // Remove any admin user in DB without admin role
      // await User.deleteMany({ email: emailTrimmed, role: { $ne: "admin" } });

      return NextResponse.json({
        success: true,
        id: "local-admin",
        email: adminCredentials.email,
        fullName: adminCredentials.name,
        phoneNumber: adminCredentials.phone,
        token: "mock-token-" + Date.now(),
        role: "admin",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
