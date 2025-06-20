import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'storage.json');

// Initialize requests from file or empty array
let requests: any[] = [];

async function loadRequests() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    if (!data || data.trim() === '') {
      // File is empty, initialize with empty array
      requests = [];
      await fs.writeFile(DATA_FILE, '[]');
    } else {
      try {
        requests = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing requests JSON:', parseError);
        requests = [];
        await fs.writeFile(DATA_FILE, '[]');
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist yet, initialize with empty array
      await fs.writeFile(DATA_FILE, '[]');
      requests = [];
    } else {
      console.error('Error loading requests:', error);
    }
  }
}

async function saveRequests() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2));
  } catch (error: unknown) {
    console.error('Error saving requests:', error);
  }
}

async function initializeRequests() {
  await loadRequests();
}
// Load existing requests on server start and wait for completion
initializeRequests();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    await loadRequests(); // Load existing requests before adding new one

    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('multipart/form-data')) {
      // Parse FormData
      const formData = await request.formData();
      const jsonData = formData.get('data');
      if (typeof jsonData === 'string') {
        data = JSON.parse(jsonData);
      } else {
        return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 });
      }
      // Optionally handle deviceImage file if needed
      // const deviceImage = formData.get('deviceImage');
      // You can save the file or process it here if required
    } else if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported content type' }, { status: 415 });
    }

    const requestData = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending",
      location: data.location || null
    };

    requests.push(requestData);
    await saveRequests();
    console.log('Request saved to file');

    // Send notification to user after request submission
    await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data.userId,
        message: 'Your request has been placed successfully. Our team will reach you shortly.',
      }),
    });

    return NextResponse.json({
      success: true,
      data: requestData
    });

  } catch (error: unknown) {
    console.error('SUBMISSION ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  console.log('ADMIN FETCHING REQUESTS');
  await loadRequests(); // Reload requests from storage.json on each GET request
  // Sort requests by createdAt descending (newest first)
  const sortedRequests = requests.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
  return NextResponse.json(sortedRequests);
}

export async function PATCH(request: Request) {
  try {
    await loadRequests(); // Load existing requests before updating

    const data = await request.json();
    const { id, updates } = data;

    console.log("PATCH request received with id:", id);
    const index = requests.findIndex((req) => req._id === id || req.id === id);
    if (index === -1) {
      console.log("Request not found for id:", id);
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    console.log("Request found:", requests[index]);

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: "Missing id or updates" }, { status: 400 });
    }

    requests[index] = { ...requests[index], ...updates };
    await saveRequests();

    // Send notifications based on status updates and assignments
    const updatedRequest = requests[index];

    // Notify user when admin approves and assigns receiver
    if (updates.status === "approved" && (updates.receivedBy || updates.assignedReceiver)) {
      await fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: updatedRequest.userId,
          message: "Your e-waste pickup request has been approved and a receiver has been assigned. They will contact you soon.",
        }),
      });

      // Notify receiver about assigned task
      const receiverId = updates.receivedBy || (updates.assignedReceiver && updates.assignedReceiver.id);
      if (receiverId) {
        await fetch(`${BASE_URL}/api/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: receiverId,
            message: 'You have been assigned a new e-waste pickup task. Please pick up and deliver to the recycler center as soon as possible.',
          }),
        });
      }
    }

    // Notify user when e-waste is picked up (status changed to collected)
    if (updates.status === "collected") {
      await fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: updatedRequest.userId,
          message: "Your e-waste has been picked up successfully. Thank you for your contribution.",
        }),
      });

      // Notify receiver thanking for acceptance
      await fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: updates.receivedBy,
          message: 'Thank you for accepting the e-waste pickup task.',
        }),
      });
    }

    // Notify user when e-waste reaches recycler center (status changed to received)
    if (updates.status === "received") {
      await fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: updatedRequest.userId,
          message: "Your e-waste has reached our recycler center safely. We appreciate your support for a cleaner environment.",
        }),
      });

      // Notify receiver task completion
      await fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: updates.receivedBy,
          message: 'Your e-waste pickup task was completed successfully.',
        }),
      });
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error: unknown) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 });
  }
}
