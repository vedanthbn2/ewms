import { NextRequest, NextResponse } from "next/server";

// Dummy data for demonstration
const messages = [
  {
    id: "1",
    message: "Welcome to the platform! Please let us know if you need any assistance.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    message: "Your recent pickup request has been approved.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  // TODO: Implement authentication and fetch messages for the authenticated receiver
  // For now, return dummy messages

  return NextResponse.json({
    success: true,
    data: messages,
  });
}
