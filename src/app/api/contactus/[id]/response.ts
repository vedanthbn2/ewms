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

async function writeSubmissions(submissions: Submission[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(submissions, null, 2), "utf-8");
}

export default async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
