import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../mongodb';
import User from '../../../models/User';

await dbConnect();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const parts = pathname.split('/');
    const id = parts[parts.length - 1];
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing user ID' }, { status: 400 });
    }

const userData = await User.findById(id).select('name email phone createdAt approved role');
    if (!userData) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: userData });
  } catch (error: unknown) {
    console.error('Error fetching user by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
