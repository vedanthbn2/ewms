import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Submission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  adminResponse: string;
  createdAt: string;
}

const dataDir = path.resolve("./src/data");
const dataFilePath = path.join(dataDir, "contactus_submissions.json");

async function readSubmissions(): Promise<Submission[]> {
  try {
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeSubmissions(submissions: Submission[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(submissions, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, email, phone, message } = data;

    if (!name || !email || !phone || !message) {
      console.error("Missing required fields in submission:", data);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submissions = await readSubmissions();

    const newSubmission: Submission = {
      _id: (Date.now() + Math.random()).toString(36),
      name,
      email,
      phone: phone || "",
      message,
      adminResponse: "",
      createdAt: new Date().toISOString(),
    };

    submissions.push(newSubmission);

    await writeSubmissions(submissions);

    // Notify all admins about new user feedback
    try {
      const User = (await import('../../models/User')).default;
      const admins = await User.find({ role: 'admin' }).select('_id name').lean();
      for (const admin of admins) {
        const adminNotificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: admin._id.toString(),
            message: `New user feedback received from ${name || email || 'a user'}.`,
          }),
        });
        const adminNotificationResult = await adminNotificationResponse.json();
        if (!adminNotificationResult.success) {
          console.error(`Failed to create notification for admin ${admin._id}:`, adminNotificationResult.error);
        }
      }
    } catch (error) {
      console.error('Error creating admin notifications for feedback:', error);
    }

    return NextResponse.json({ message: "Submission saved", submission: newSubmission }, { status: 201 });
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const submissions = await readSubmissions();
  if (email) {
    const filtered = submissions.filter((sub) => sub.email === email);
    return NextResponse.json(filtered);
  }
  return NextResponse.json(submissions);
}

// Handle admin response update
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const data = await request.json();
    const { adminResponse } = data;

    if (!id || !adminResponse) {
      return NextResponse.json({ error: "Missing id or adminResponse" }, { status: 400 });
    }

    const submissions = await readSubmissions();

    const index = submissions.findIndex((sub) => sub._id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    submissions[index].adminResponse = adminResponse;

    await writeSubmissions(submissions);

    return NextResponse.json({ message: "Admin response updated", submission: submissions[index] });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
