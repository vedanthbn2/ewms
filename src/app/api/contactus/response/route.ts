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
    await fs.mkdir(dataDir, { recursive: true });
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
  }

  const submissions = await readSubmissions();
  const submission = submissions.find((sub) => sub.email === email);

  if (!submission) {
    return NextResponse.json({ adminResponse: null });
  }

  return NextResponse.json({ adminResponse: submission.adminResponse });
}
