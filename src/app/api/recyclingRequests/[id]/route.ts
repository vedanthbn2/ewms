import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../mongodb';
import RecyclingRequest from '../../../models/RecyclingRequest';

await dbConnect();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const parts = pathname.split('/');
    const id = parts[parts.length - 1];
    console.log("API GET /recyclingRequests/[id] called with ID:", id);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing request ID' }, { status: 400 });
    }

    const requestData = await RecyclingRequest.findById(id);
    if (!requestData) {
      return NextResponse.json({ success: false, error: 'Recycling request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: requestData });
  } catch (error: unknown) {
    console.error('Error fetching recycling request by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
